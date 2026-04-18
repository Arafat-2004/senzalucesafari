import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL ?? ''

// Handle SSL explicitly via Pool config instead of relying on the sslmode URL parameter.
// Supabase's PgBouncer pooler uses certificates with a self-signed CA that isn't in the
// system trust store, so certificate verification must be skipped for this connection.
//
// IMPORTANT: This is intentionally scoped to the postgres connection only.
// Do NOT set NODE_TLS_REJECT_UNAUTHORIZED=0, which would disable certificate
// verification globally for all HTTPS/TLS connections in the process.
const url = new URL(connectionString)
url.searchParams.delete('sslmode')

const adapter = new PrismaPg({
    connectionString: url.toString(),
    ssl: { rejectUnauthorized: false },
    max: 5,             // limit concurrent connections for pooler compatibility
})

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
