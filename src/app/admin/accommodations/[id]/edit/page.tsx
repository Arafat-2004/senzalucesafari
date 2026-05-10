import { requireAdmin } from "@/lib/admin-auth"
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AccommodationForm from '../../accommodation-form'

export default async function EditAccommodationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    await requireAdmin();
    const accommodation = await prisma.accommodation.findUnique({ where: { id } })
    if (!accommodation) notFound()
    return <AccommodationForm accommodation={accommodation} />
}
