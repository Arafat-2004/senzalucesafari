import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import GuideForm from '../../guide-form'

export default async function EditGuidePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const guide = await prisma.guide.findUnique({ where: { id } })
    if (!guide) notFound()
    return <GuideForm guide={guide} />
}
