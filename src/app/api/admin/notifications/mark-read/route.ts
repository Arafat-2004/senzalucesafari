import { NextResponse } from 'next/server'
import { markAllNotificationsRead } from '@/app/admin/notifications'

export async function POST() {
    try {
        await markAllNotificationsRead()
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Mark read error:', error)
        return NextResponse.json({ error: 'Failed to mark notifications' }, { status: 500 })
    }
}