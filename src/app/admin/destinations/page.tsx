import { requireAdmin } from "@/lib/admin-auth"
import { prisma } from '@/lib/prisma'
import DestinationsClient from './destinations-client'

export const revalidate = 60

export default async function DestinationsPage() {
    await requireAdmin('destinations', 'VIEW');
    const destinations = await prisma.destination.findMany({ 
        orderBy: { displayOrder: 'asc' },
        take: 50 
    })
    const data = destinations.map(d => ({
        id: d.id,
        name: d.name,
        slug: d.slug,
        region: d.region,
        wildlifeRating: d.wildlifeRating,
        isActive: d.isActive,
    }))
    return <DestinationsClient data={data} />
}
