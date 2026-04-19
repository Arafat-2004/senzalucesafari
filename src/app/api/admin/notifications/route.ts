import { NextResponse } from 'next/server'
import { getNotifications } from '@/app/admin/notifications'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const notifications = await getNotifications()
        return NextResponse.json(notifications)
    } catch (error) {
        console.error('Notifications API error:', error)
        return NextResponse.json(
            { unreadCount: 0, inquiries: [], bookings: [], reviews: [] },
            { status: 500 }
        )
    }
}