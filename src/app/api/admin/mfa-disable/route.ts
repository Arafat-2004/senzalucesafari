import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/admin-auth'
import { logger } from '@/lib/reliability/logger'
import { sendSecurityNotificationEmail } from '@/lib/email/security-notification'

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

        sendSecurityNotificationEmail({
            adminEmail: session.email,
            adminName: `${session.firstName} ${session.lastName}`.trim() || session.email,
            event: 'mfa_disabled',
        }).catch(err => logger.error('[MFA Disable] Security notification error', { error: err instanceof Error ? err.message : String(err) }))

        return NextResponse.json({
            success: true,
            message: 'MFA has been disabled',
        })
    } catch (error) {
        logger.error('MFA disable error', { error: error instanceof Error ? error.message : String(error) })
        return NextResponse.json({ error: 'Failed to disable MFA' }, { status: 500 })
    }
}
