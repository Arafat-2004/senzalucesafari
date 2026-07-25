import { requirePageAdmin } from "@/lib/admin-auth"
import GuideForm from '../guide-form'

export default async function NewGuidePage() {
    await requirePageAdmin('tours', 'CREATE');
    return <GuideForm />
}
