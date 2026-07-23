import { requireAdmin } from "@/lib/admin-auth"
import { prisma } from '@/lib/prisma'
import BookingsClient from './bookings-client'
import { format } from 'date-fns'

export const revalidate = 30

export default async function BookingsPage() {
    await requireAdmin('bookings', 'VIEW');
    const bookings = await prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
        include: { tour: { select: { name: true } } }
    }).catch(() => null)
    if (!bookings) return <BookingsClient data={[]} dataUnavailable />
    const data = bookings.map(b => ({
        id: b.id,
        bookingRef: b.bookingRef,
        customerName: `${b.firstName} ${b.lastName}`,
        tourName: b.tour.name,
        travelDate: format(b.travelDate, 'MMM d, yyyy'),
        status: b.status,
        paymentStatus: b.paymentStatus,
        totalPrice: `${b.currency} ${b.totalPrice.toFixed(2)}`,
    }))
    return <BookingsClient data={data} />
}
