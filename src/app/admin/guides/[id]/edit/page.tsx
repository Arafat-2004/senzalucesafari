import { requireAdmin } from "@/lib/admin-auth"
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import GuideForm from '../../guide-form'
import { GuideAvailabilityCard } from './guide-availability-card'

export default async function EditGuidePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    await requireAdmin('tours', 'EDIT');
    const guide = await prisma.guide.findUnique({ where: { id } })
    if (!guide) notFound()
    return <div className="space-y-6"><GuideAvailabilityCard guide={guide} /><GuideForm guide={guide} /></div>
}
