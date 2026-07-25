import { requirePageAdmin } from "@/lib/admin-auth"
import AccommodationForm from '../accommodation-form'

export default async function NewAccommodationPage() {
    await requirePageAdmin('tours', 'CREATE');
    return <AccommodationForm />
}
