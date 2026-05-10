import { requireAdmin } from "@/lib/admin-auth"
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ReviewForm from '../../review-form'

export default async function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    await requireAdmin();
    const review = await prisma.review.findUnique({ where: { id } })
    if (!review) notFound()
    return <ReviewForm review={review} />
}
