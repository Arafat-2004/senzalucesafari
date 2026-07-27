import { requirePageAdmin } from '@/lib/admin-auth'
import TeamMemberForm from '../team-member-form'

export default async function NewTeamMemberPage() {
    await requirePageAdmin('settings', 'CREATE')
    return <TeamMemberForm />
}
