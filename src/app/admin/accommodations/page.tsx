import { requireAdmin } from "@/lib/admin-auth"
import { prisma } from '@/lib/prisma'
import AccommodationsClient from './accommodations-client'

export const revalidate = 60

export default async function AccommodationsPage() {
    await requireAdmin();
    const accommodations = await prisma.accommodation.findMany({ orderBy: { name: 'asc' }, take: 100 })
    const data = accommodations.map(a => ({
        id: a.id,
        name: a.name,
        type: a.type,
        location: a.location,
        pricePerNight: a.pricePerNight,
        rating: a.rating,
        isActive: a.isActive,
    }))
    return <AccommodationsClient data={data} />
}
