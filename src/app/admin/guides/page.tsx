import { requireAdmin } from "@/lib/admin-auth"
import { prisma } from '@/lib/prisma'
import GuidesClient from './guides-client'

export const revalidate = 60

export default async function GuidesPage() {
    await requireAdmin('tours', 'VIEW');
    const guides = await prisma.guide.findMany({ orderBy: { createdAt: 'desc' }, take: 50 })
    const data = guides.map(g => ({
        id: g.id,
        name: `${g.firstName} ${g.lastName}`,
        email: g.email,
        experience: `${g.experience} years`,
        languages: g.languages?.join(', ') || '',
        rating: g.rating,
        isActive: g.isActive,
        reviewCount: g.reviewCount,
    }))
    return <GuidesClient data={data} />
}
