'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createAdminBooking } from './actions'
import { calculateSafariPrice } from '@/lib/pricing-engine'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, ShieldCheck } from 'lucide-react'

type TourOption = {
    id: string
    name: string
    duration: string
    priceFrom: number
}

type InquiryPrefill = {
    id: string
    name: string
    email: string
    phone: string | null
    country: string | null
    message: string
    tourInterest: string | null
    travelDate: string | null
    numberOfTravelers: number | null
}

function splitName(name?: string) {
    const parts = (name || '').trim().split(/\s+/).filter(Boolean)
    return {
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
    }
}

export function NewBookingForm({ tours, inquiry }: { tours: TourOption[]; inquiry?: InquiryPrefill | null }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const names = splitName(inquiry?.name)
    const matchedTour = (() => {
        if (!inquiry?.tourInterest) return tours[0]
        return tours.find(tour =>
            tour.name.toLowerCase().includes(inquiry.tourInterest!.toLowerCase()) ||
            inquiry.tourInterest!.toLowerCase().includes(tour.name.toLowerCase())
        ) ?? tours[0]
    })()
    const previewPrice = matchedTour
        ? calculateSafariPrice(matchedTour.priceFrom, inquiry?.numberOfTravelers || 2, 'mid-range')
        : null

    function handleSubmit(formData: FormData) {
        startTransition(async () => {
            try {
                const created = await createAdminBooking(formData)
                toast.success('Booking created from admin dashboard')
                router.push(`/admin/bookings/${created.id}/edit`)
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Unable to create booking')
            }
        })
    }

    return (
        <form action={handleSubmit} className="max-w-5xl space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Create Booking</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Record a confirmed safari booking. Payments are only recorded after they are made outside this website.
                    </p>
                </div>
                {inquiry && <Badge variant="info">From inquiry</Badge>}
            </div>

            {inquiry && (
                <input type="hidden" name="inquiryId" value={inquiry.id} />
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Customer details</CardTitle>
                    <CardDescription>Prefilled from the inquiry when available. Confirm details before saving.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First name</Label>
                        <Input id="firstName" name="firstName" defaultValue={names.firstName} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input id="lastName" name="lastName" defaultValue={names.lastName} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" defaultValue={inquiry?.email ?? ''} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" name="phone" defaultValue={inquiry?.phone ?? ''} required />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" name="country" defaultValue={inquiry?.country ?? ''} placeholder="Customer country" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Safari details</CardTitle>
                    <CardDescription>Select the package, travel date, group size, and comfort level.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="tourId">Safari package</Label>
                        <select id="tourId" name="tourId" defaultValue={matchedTour?.id ?? ''} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" required>
                            <option value="" disabled>Select a safari package</option>
                            {tours.map(tour => (
                                <option key={tour.id} value={tour.id}>{tour.name} — from ${tour.priceFrom.toLocaleString()}</option>
                            ))}
                        </select>
                        {inquiry?.tourInterest && <p className="text-xs text-muted-foreground">Inquiry interest: {inquiry.tourInterest}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="travelDate">Travel date</Label>
                        <Input id="travelDate" name="travelDate" type="date" defaultValue={inquiry?.travelDate ?? ''} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="endDate">End date <span className="font-normal text-muted-foreground">(optional)</span></Label>
                        <Input id="endDate" name="endDate" type="date" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="numberOfTravelers">Travelers</Label>
                        <Input id="numberOfTravelers" name="numberOfTravelers" type="number" min={1} max={99} defaultValue={inquiry?.numberOfTravelers ?? 2} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="accommodationLevel">Accommodation level</Label>
                        <select id="accommodationLevel" name="accommodationLevel" defaultValue="mid-range" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            <option value="budget">Budget</option>
                            <option value="mid-range">Mid-Range</option>
                            <option value="luxury">Luxury</option>
                            <option value="premium">Premium</option>
                        </select>
                    </div>
                    <div className="md:col-span-2 rounded-2xl border bg-muted/35 p-4 text-sm">
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
                            <div>
                                <p className="font-medium">Estimated booking value</p>
                                <p className="mt-1 text-muted-foreground">
                                    {previewPrice ? `$${previewPrice.totalPrice.toLocaleString()} total, based on mid-range accommodation and current package pricing.` : 'Select a safari package to calculate the value.'}
                                    {' '}This does not collect or process payment.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Notes</CardTitle>
                    <CardDescription>Keep operational context visible for the team.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="specialRequests">Customer requests</Label>
                        <Textarea id="specialRequests" name="specialRequests" rows={4} defaultValue={inquiry?.message ?? ''} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="internalNotes">Internal notes</Label>
                        <Textarea id="internalNotes" name="internalNotes" rows={3} placeholder="Private team notes..." />
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={() => router.push(inquiry ? `/admin/inquiries/${inquiry.id}/edit` : '/admin/bookings')} className="min-h-11">Cancel</Button>
                <Button type="submit" disabled={isPending || tours.length === 0} className="min-h-11 sm:min-w-40">
                    {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : 'Create Booking'}
                </Button>
            </div>
        </form>
    )
}
