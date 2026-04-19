'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getNotifications() {
    try {
        const [unreadInquiries, unreadBookings, pendingReviews] = await Promise.all([
            prisma.contactInquiry.count({ where: { isRead: false } }),
            prisma.booking.count({ where: { status: 'PENDING' } }),
            prisma.review.count({ where: { isApproved: false } }),
        ])

        const inquiries = await prisma.contactInquiry.findMany({
            where: { isRead: false },
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
                id: true,
                name: true,
                subject: true,
                tourInterest: true,
                createdAt: true,
            }
        })

        const bookings = await prisma.booking.findMany({
            where: { status: 'PENDING' },
            orderBy: { createdAt: 'desc' },
            take: 3,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                bookingRef: true,
                createdAt: true,
            }
        })

        const reviews = await prisma.review.findMany({
            where: { isApproved: false },
            orderBy: { createdAt: 'desc' },
            take: 2,
            include: {
                tour: {
                    select: { name: true }
                }
            }
        })

        return {
            unreadCount: unreadInquiries + unreadBookings + pendingReviews,
            inquiries,
            bookings,
            reviews,
        }
    } catch (error) {
        console.error('Failed to fetch notifications:', error)
        return {
            unreadCount: 0,
            inquiries: [],
            bookings: [],
            reviews: [],
        }
    }
}

export async function markAllNotificationsRead() {
    try {
        await Promise.all([
            prisma.contactInquiry.updateMany({ where: { isRead: false }, data: { isRead: true } }),
            prisma.review.updateMany({ where: { isApproved: false }, data: { isApproved: true } }),
        ])
        revalidatePath('/admin')
    } catch (error) {
        console.error('Failed to mark notifications read:', error)
    }
}