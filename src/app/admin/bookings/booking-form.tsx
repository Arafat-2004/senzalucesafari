'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateBooking } from './actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const bookingStatuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']
const paymentStatuses = ['PENDING', 'DEPOSIT_PAID', 'PARTIALLY_PAID', 'FULLY_PAID', 'REFUNDED', 'CANCELLED']

type BookingData = {
    id: string
    bookingRef: string
    firstName: string
    lastName: string
    email: string
    phone: string
    country: string
    travelDate: Date
    endDate: Date
    numberOfTravelers: number
    accommodationLevel: string
    pricePerPerson: number
    totalPrice: number
    currency: string
    depositPaid: number
    status: string
    paymentStatus: string
    specialRequests: string | null
    internalNotes: string | null
    vehicleId: string | null
    guideId: string | null
    source: string | null
    createdAt: Date
    tourName: string
}

export default function BookingForm({ booking }: { booking: BookingData }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    function handleSubmit(formData: FormData) {
        startTransition(async () => {
            await updateBooking(booking.id, formData)
        })
    }

    return (
        <form action={handleSubmit}>
            <div className="space-y-6 max-w-3xl">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Booking {booking.bookingRef}</CardTitle>
                            <Badge variant="outline">{booking.source ?? 'website'}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-lg bg-muted p-4 space-y-2">
                            <h3 className="font-semibold text-sm">Customer Details</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div><span className="text-muted-foreground">Name:</span> {booking.firstName} {booking.lastName}</div>
                                <div><span className="text-muted-foreground">Email:</span> {booking.email}</div>
                                <div><span className="text-muted-foreground">Phone:</span> {booking.phone}</div>
                                <div><span className="text-muted-foreground">Country:</span> {booking.country}</div>
                            </div>
                        </div>
                        <div className="rounded-lg bg-muted p-4 space-y-2">
                            <h3 className="font-semibold text-sm">Travel Details</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div><span className="text-muted-foreground">Tour:</span> {booking.tourName}</div>
                                <div><span className="text-muted-foreground">Travelers:</span> {booking.numberOfTravelers}</div>
                                <div><span className="text-muted-foreground">Travel Date:</span> {new Date(booking.travelDate).toLocaleDateString()}</div>
                                <div><span className="text-muted-foreground">End Date:</span> {new Date(booking.endDate).toLocaleDateString()}</div>
                                <div><span className="text-muted-foreground">Accommodation:</span> {booking.accommodationLevel}</div>
                                {booking.specialRequests && <div className="col-span-2"><span className="text-muted-foreground">Special Requests:</span> {booking.specialRequests}</div>}
                            </div>
                        </div>
                        <div className="rounded-lg bg-muted p-4 space-y-2">
                            <h3 className="font-semibold text-sm">Pricing</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div><span className="text-muted-foreground">Per Person:</span> {booking.currency} {booking.pricePerPerson.toLocaleString()}</div>
                                <div><span className="text-muted-foreground">Total:</span> {booking.currency} {booking.totalPrice.toLocaleString()}</div>
                                <div><span className="text-muted-foreground">Deposit Paid:</span> {booking.currency} {booking.depositPaid.toLocaleString()}</div>
                                <div><span className="text-muted-foreground">Balance:</span> {booking.currency} {(booking.totalPrice - booking.depositPaid).toLocaleString()}</div>
                            </div>
                        </div>

                        <hr />
                        <h3 className="font-semibold">Manage Booking</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Booking Status</Label>
                                <select id="status" name="status" defaultValue={booking.status} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" required>
                                    {bookingStatuses.map(s => (
                                        <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="paymentStatus">Payment Status</Label>
                                <select id="paymentStatus" name="paymentStatus" defaultValue={booking.paymentStatus} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" required>
                                    {paymentStatuses.map(s => (
                                        <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="vehicleId">Vehicle ID</Label>
                                <Input id="vehicleId" name="vehicleId" defaultValue={booking.vehicleId ?? ''} placeholder="Assign a vehicle..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="guideId">Guide ID</Label>
                                <Input id="guideId" name="guideId" defaultValue={booking.guideId ?? ''} placeholder="Assign a guide..." />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="internalNotes">Internal Notes</Label>
                            <Textarea id="internalNotes" name="internalNotes" defaultValue={booking.internalNotes ?? ''} rows={3} placeholder="Notes for internal use..." />
                        </div>
                    </CardContent>
                </Card>
                <div className="flex gap-3">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Saving...' : 'Update Booking'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/bookings')}>Cancel</Button>
                </div>
            </div>
        </form>
    )
}
