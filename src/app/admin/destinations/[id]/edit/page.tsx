import { requireAdmin } from "@/lib/admin-auth"
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DestinationForm from '../../destination-form'
import { DestinationVisibilityCard } from './destination-visibility-card'

export default async function EditDestinationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    await requireAdmin('destinations', 'EDIT');
    const destination = await prisma.destination.findUnique({ where: { id } })
    if (!destination) notFound()
    return <div className="space-y-6"><DestinationVisibilityCard destination={destination} /><DestinationForm destination={destination} /></div>
}
