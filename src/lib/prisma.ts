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
            max: 10,
            idleTimeoutMillis: 120000,
            connectionTimeoutMillis: 10000,
            statement_timeout: 30000,
            allowExitOnIdle: false,
        }

        if (!isLocalhost) {
            poolConfig.ssl = { rejectUnauthorized: false }
            poolConfig.keepAlive = true
            poolConfig.keepAliveInitialDelayMillis = 10000
        }

        const pool = new Pool(poolConfig)

        pool.on('error', (err) => {
            warn('PostgreSQL pool error', { error: err.message })
        })

        pool.on('connect', () => {
            warn('PostgreSQL pool connected')
        })

        pool.on('remove', () => {
            warn('PostgreSQL client removed from pool')
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
                const MAX_RETRIES = 2
                let attempt = 0

                while (attempt <= MAX_RETRIES) {
                    try {
                        const result = await query(args)
                        const duration = performance.now() - start
                        if (duration > 1000) {
                            warn(`Slow Query (${Math.round(duration)}ms)`, { model, operation, durationMs: duration })
                        }
                        return result
                    } catch (err: unknown) {
                        attempt++
                        const errorCode = typeof err === 'object' && err !== null && 'code' in err ? String((err as { code?: unknown }).code) : ''
                        const errorMessage = err instanceof Error ? err.message : String(err)
                        const isTransient = errorCode === 'P2024'
                            || errorCode === 'P1001'
                            || errorCode === 'ECONNRESET'
                            || errorCode === 'ECONNREFUSED'
                            || errorCode === 'XX000'
                            || errorMessage.includes('EMAXCONNSESSION')
                            || errorMessage.includes('max clients reached')
                            || errorMessage.includes('timeout')
                            || errorMessage.includes('connection')
                            || errorMessage.includes('certificate')
                            || errorMessage.includes('terminated')
                            || errorMessage.includes('reach database')
                        if (isTransient && attempt <= MAX_RETRIES) {
                            const delay = Math.pow(2, attempt) * 500 + Math.random() * 500
                            warn(`Retry ${attempt}/${MAX_RETRIES}`, { model, operation, error: errorMessage, delay })
                            await new Promise(r => setTimeout(r, delay))
                            continue
                        }
                        error('DB query failed', { model, operation, error: err instanceof Error ? err.message : String(err) })
                        throw err
                    }
                }
            },
        },
    })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
