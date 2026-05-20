import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/admin-auth'
import { logger } from '@/lib/reliability/logger'

export const dynamic = 'force-dynamic'

export async function POST() {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await prisma.adminUser.update({
            where: { id: session.id },
            data: {
                totpSecret: null,
                mfaEnabled: false,
                backupCodes: null,
            },
        })

        return NextResponse.json({
            success: true,
            message: 'MFA has been disabled',
        })
    } catch (error) {
        logger.error('MFA disable error', { error: error instanceof Error ? error.message : String(error) })
        return NextResponse.json({ error: 'Failed to disable MFA' }, { status: 500 })
    }
}
