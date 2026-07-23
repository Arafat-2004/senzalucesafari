import { requireAdmin } from "@/lib/admin-auth"
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import TourForm from '../../tour-form'
import { TourVisibilityCard } from './tour-visibility-card'

export default async function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    await requireAdmin('tours', 'EDIT');
    const tour = await prisma.tour.findUnique({ where: { id } })
    if (!tour) notFound()
    return <div className="space-y-6"><TourVisibilityCard tour={tour} /><TourForm tour={tour} /></div>
}
