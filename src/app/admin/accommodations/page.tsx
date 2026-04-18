import { prisma } from '@/lib/prisma'
import AccommodationsClient from './accommodations-client'

export default async function AccommodationsPage() {
    const accommodations = await prisma.accommodation.findMany({ orderBy: { name: 'asc' } })
    return <AccommodationsClient data={accommodations} />
}
