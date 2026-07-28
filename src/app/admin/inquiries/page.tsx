import { requirePageAdmin } from "@/lib/admin-auth"
import { prisma } from '@/lib/prisma'
import InquiriesClient from './inquiries-client'

export const revalidate = 15

type JourneyStage = 'Inquiry' | 'Reply' | 'Booking' | 'Travel' | 'Review'

export default async function InquiriesPage() {
    await requirePageAdmin('inquiries', 'VIEW');
    const inquiries = await prisma.contactInquiry.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100
    }).catch(() => null)
    if (!inquiries) return <InquiriesClient data={[]} dataUnavailable />
    const emails = Array.from(new Set(inquiries.map(i => i.email).filter(Boolean)))
    const bookings = await prisma.booking.findMany({
        where: { email: { in: emails } },
        select: { email: true, status: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
    }).catch(() => [])
    const reviews = await prisma.review.findMany({
        where: { customerEmail: { in: emails } },
        select: { customerEmail: true, status: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
    }).catch(() => [])
    const bookingsByEmail = new Map<string, typeof bookings>()
    for (const booking of bookings) {
        const list = bookingsByEmail.get(booking.email) ?? []
        list.push(booking)
        bookingsByEmail.set(booking.email, list)
    }
    const reviewsByEmail = new Map<string, typeof reviews>()
    for (const review of reviews) {
        if (!review.customerEmail) continue
        const list = reviewsByEmail.get(review.customerEmail) ?? []
        list.push(review)
        reviewsByEmail.set(review.customerEmail, list)
    }
    const data = inquiries.map(i => {
        const journeyStage: JourneyStage = reviewsByEmail.has(i.email)
            ? 'Review'
            : bookingsByEmail.get(i.email)?.some(b => ['IN_PROGRESS', 'COMPLETED'].includes(b.status))
                ? 'Travel'
                : bookingsByEmail.has(i.email)
                    ? 'Booking'
                    : i.isReplied
                        ? 'Reply'
                        : 'Inquiry'

        return ({
        id: i.id,
        name: i.name,
        email: i.email,
        subject: i.subject,
        inquiryType: i.inquiryType,
        isRead: i.isRead,
        isReplied: i.isReplied,
        journeyStage,
        createdAt: i.createdAt.toISOString(),
        })
    })
    return <InquiriesClient data={data} />
}
