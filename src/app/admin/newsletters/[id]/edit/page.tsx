import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import NewsletterEditPage from './page-client'

export default async function EditNewsletterPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const newsletter = await prisma.newsletter.findUnique({ where: { id } })
    if (!newsletter) notFound()
    return <NewsletterEditPage newsletter={newsletter} />
}
