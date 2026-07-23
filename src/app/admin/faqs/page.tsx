import { requireAdmin } from "@/lib/admin-auth"
import { prisma } from '@/lib/prisma'
import FAQsClient from './faqs-client'

export const revalidate = 60

export default async function FAQsPage() {
    await requireAdmin('tours', 'VIEW');
    const faqs = await prisma.fAQ.findMany({ orderBy: { createdAt: 'desc' }, take: 50 })
    const data = faqs.map(f => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        category: f.category,
        displayOrder: f.displayOrder,
        isActive: f.isActive,
        viewCount: f.viewCount,
        helpfulCount: f.helpfulCount,
        notHelpfulCount: f.notHelpfulCount,
    }))
    return <FAQsClient data={data} />
}
