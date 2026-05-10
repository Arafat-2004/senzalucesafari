import { requireAdmin } from "@/lib/admin-auth"
import GuideForm from '../guide-form'

export default async function NewGuidePage() {
    await requireAdmin();
    return <GuideForm />
}
