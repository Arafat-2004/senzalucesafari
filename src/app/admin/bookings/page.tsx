import { prisma } from '@/lib/prisma'
import BookingsClient from './bookings-client'

export const revalidate = 30

export default async function BookingsPage() {
    const bookings = await prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
        include: { tour: { select: { name: true } } }
    })
    const data = bookings.map(b => ({
        id: b.id,
        bookingRef: b.bookingRef,
        customerName: `${b.firstName} ${b.lastName}`,
        tourName: b.tour.name,
        travelDate: b.travelDate.toISOString(),
        status: b.status,
        paymentStatus: b.paymentStatus,
        totalPrice: `${b.currency} ${b.totalPrice.toFixed(2)}`,
    }))
    return <BookingsClient data={data} />
}
