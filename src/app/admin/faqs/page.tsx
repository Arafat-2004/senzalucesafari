import { prisma } from '@/lib/prisma'
import FAQsClient from './faqs-client'

export default async function FAQsPage() {
    const faqs = await prisma.fAQ.findMany({ orderBy: { displayOrder: 'asc' } })
    return <FAQsClient data={faqs} />
}
