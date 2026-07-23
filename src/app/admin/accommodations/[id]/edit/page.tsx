import { requireAdmin } from "@/lib/admin-auth"
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AccommodationForm from '../../accommodation-form'
import {AccommodationVisibilityCard} from './accommodation-visibility-card'

export default async function EditAccommodationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    await requireAdmin('tours', 'EDIT');
    const accommodation = await prisma.accommodation.findUnique({ where: { id } })
    if (!accommodation) notFound()
    return <div className="space-y-6"><AccommodationVisibilityCard item={accommodation}/><AccommodationForm accommodation={accommodation}/></div>
}
