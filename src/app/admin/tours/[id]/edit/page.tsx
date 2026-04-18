import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import TourForm from '../../tour-form'

export default async function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const tour = await prisma.tour.findUnique({ where: { id } })
    if (!tour) notFound()
    return <TourForm tour={tour} />
}
