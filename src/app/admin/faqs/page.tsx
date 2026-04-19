import { prisma } from '@/lib/prisma'
import FAQsClient from './faqs-client'

export const revalidate = 60

export default async function FAQsPage() {
    const faqs = await prisma.fAQ.findMany({ orderBy: { createdAt: 'desc' }, take: 50 })
    const data = faqs.map(f => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        category: f.category,
        displayOrder: f.displayOrder,
        isActive: f.isActive,
    }))
    return <FAQsClient data={data} />
}
