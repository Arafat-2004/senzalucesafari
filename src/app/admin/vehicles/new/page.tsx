import { requirePageAdmin } from "@/lib/admin-auth"
import VehicleForm from '../vehicle-form'

export default async function NewVehiclePage() {
    await requirePageAdmin('tours', 'CREATE');
    return <VehicleForm />
}
