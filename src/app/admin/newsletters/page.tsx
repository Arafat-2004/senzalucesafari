import { prisma } from '@/lib/prisma'
import NewslettersClient from './newsletters-client'

export default async function NewslettersPage() {
    const newsletters = await prisma.newsletter.findMany({ orderBy: { subscribedAt: 'desc' } })

    const data = newsletters.map((n: { id: string; email: string; firstName: string | null; lastName: string | null; country: string | null; interests: string[]; isActive: boolean; subscribedAt: Date }) => ({
        id: n.id,
        email: n.email,
        firstName: n.firstName ?? '',
        lastName: n.lastName ?? '',
        country: n.country ?? '',
        interests: n.interests.join(', '),
        isActive: n.isActive,
        subscribedAt: new Date(n.subscribedAt).toLocaleDateString(),
    }))

    return <NewslettersClient data={data} />
}
