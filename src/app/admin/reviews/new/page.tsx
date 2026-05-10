import { requireAdmin } from "@/lib/admin-auth"
import ReviewForm from '../review-form'

export default async function NewReviewPage() {
    await requireAdmin();
    return <ReviewForm />
}
