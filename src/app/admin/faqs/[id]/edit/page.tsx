import { requireAdmin } from "@/lib/admin-auth"
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import FAQForm from '../../faq-form'
import { FAQPublishingCard } from './faq-publishing-card'

export default async function EditFAQPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    await requireAdmin('tours', 'EDIT');
    const faq = await prisma.fAQ.findUnique({ where: { id } })
    if (!faq) notFound()
    return <div className="space-y-6"><FAQPublishingCard faq={faq} /><FAQForm faq={faq} /></div>
}
