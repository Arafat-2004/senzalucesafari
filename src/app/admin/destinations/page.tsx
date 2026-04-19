import { prisma } from '@/lib/prisma'
import DestinationsClient from './destinations-client'

export const revalidate = 60

export default async function DestinationsPage() {
    const destinations = await prisma.destination.findMany({ 
        orderBy: { displayOrder: 'asc' },
        take: 50 
    })
    const data = destinations.map(d => ({
        id: d.id,
        name: d.name,
        slug: d.slug,
        region: d.region,
        isActive: d.isActive,
    }))
    return <DestinationsClient data={data} />
}
