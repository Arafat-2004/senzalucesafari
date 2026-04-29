'use client'

import { useState } from 'react'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateBooking } from './actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import { 
    Calendar, User, MapPin, DollarSign, FileText, 
    Download, CheckCircle, Clock, XCircle, Truck
} from 'lucide-react'

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

const statusSteps = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED']

function StatusTimeline({ status }: { status: string }) {
    const currentIndex = statusSteps.indexOf(status)
    
    return (
        <div className="flex items-center justify-between">
            {statusSteps.map((step, idx) => {
                const isCompleted = idx <= currentIndex && status !== 'CANCELLED' && status !== 'NO_SHOW'
                const isCurrent = idx === currentIndex
                
                return (
                    <div key={step} className="flex items-center">
                        <div className="flex flex-col items-center">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                isCompleted 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-muted text-muted-foreground'
                            }`}>
                                {isCompleted ? (
                                    <CheckCircle className="h-5 w-5" />
                                ) : step === 'PENDING' ? (
                                    <Clock className="h-5 w-5" />
                                ) : step === 'CONFIRMED' ? (
                                    <User className="h-5 w-5" />
                                ) : step === 'IN_PROGRESS' ? (
                                    <Truck className="h-5 w-5" />
                                ) : (
                                    <CheckCircle className="h-5 w-5" />
                                )}
                            </div>
                            <span className={`text-xs mt-1 ${isCompleted ? 'text-green-500 font-medium' : 'text-muted-foreground'}`}>
                                {step.replace('_', ' ')}
                            </span>
                        </div>
                        {idx < statusSteps.length - 1 && (
                            <div className={`w-16 h-0.5 mx-2 ${idx < currentIndex ? 'bg-green-500' : 'bg-muted'}`} />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

function InvoicePreview({ booking }: { booking: BookingData }) {
    return (
        <div className="bg-white text-black p-8 rounded-lg border max-w-2xl mx-auto">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Senza Luce Safaris</h1>
                    <p className="text-sm text-gray-600">Tanzania Safari Specialists</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-xl">INVOICE</p>
                    <p className="text-sm">#{booking.bookingRef}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <h3 className="font-semibold text-sm mb-2">Bill To:</h3>
                    <p className="font-medium">{booking.firstName} {booking.lastName}</p>
                    <p className="text-sm">{booking.email}</p>
                    <p className="text-sm">{booking.phone}</p>
                    <p className="text-sm">{booking.country}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm"><span className="text-gray-600">Date:</span> {new Date(booking.createdAt).toLocaleDateString()}</p>
                    <p className="text-sm"><span className="text-gray-600">Travel Date:</span> {new Date(booking.travelDate).toLocaleDateString()}</p>
                    <p className="text-sm"><span className="text-gray-600">Status:</span> {booking.status}</p>
                </div>
            </div>

            <table className="w-full mb-8">
                <thead>
                    <tr className="border-b">
                        <th className="text-left py-2">Description</th>
                        <th className="text-right py-2">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b">
                        <td className="py-2">
                            {booking.tourName}
                            <br />
                            <span className="text-sm text-gray-600">
                                {booking.numberOfTravelers} traveler(s) | {booking.accommodationLevel}
                            </span>
                        </td>
                        <td className="text-right py-2">
                            {booking.currency} {booking.totalPrice.toLocaleString()}
                        </td>
                    </tr>
                    <tr className="border-b">
                        <td className="py-2">Deposit Paid</td>
                        <td className="text-right py-2 text-green-600">
                            -{booking.currency} {booking.depositPaid.toLocaleString()}
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td className="py-4 font-bold text-lg">Balance Due</td>
                        <td className="text-right py-4 font-bold text-lg">
                            {booking.currency} {(booking.totalPrice - booking.depositPaid).toLocaleString()}
                        </td>
                    </tr>
                </tfoot>
            </table>

            <div className="text-center text-sm text-gray-600 mt-8">
                <p>Thank you for choosing Senza Luce Safaris!</p>
                <p>For inquiries: info@senzalucesafaris.com</p>
            </div>
        </div>
    )
}

export default function BookingForm({ booking }: { booking: BookingData }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    function handleSubmit(formData: FormData) {
        startTransition(async () => {
            await updateBooking(booking.id, formData)
        })
    }

    function generateInvoice() {
        const content = document.getElementById('invoice-content')
        if (!content) return
        
        const printWindow = window.open('', '_blank')
        if (!printWindow) return
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>Invoice ${booking.bookingRef}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                    </style>
                </head>
                <body>${content.innerHTML}</body>
            </html>
        `)
        printWindow.document.close()
        printWindow.print()
    }

    return (
        <Tabs defaultValue="details" className="space-y-6">
            <TabsList>
                <TabsTrigger value="details">Booking Details</TabsTrigger>
                <TabsTrigger value="timeline">Status Timeline</TabsTrigger>
                <TabsTrigger value="invoice">Invoice</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
                <form action={handleSubmit}>
                    <div className="space-y-6 max-w-3xl">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Booking {booking.bookingRef}</CardTitle>
                                    <div className="flex gap-2">
                                        <Badge variant={booking.status === 'CONFIRMED' ? 'default' : 'secondary'}>
                                            {booking.status}
                                        </Badge>
                                        <Badge variant="outline">{booking.source ?? 'website'}</Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="rounded-lg bg-muted p-4 space-y-2">
                                    <h3 className="font-semibold text-sm flex items-center gap-2">
                                        <User className="h-4 w-4" /> Customer Details
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div><span className="text-muted-foreground">Name:</span> {booking.firstName} {booking.lastName}</div>
                                        <div><span className="text-muted-foreground">Email:</span> {booking.email}</div>
                                        <div><span className="text-muted-foreground">Phone:</span> {booking.phone}</div>
                                        <div><span className="text-muted-foreground">Country:</span> {booking.country}</div>
                                    </div>
                                </div>
                                <div className="rounded-lg bg-muted p-4 space-y-2">
                                    <h3 className="font-semibold text-sm flex items-center gap-2">
                                        <MapPin className="h-4 w-4" /> Travel Details
                                    </h3>
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
                                    <h3 className="font-semibold text-sm flex items-center gap-2">
                                        <DollarSign className="h-4 w-4" /> Pricing
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div><span className="text-muted-foreground">Per Person:</span> {booking.currency} {booking.pricePerPerson.toLocaleString()}</div>
                                        <div><span className="text-muted-foreground">Total:</span> {booking.currency} {booking.totalPrice.toLocaleString()}</div>
                                        <div><span className="text-muted-foreground">Deposit Paid:</span> {booking.currency} {booking.depositPaid.toLocaleString()}</div>
                                        <div><span className="text-muted-foreground">Balance:</span> {booking.currency} {(booking.totalPrice - booking.depositPaid).toLocaleString()}</div>
                                        <div className="col-span-2">
                                            <span className="text-muted-foreground">Payment Status:</span>{' '}
                                            <Badge variant={booking.paymentStatus === 'FULLY_PAID' ? 'default' : 'outline'}>
                                                {booking.paymentStatus.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <Separator />
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
                            {isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : 'Update Booking'}
                        </Button>
                            <Button type="button" variant="outline" onClick={() => router.push('/admin/bookings')}>Cancel</Button>
                        </div>
                    </div>
                </form>
            </TabsContent>

            <TabsContent value="timeline">
                <Card>
                    <CardHeader>
                        <CardTitle>Booking Status Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <StatusTimeline status={booking.status} />
                        
                        <Separator className="my-6" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-medium mb-2">Booking Created</h4>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(booking.createdAt).toLocaleString()}
                                </p>
                                <p className="text-sm text-muted-foreground">via {booking.source ?? 'website'}</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-medium mb-2">Travel Date</h4>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(booking.travelDate).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(booking.endDate).toLocaleDateString()} (end)
                                </p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-medium mb-2">Payment</h4>
                                <p className="text-sm text-muted-foreground">
                                    {booking.paymentStatus.replace('_', ' ')}
                                </p>
                                <p className="text-sm">
                                    {booking.depositPaid > 0 
                                        ? `$${booking.depositPaid.toLocaleString()} paid`
                                        : 'No payment received'
                                    }
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="invoice">
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <Button onClick={generateInvoice}>
                            <Download className="h-4 w-4 mr-2" />
                            Download Invoice
                        </Button>
                    </div>
                    <div id="invoice-content">
                        <InvoicePreview booking={booking} />
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    )
}