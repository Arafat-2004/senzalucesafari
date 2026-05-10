import { requireAdmin } from "@/lib/admin-auth"
import { prisma } from '@/lib/prisma'
import ToursClient from './tours-client'

export const revalidate = 60

export default async function ToursPage() {
    await requireAdmin();
    const tours = await prisma.tour.findMany({ 
        orderBy: { displayOrder: 'asc' },
        take: 100 
    })
    const data = tours.map(t => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        duration: t.duration,
        price: t.priceFrom,
        isActive: t.isActive,
        isFeatured: t.isFeatured,
    }))
    return <ToursClient data={data} />
}
