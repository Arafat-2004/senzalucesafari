import { requireAdmin } from "@/lib/admin-auth"
import { prisma } from '@/lib/prisma'
import NewslettersClient from './newsletters-client'

export const revalidate = 60

export default async function NewslettersPage() {
    await requireAdmin('tours', 'VIEW');
    const newsletters = await prisma.newsletter.findMany({ orderBy: { subscribedAt: 'desc' }, take: 100 })
    const data = newsletters.map(n => ({
        ...n,
        firstName: n.firstName || '',
        lastName: n.lastName || '',
        country: n.country || '',
        interests: n.interests?.join(', ') || '',
        subscribedAt: n.subscribedAt.toISOString(),
    }))
    return <NewslettersClient data={data} />
}
