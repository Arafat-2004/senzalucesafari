import { prisma } from '@/lib/prisma'
import ToursClient from './tours-client'

export default async function ToursPage() {
    const tours = await prisma.tour.findMany({ orderBy: { displayOrder: 'asc' } })
    return <ToursClient data={tours} />
}
