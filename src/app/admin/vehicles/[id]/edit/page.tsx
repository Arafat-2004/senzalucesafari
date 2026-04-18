import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import VehicleForm from '../../vehicle-form'

export default async function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const vehicle = await prisma.vehicle.findUnique({ where: { id } })
    if (!vehicle) notFound()
    return <VehicleForm vehicle={vehicle} />
}
