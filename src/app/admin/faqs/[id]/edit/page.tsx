import { requireAdmin } from "@/lib/admin-auth"
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import FAQForm from '../../faq-form'

export default async function EditFAQPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    await requireAdmin();
    const faq = await prisma.fAQ.findUnique({ where: { id } })
    if (!faq) notFound()
    return <FAQForm faq={faq} />
}
