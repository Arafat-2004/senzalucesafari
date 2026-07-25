import { requirePageAdmin } from "@/lib/admin-auth"
import TourForm from '../tour-form'

export default async function NewTourPage() {
    await requirePageAdmin('tours', 'CREATE');
    return <TourForm />
}
