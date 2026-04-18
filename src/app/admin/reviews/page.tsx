import { prisma } from '@/lib/prisma'
import ReviewsClient from './reviews-client'

export default async function ReviewsPage() {
    const reviews = await prisma.review.findMany({
        include: { tour: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
    })

    const data = reviews.map((r: { id: string; customerName: string; title: string; rating: number; tour: { name: string }; isApproved: boolean; isFeatured: boolean; verified: boolean }) => ({
        id: r.id,
        customerName: r.customerName,
        title: r.title,
        rating: r.rating,
        tourName: r.tour.name,
        isApproved: r.isApproved,
        isFeatured: r.isFeatured,
        verified: r.verified,
    }))

    return <ReviewsClient data={data} />
}
