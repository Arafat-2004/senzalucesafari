import { prisma } from '@/lib/prisma'
import VehiclesClient from './vehicles-client'

export default async function VehiclesPage() {
    const vehicles = await prisma.vehicle.findMany({ orderBy: { name: 'asc' } })
    return <VehiclesClient data={vehicles} />
}
