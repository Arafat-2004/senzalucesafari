import { logger } from '@/lib/reliability/logger'
import { requirePageAdmin } from "@/lib/admin-auth"
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { AlertTriangle, ArrowLeft, Search } from 'lucide-react'
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
            <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
                <div className="mx-auto max-w-md">
                    <div className="mb-6 flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                            <AlertTriangle className="h-8 w-8 text-destructive" />
                        </div>
                    </div>
                    <h1 className="mb-3 text-2xl font-bold text-foreground">Failed to Load Inquiry</h1>
                    <p className="mb-8 text-sm text-muted-foreground">
                        An error occurred while retrieving this inquiry from the database.
                        This may be a temporary connectivity issue — please try again.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Link
                            href="/admin/inquiries"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Inquiries
                        </Link>
                        <Link
                            href="/admin"
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    if (!inquiry) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
                <div className="mx-auto max-w-md">
                    <div className="mb-6 flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </div>
                    <h1 className="mb-3 text-2xl font-bold text-foreground">Inquiry Not Found</h1>
                    <p className="mb-2 text-sm text-muted-foreground">
                        The inquiry{' '}
                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                            #{id.slice(0, 8)}&hellip;
                        </code>{' '}
                        does not exist or may have been deleted.
                    </p>
                    <p className="mb-8 text-sm text-muted-foreground">
                        Use the search box in the header to locate an inquiry by customer name or email.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Link
                            href="/admin/inquiries"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Return to Inquiries List
                        </Link>
                        <Link
                            href="/admin"
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
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
