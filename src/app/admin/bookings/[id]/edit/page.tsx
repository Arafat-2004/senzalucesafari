import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BookingForm from '../../booking-form'

export default async function EditBookingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const booking = await prisma.booking.findUnique({
        where: { id },
        include: { tour: { select: { name: true } } },
    })
    if (!booking) notFound()

    return (
        <BookingForm
            booking={{
                id: booking.id,
                bookingRef: booking.bookingRef,
                firstName: booking.firstName,
                lastName: booking.lastName,
                email: booking.email,
                phone: booking.phone,
                country: booking.country,
                travelDate: booking.travelDate,
                endDate: booking.endDate,
                numberOfTravelers: booking.numberOfTravelers,
                accommodationLevel: booking.accommodationLevel,
                pricePerPerson: booking.pricePerPerson,
                totalPrice: booking.totalPrice,
                currency: booking.currency,
                depositPaid: booking.depositPaid,
                status: booking.status,
                paymentStatus: booking.paymentStatus,
                specialRequests: booking.specialRequests,
                internalNotes: booking.internalNotes,
                vehicleId: booking.vehicleId,
                guideId: booking.guideId,
                source: booking.source,
                createdAt: booking.createdAt,
                tourName: booking.tour.name,
            }}
        />
    )
}
