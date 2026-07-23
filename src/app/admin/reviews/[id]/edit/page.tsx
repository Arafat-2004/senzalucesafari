import { requireAdmin } from "@/lib/admin-auth"
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ReviewForm from '../../review-form'
import { ReviewApprovalCard } from './review-approval-card'

export default async function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    await requireAdmin('reviews', 'EDIT');
    const [review, tours] = await Promise.all([
        prisma.review.findUnique({
            where: { id },
            include: { tour: { select: { name: true, slug: true } } },
        }),
        prisma.tour.findMany({
            select: { id: true, name: true, isActive: true },
            orderBy: [{ isActive: 'desc' }, { name: 'asc' }],
        }),
    ])
    if (!review) notFound()
    return (
        <div className="max-w-5xl space-y-6">
            <ReviewApprovalCard review={review} />
            <ReviewForm review={review} tours={tours} />
        </div>
    )
}
