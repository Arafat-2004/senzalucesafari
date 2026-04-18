import { prisma } from '@/lib/prisma'
import GuidesClient from './guides-client'

export default async function GuidesPage() {
    const guides = await prisma.guide.findMany({ orderBy: { firstName: 'asc' } })

    const data = guides.map((g: { id: string; firstName: string; lastName: string; email: string; experience: number; languages: string[]; rating: number; isActive: boolean }) => ({
        id: g.id,
        name: `${g.firstName} ${g.lastName}`,
        email: g.email,
        experience: `${g.experience} years`,
        languages: g.languages.join(', '),
        rating: g.rating,
        isActive: g.isActive,
    }))

    return <GuidesClient data={data} />
}
