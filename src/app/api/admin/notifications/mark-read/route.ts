import { NextResponse } from 'next/server'
import { markAllNotificationsRead } from '@/app/admin/notifications'
import { getSession } from '@/lib/admin-auth'
import { withApiResilience } from '@/lib/reliability/api-resilience'

export const POST = withApiResilience(async () => {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await markAllNotificationsRead()
    return NextResponse.json({ success: true })
}, { route: '/api/admin/notifications/mark-read', method: 'POST', requireAuth: true })