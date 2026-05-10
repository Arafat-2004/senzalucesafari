import { requireAdmin } from "@/lib/admin-auth"
import DestinationForm from '../destination-form'
export default async function NewDestinationPage() { await requireAdmin(); return <DestinationForm /> }
