import { logger } from '@/lib/reliability/logger'
import { requirePageAdmin } from "@/lib/admin-auth"
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import InquiryForm from '../../inquiry-form'
import { CustomerJourneyCard } from '../../customer-journey-card'

export const dynamic = 'force-dynamic'

export default async function EditInquiryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    await requirePageAdmin('inquiries', 'REPLY');
    
    let inquiry = null
    let bookings: Array<{
        id: string
        bookingRef: string
        tourName: string
        status: string
        paymentStatus: string
        travelDate: string
        createdAt: string
    }> = []
    let reviews: Array<{
        id: string
        title: string
        status: string
        rating: number
        createdAt: string
    }> = []
    let hasError = false

    try {
        inquiry = await prisma.contactInquiry.findUnique({ where: { id } })
        if (inquiry) {
            const [relatedBookings, relatedReviews] = await Promise.all([
                prisma.booking.findMany({
                    where: {
                        OR: [
                            { email: inquiry.email },
                            ...(inquiry.phone ? [{ phone: inquiry.phone }] : []),
                        ],
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                    include: { tour: { select: { name: true } } },
                }),
                prisma.review.findMany({
                    where: {
                        OR: [
                            { customerEmail: inquiry.email },
                            { customerName: inquiry.name },
                        ],
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                }),
            ])

            bookings = relatedBookings.map(booking => ({
                id: booking.id,
                bookingRef: booking.bookingRef,
                tourName: booking.tour.name,
                status: booking.status,
                paymentStatus: booking.paymentStatus,
                travelDate: booking.travelDate.toISOString(),
                createdAt: booking.createdAt.toISOString(),
            }))

            reviews = relatedReviews.map(review => ({
                id: review.id,
                title: review.title,
                status: review.status,
                rating: review.rating,
                createdAt: review.createdAt.toISOString(),
            }))
        }
    } catch (error) {
        logger.error('Error fetching inquiry', { error: error instanceof Error ? error.message : String(error) })
        hasError = true
    }

    if (hasError) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Error</h1>
                <p className="text-muted-foreground">Failed to load inquiry. Please try again.</p>
            </div>
        )
    }

    if (!inquiry) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Inquiry Not Found</h1>
                <p className="text-muted-foreground">The inquiry with ID &quot;{id}&quot; does not exist.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <InquiryForm inquiry={inquiry} />
            <CustomerJourneyCard
                journey={{
                    inquiryId: inquiry.id,
                    isRead: inquiry.isRead,
                    isReplied: inquiry.isReplied,
                    bookings,
                    reviews,
                }}
            />
        </div>
    )
}
