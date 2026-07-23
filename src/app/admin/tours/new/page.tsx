import { requireAdmin } from "@/lib/admin-auth"
import TourForm from '../tour-form'

export default async function NewTourPage() {
    await requireAdmin('tours', 'CREATE');
    return <TourForm />
}
