import { requireAdmin } from "@/lib/admin-auth"
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DestinationForm from '../../destination-form'

export default async function EditDestinationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    await requireAdmin();
    const destination = await prisma.destination.findUnique({ where: { id } })
    if (!destination) notFound()
    return <DestinationForm destination={destination} />
}
