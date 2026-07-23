import { requireAdmin } from "@/lib/admin-auth"
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import VehicleForm from '../../vehicle-form'
import {VehicleAvailabilityCard} from './vehicle-availability-card'

export default async function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    await requireAdmin('tours', 'EDIT');
    const vehicle = await prisma.vehicle.findUnique({ where: { id } })
    if (!vehicle) notFound()
    return <div className="space-y-6"><VehicleAvailabilityCard vehicle={vehicle}/><VehicleForm vehicle={vehicle}/></div>
}
