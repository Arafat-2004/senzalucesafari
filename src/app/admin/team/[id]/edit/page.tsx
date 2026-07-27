import { requirePageAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import TeamMemberForm from '../../team-member-form'

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
    await requirePageAdmin('settings', 'EDIT')
    const { id } = await params
    const member = await prisma.teamMember.findUnique({ where: { id } })
    if (!member) notFound()
    return <TeamMemberForm member={member} />
}
