import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession, canAccess } from '@/lib/admin-auth'
import { logger } from '@/lib/reliability/logger'

export async function GET(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!canAccess(session, 50)) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const filter = searchParams.get('filter') || 'all'
        const search = searchParams.get('search') || ''
        const sortBy = searchParams.get('sortBy') || 'newest'

        // NOTIFICATION_REDESIGN: Build where clause based on filter
        const where: Record<string, unknown> = {}
        
        if (filter === 'unread') {
            where.isRead = false
        } else if (filter === 'booking') {
            where.type = { in: ['NEW_BOOKING', 'BOOKING_CONFIRMED', 'BOOKING_CANCELLED'] }
        } else if (filter === 'inquiry') {
            where.type = { in: ['NEW_INQUIRY', 'INQUIRY_REPLIED'] }
        } else if (filter === 'review') {
            where.type = { in: ['NEW_REVIEW', 'REVIEW_APPROVED', 'REVIEW_REJECTED'] }
        } else if (filter === 'newsletter') {
            where.type = 'NEW_NEWSLETTER_SIGNUP'
        } else if (filter === 'feedback') {
            where.type = 'NEW_FEEDBACK'
        }

        // NOTIFICATION_REDESIGN: Add search filter
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' as const } },
                { message: { contains: search, mode: 'insensitive' as const } },
            ]
        }

        // NOTIFICATION_REDESIGN: Build orderBy based on sort preference
        const orderBy: { isRead?: 'asc' | 'desc'; createdAt?: 'asc' | 'desc'; type?: 'asc' | 'desc' }[] = sortBy === 'oldest'
            ? [{ createdAt: 'asc' }]
            : sortBy === 'type'
                ? [{ type: 'asc' }, { createdAt: 'desc' }]
                : [{ isRead: 'asc' }, { createdAt: 'desc' }]

        const skip = (page - 1) * limit

        const [notifications, total] = await Promise.all([
            prisma.adminNotification.findMany({
                where,
                orderBy,
                skip,
                take: limit,
            }),
            prisma.adminNotification.count({ where }),
        ])

        return NextResponse.json({
            notifications,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        logger.error('Notifications API error', { error: error instanceof Error ? error.message : String(error) })
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
    }
}
