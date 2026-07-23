import { requireAdmin } from "@/lib/admin-auth"
import FAQForm from '../faq-form'

export default async function NewFAQPage() {
    await requireAdmin('tours', 'CREATE');
    return <FAQForm />
}
