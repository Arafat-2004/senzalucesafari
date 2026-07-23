import { requireAdmin } from "@/lib/admin-auth"
import VehicleForm from '../vehicle-form'

export default async function NewVehiclePage() {
    await requireAdmin('tours', 'CREATE');
    return <VehicleForm />
}
