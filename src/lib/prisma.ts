import { Pool, type PoolConfig } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'
import { warn, error } from './reliability/logger'

const globalForPrisma = globalThis as unknown as {
    prisma: ReturnType<typeof createPrismaClient> | undefined
}

function createPrismaClient() {
    if (!process.env.PRISMA_QUERY_ENGINE_LIBRARY) {
        process.env.PRISMA_QUERY_ENGINE_LIBRARY = require('path').resolve(
            process.cwd(), 'src/generated/prisma/query_engine-windows.dll.node'
        )
    }
    const rawConnectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || ''

    const isLocalhost = rawConnectionString.includes('localhost') || rawConnectionString.includes('127.0.0.1')

    let adapter: PrismaPg | undefined
    if (rawConnectionString) {
        const url = new URL(rawConnectionString)
        url.searchParams.delete('pgbouncer')
        url.searchParams.delete('sslmode')
        const connectionString = url.toString()

        const poolConfig: PoolConfig = {
            connectionString,
            max: 3,
            idleTimeoutMillis: 120000,
            connectionTimeoutMillis: 3000,
            statement_timeout: 15000,
            allowExitOnIdle: false,
        }

        if (!isLocalhost) {
            poolConfig.ssl = { rejectUnauthorized: false }
            poolConfig.keepAlive = true
            poolConfig.keepAliveInitialDelayMillis = 10000
        }

        const pool = new Pool(poolConfig)

        pool.on('error', (err) => {
            const errMsg = err.message
            const isConnectionError = 
                errMsg.toLowerCase().includes('connection') ||
                errMsg.toLowerCase().includes('timeout') ||
                errMsg.toLowerCase().includes('reach database') ||
                errMsg.toLowerCase().includes('pool') ||
                errMsg.toLowerCase().includes('socket') ||
                errMsg.toLowerCase().includes('econn') ||
                errMsg.toLowerCase().includes('enotfound')

            if (isConnectionError) {
                warn('PostgreSQL pool connection warning', { error: errMsg })
            } else {
                error('PostgreSQL pool error', { error: errMsg })
            }
        })

        pool.on('connect', () => {
            // Pool connections are expected in normal operation — no logging needed
        })

        pool.on('remove', () => {
            // Pool connection removals are expected in normal operation — no logging needed
        })

        adapter = new PrismaPg(pool)
    }

    const client = new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development'
            ? ['warn', 'error']
            : ['error'],
    })

    return client.$extends({
        query: {
            async $allOperations({ operation, model, args, query }) {
                const start = performance.now()
                try {
                    const result = await query(args)
                    const duration = performance.now() - start
                    if (duration > 1000) {
                        warn(`Slow Query (${Math.round(duration)}ms)`, { model, operation, durationMs: duration })
                    }
                    return result
                } catch (err: unknown) {
                    const errMsg = err instanceof Error ? err.message : String(err)
                    const isConnectionError = 
                        errMsg.toLowerCase().includes('connection') ||
                        errMsg.toLowerCase().includes('timeout') ||
                        errMsg.toLowerCase().includes('reach database') ||
                        errMsg.toLowerCase().includes('pool') ||
                        errMsg.toLowerCase().includes('socket') ||
                        errMsg.toLowerCase().includes('econn') ||
                        errMsg.toLowerCase().includes('enotfound')

                    if (isConnectionError) {
                        warn('DB connection issue (falling back/handling)', { model, operation, error: errMsg })
                    } else {
                        error('DB query failed', { model, operation, error: errMsg })
                    }
                    throw err
                }
            },
        },
    })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
