import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'
import { warn, error } from './reliability/logger'

// Fix for pg 8.20+ SSL behavior change with Supabase
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const globalForPrisma = globalThis as unknown as {
    prisma: ReturnType<typeof createPrismaClient> | undefined
}

function createPrismaClient() {
    let adapter;
    if (typeof process !== 'undefined' && process.env.DATABASE_URL) {
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
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
                        if (duration > 500) {
                            warn(`Slow Query (${Math.round(duration)}ms)`, { model, operation, durationMs: duration })
                        }
                        return result
                    } catch (err: any) {
                        attempt++
                        const isTransient = err?.code === 'P2024' || err?.message?.includes('timeout') || err?.message?.includes('connection')
                        if (isTransient && attempt <= MAX_RETRIES) {
                            warn(`Retry ${attempt}/${MAX_RETRIES}`, { model, operation, error: err.message })
                            await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 100))
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