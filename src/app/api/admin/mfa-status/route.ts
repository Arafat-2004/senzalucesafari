import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/admin-auth'
import { logger } from '@/lib/reliability/logger'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.adminUser.findUnique({
            where: { id: session.id },
            select: { mfaEnabled: true },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({ mfaEnabled: user.mfaEnabled })
    } catch (error) {
        logger.error('MFA status error', { error: error instanceof Error ? error.message : String(error) })
        return NextResponse.json({ error: 'Failed to check MFA status' }, { status: 500 })
    }
}
