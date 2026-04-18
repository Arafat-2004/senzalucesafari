import { prisma } from '@/lib/prisma'
import DestinationsClient from './destinations-client'

export default async function DestinationsPage() {
    const destinations = await prisma.destination.findMany({ orderBy: { displayOrder: 'asc' } })
    return <DestinationsClient data={destinations} />
}
