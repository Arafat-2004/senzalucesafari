import { requireAdmin } from "@/lib/admin-auth"
import { prisma } from '@/lib/prisma'
import ReviewForm from '../review-form'

export default async function NewReviewPage() {
    await requireAdmin('reviews', 'EDIT')
    const tours = await prisma.tour.findMany({
        select: { id: true, name: true, isActive: true },
        orderBy: [{ isActive: 'desc' }, { name: 'asc' }],
    })
    return <ReviewForm tours={tours} />
}
