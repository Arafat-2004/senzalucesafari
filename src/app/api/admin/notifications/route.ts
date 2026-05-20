import { NextResponse } from 'next/server'
import { getNotifications } from '@/app/admin/notifications'
import { getSession, canAccess } from '@/lib/admin-auth'
import { logger } from '@/lib/reliability/logger'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!canAccess(session, 50)) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
        }

        const notifications = await getNotifications()
        return NextResponse.json(notifications)
    } catch (error) {
        logger.error('Notifications API error', { error: error instanceof Error ? error.message : String(error) })
        return NextResponse.json(
            { unreadCount: 0, inquiries: [], bookings: [], reviews: [], typeCounts: {} },
            { status: 500 }
        )
    }
}