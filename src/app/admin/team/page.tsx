import { requirePageAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import TeamClient from './team-client'

export const revalidate = 60

export default async function TeamPage() {
    await requirePageAdmin('settings', 'VIEW')

    const members = await prisma.teamMember.findMany({
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
    })

    const data = members.map(m => ({
        id: m.id,
        name: m.name,
        role: m.role,
        displayOrder: m.displayOrder,
        isVisible: m.isVisible,
        hasPhoto: Boolean(m.imageUrl),
    }))

    return <TeamClient data={data} />
}
