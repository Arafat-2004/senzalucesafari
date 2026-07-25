import { requirePageAdmin } from "@/lib/admin-auth"
import FAQForm from '../faq-form'

export default async function NewFAQPage() {
    await requirePageAdmin('tours', 'CREATE');
    return <FAQForm />
}
