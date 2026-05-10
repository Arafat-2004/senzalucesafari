import { requireAdmin } from "@/lib/admin-auth"
import AccommodationForm from '../accommodation-form'

export default async function NewAccommodationPage() {
    await requireAdmin();
    return <AccommodationForm />
}
