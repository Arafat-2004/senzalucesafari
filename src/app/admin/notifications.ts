'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/admin-auth'

export async function getNotifications() {
    try {
        // NOTIFICATION_REDESIGN: Query AdminNotification table as single source of truth
        const unreadCount = await prisma.adminNotification.count({
            where: { isRead: false }
        })

        // Fetch all recent notifications (read + unread) for the dropdown
        const notifications = await prisma.adminNotification.findMany({
            orderBy: [
                { isRead: 'asc' },  // Unread first (false < true)
                { createdAt: 'desc' }
            ],
            take: 50,
        })

        // Count by type for badge display
        const countsByType = await prisma.adminNotification.groupBy({
            by: ['type'],
            where: { isRead: false },
            _count: { type: true }
        })

        const typeCounts: Record<string, number> = {}
        countsByType.forEach(({ type, _count }) => {
            typeCounts[type] = _count.type
        })

        // Count by category for tab badges
        const bookingCount = (typeCounts['NEW_BOOKING'] || 0) + (typeCounts['BOOKING_CONFIRMED'] || 0) + (typeCounts['BOOKING_CANCELLED'] || 0)
        const inquiryCount = (typeCounts['NEW_INQUIRY'] || 0) + (typeCounts['INQUIRY_REPLIED'] || 0)
        const reviewCount = (typeCounts['NEW_REVIEW'] || 0) + (typeCounts['REVIEW_APPROVED'] || 0) + (typeCounts['REVIEW_REJECTED'] || 0)
        const newsletterCount = typeCounts['NEW_NEWSLETTER_SIGNUP'] || 0
        const feedbackCount = typeCounts['NEW_FEEDBACK'] || 0
        const unreadBookingCount = (typeCounts['NEW_BOOKING'] || 0) + (typeCounts['BOOKING_CONFIRMED'] || 0) + (typeCounts['BOOKING_CANCELLED'] || 0)
        const unreadInquiryCount = (typeCounts['NEW_INQUIRY'] || 0) + (typeCounts['INQUIRY_REPLIED'] || 0)
        const unreadReviewCount = (typeCounts['NEW_REVIEW'] || 0) + (typeCounts['REVIEW_APPROVED'] || 0) + (typeCounts['REVIEW_REJECTED'] || 0)

        // Transform to dropdown-compatible format
        const allNotifications = notifications.map(n => ({
            id: n.id,
            type: n.type,
            title: n.title,
            message: n.message,
            isRead: n.isRead,
            actionUrl: n.actionUrl,
            createdAt: n.createdAt.toISOString(),
        }))

        // Legacy grouped format for backward compatibility
        const inquiries = notifications
            .filter(n => n.type === 'NEW_INQUIRY' || n.type === 'INQUIRY_REPLIED')
            .slice(0, 5)
            .map(n => ({
                id: n.id,
                name: n.title,
                subject: n.message,
                tourInterest: null,
                createdAt: n.createdAt.toISOString(),
            }))

        const bookings = notifications
            .filter(n => n.type === 'NEW_BOOKING' || n.type === 'BOOKING_CONFIRMED' || n.type === 'BOOKING_CANCELLED')
            .slice(0, 3)
            .map(n => ({
                id: n.id,
                firstName: n.title.split(' ')[0] || 'Admin',
                lastName: '',
                bookingRef: n.id.substring(0, 8).toUpperCase(),
                createdAt: n.createdAt.toISOString(),
            }))

        const reviews = notifications
            .filter(n => n.type === 'NEW_REVIEW' || n.type === 'REVIEW_APPROVED' || n.type === 'REVIEW_REJECTED')
            .slice(0, 2)
            .map(n => ({
                id: n.id,
                customerName: n.title,
                title: n.message,
                createdAt: n.createdAt.toISOString(),
                tour: null,
            }))

        return {
            unreadCount,
            inquiries,
            bookings,
            reviews,
            allNotifications,
            typeCounts,
            categoryCounts: {
                booking: bookingCount,
                inquiry: inquiryCount,
                review: reviewCount,
                newsletter: newsletterCount,
                feedback: feedbackCount,
            },
            unreadCategoryCounts: {
                booking: unreadBookingCount,
                inquiry: unreadInquiryCount,
                review: unreadReviewCount,
                newsletter: newsletterCount,
                feedback: feedbackCount,
            },
        }
    } catch (error) {
        console.error('Failed to fetch notifications:', error)
        return {
            unreadCount: 0,
            inquiries: [],
            bookings: [],
            reviews: [],
            allNotifications: [],
            typeCounts: {},
            categoryCounts: { booking: 0, inquiry: 0, review: 0, newsletter: 0, feedback: 0 },
            unreadCategoryCounts: { booking: 0, inquiry: 0, review: 0, newsletter: 0, feedback: 0 },
        }
    }
}

export async function markAllNotificationsRead() {
    await requireAdmin()
    try {
        // NOTIFICATION_REDESIGN: Update AdminNotification table, not source tables
        await prisma.adminNotification.updateMany({
            where: { isRead: false },
            data: { isRead: true, readAt: new Date() }
        })
        revalidatePath('/admin')
    } catch (error) {
        console.error('Failed to mark notifications read:', error)
    }
}
