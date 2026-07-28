'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Circle, ClipboardList, MailCheck, MessageSquare, Route, Star, Tent } from 'lucide-react'

type JourneyBooking = {
    id: string
    bookingRef: string
    tourName: string
    status: string
    paymentStatus: string
    travelDate: string
    createdAt: string
}

type JourneyReview = {
    id: string
    title: string
    status: string
    rating: number
    createdAt: string
}

type InquiryJourney = {
    inquiryId: string
    isRead: boolean
    isReplied: boolean
    bookings: JourneyBooking[]
    reviews: JourneyReview[]
}

const journeySteps = [
    { key: 'inquiry', label: 'Inquiry', description: 'Customer request received', icon: MessageSquare },
    { key: 'reply', label: 'Reply', description: 'Team response sent or recorded', icon: MailCheck },
    { key: 'booking', label: 'Booking', description: 'Trip converted into a booking', icon: ClipboardList },
    { key: 'travel', label: 'Travel', description: 'Safari is in progress or completed', icon: Tent },
    { key: 'review', label: 'Review', description: 'Guest story collected after travel', icon: Star },
] as const

function getProgress(journey: InquiryJourney) {
    const hasBooking = journey.bookings.length > 0
    const hasTravel = journey.bookings.some(booking => ['IN_PROGRESS', 'COMPLETED'].includes(booking.status))
    const hasReview = journey.reviews.length > 0

    return {
        inquiry: journey.isRead,
        reply: journey.isReplied,
        booking: hasBooking,
        travel: hasTravel,
        review: hasReview,
    }
}

function statusVariant(status: string) {
    if (['COMPLETED', 'CONFIRMED', 'APPROVED', 'FULLY_PAID'].includes(status)) return 'success'
    if (['CANCELLED', 'REJECTED', 'NO_SHOW'].includes(status)) return 'danger'
    if (['IN_PROGRESS', 'PARTIALLY_PAID'].includes(status)) return 'info'
    return 'warning'
}

export function CustomerJourneyCard({ journey }: { journey: InquiryJourney }) {
    const progress = getProgress(journey)
    const latestBooking = journey.bookings[0]
    const latestReview = journey.reviews[0]

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Route className="h-5 w-5 text-primary" />
                            Customer Journey
                        </CardTitle>
                        <CardDescription>
                            Tracks this customer from first inquiry through booking, travel, and review follow-up.
                        </CardDescription>
                    </div>
                    {latestBooking ? (
                        <Link href={`/admin/bookings/${latestBooking.id}/edit`}>
                            <Button size="sm" variant="outline" type="button">Open latest booking</Button>
                        </Link>
                    ) : (
                        <Link href={`/admin/bookings/new?fromInquiry=${journey.inquiryId}`}>
                            <Button size="sm" type="button">Create booking</Button>
                        </Link>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className="grid gap-3 md:grid-cols-5">
                    {journeySteps.map(({ key, label, description, icon: Icon }) => {
                        const done = progress[key]
                        return (
                            <div key={key} className={`rounded-2xl border p-4 ${done ? 'bg-primary/5 border-primary/25' : 'bg-muted/30'}`}>
                                <div className="mb-3 flex items-center justify-between">
                                    <Icon className={`h-5 w-5 ${done ? 'text-primary' : 'text-muted-foreground'}`} />
                                    {done ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Circle className="h-4 w-4 text-muted-foreground/50" />}
                                </div>
                                <p className="text-sm font-semibold">{label}</p>
                                <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
                            </div>
                        )
                    })}
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl border bg-card p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-sm font-semibold">Related bookings</h3>
                            <Badge variant={journey.bookings.length ? 'success' : 'outline'}>{journey.bookings.length}</Badge>
                        </div>
                        {journey.bookings.length ? (
                            <div className="space-y-3">
                                {journey.bookings.slice(0, 3).map(booking => (
                                    <Link key={booking.id} href={`/admin/bookings/${booking.id}/edit`} className="block rounded-xl border p-3 transition hover:bg-muted/50">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-sm font-medium">{booking.bookingRef}</p>
                                            <Badge variant={statusVariant(booking.status)}>{booking.status.replace(/_/g, ' ')}</Badge>
                                        </div>
                                        <p className="mt-1 text-sm text-muted-foreground">{booking.tourName}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">Travel: {new Date(booking.travelDate).toLocaleDateString()} • External payment: {booking.paymentStatus.replace(/_/g, ' ')}</p>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No booking has been connected to this customer yet. Use the booking flow after confirming the itinerary and external payment arrangement.</p>
                        )}
                    </div>

                    <div className="rounded-2xl border bg-card p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-sm font-semibold">Review follow-up</h3>
                            <Badge variant={journey.reviews.length ? 'featured' : 'outline'}>{journey.reviews.length}</Badge>
                        </div>
                        {latestReview ? (
                            <Link href={`/admin/reviews/${latestReview.id}/edit`} className="block rounded-xl border p-3 transition hover:bg-muted/50">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-medium">{latestReview.title}</p>
                                    <Badge variant={statusVariant(latestReview.status)}>{latestReview.status}</Badge>
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">{latestReview.rating}/5 rating • Submitted {new Date(latestReview.createdAt).toLocaleDateString()}</p>
                            </Link>
                        ) : latestBooking?.status === 'COMPLETED' ? (
                            <p className="text-sm text-muted-foreground">This customer completed travel but has no review yet. Send a review request from the booking follow-up workflow.</p>
                        ) : (
                            <p className="text-sm text-muted-foreground">Review collection becomes relevant after the safari is completed.</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
