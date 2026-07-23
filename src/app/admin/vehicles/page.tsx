import { requireAdmin } from "@/lib/admin-auth"
import { prisma } from '@/lib/prisma'
import VehiclesClient from './vehicles-client'

export const revalidate = 60

export default async function VehiclesPage() {
    await requireAdmin('tours', 'VIEW');
    const vehicles = await prisma.vehicle.findMany({ orderBy: { name: 'asc' }, take: 100 })
    const data = vehicles.map(v => ({
        id: v.id,
        name: v.name,
        category: v.category,
        capacity: v.capacity,
        priceRange: v.priceRange,
        rating: v.rating,
        isActive: v.isActive,
    }))
    return <VehiclesClient data={data} />
}
