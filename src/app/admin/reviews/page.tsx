import { requireAdmin } from "@/lib/admin-auth"
import { prisma } from '@/lib/prisma'
import ReviewsClient from './reviews-client'

export const revalidate = 30

export default async function ReviewsPage() {
    await requireAdmin('reviews', 'VIEW');
    const reviews = await prisma.review.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
        include: { tour: { select: { name: true } } }
    })
    const data = reviews.map(r => ({
        id: r.id,
        customerName: r.customerName,
        title: r.title,
        rating: r.rating,
        tourName: r.tour.name,
        status: r.status,
        isFeatured: r.isFeatured,
        verified: r.verified,
    }))
    return <ReviewsClient data={data} />
}
