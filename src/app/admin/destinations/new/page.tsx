import { requirePageAdmin } from "@/lib/admin-auth"
import DestinationForm from '../destination-form'
export default async function NewDestinationPage() { await requirePageAdmin('destinations', 'CREATE'); return <DestinationForm /> }
