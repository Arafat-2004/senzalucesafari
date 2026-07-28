import { requirePageAdmin } from "@/lib/admin-auth"
import { prisma } from '@/lib/prisma'
import { NewBookingForm } from '../new-booking-form'

export const dynamic = 'force-dynamic'

export default async function NewBookingPage({ searchParams }: { searchParams: Promise<{ fromInquiry?: string }> }) {
    await requirePageAdmin('bookings', 'CREATE')
    const { fromInquiry } = await searchParams

    const [tours, inquiry] = await Promise.all([
        prisma.tour.findMany({
            where: { isActive: true },
            select: { id: true, name: true, duration: true, priceFrom: true },
            orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }, { name: 'asc' }],
        }),
        fromInquiry
            ? prisma.contactInquiry.findUnique({ where: { id: fromInquiry } })
            : Promise.resolve(null),
    ])

    return (
        <NewBookingForm
            tours={tours}
            inquiry={inquiry ? {
                id: inquiry.id,
                name: inquiry.name,
                email: inquiry.email,
                phone: inquiry.phone,
                country: inquiry.country,
                message: inquiry.message,
                tourInterest: inquiry.tourInterest,
                travelDate: inquiry.travelDate?.toISOString().split('T')[0] ?? null,
                numberOfTravelers: inquiry.numberOfTravelers,
            } : null}
        />
    )
}
