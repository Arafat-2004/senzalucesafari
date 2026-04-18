import { prisma } from '@/lib/prisma'
import BookingsClient from './bookings-client'

export default async function BookingsPage() {
    const bookings = await prisma.booking.findMany({
        include: { tour: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
    })

    const data = bookings.map((b) => ({
        id: b.id,
        bookingRef: b.bookingRef,
        customerName: `${b.firstName} ${b.lastName}`,
        tourName: b.tour.name,
        travelDate: new Date(b.travelDate).toLocaleDateString(),
        status: b.status,
        paymentStatus: b.paymentStatus,
        totalPrice: `${b.currency} ${b.totalPrice.toLocaleString()}`,
    }))

    return <BookingsClient data={data} />
}
