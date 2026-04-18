'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { BookingStatus, PaymentStatus } from '@/generated/prisma/client'
import { requireAdmin } from '@/lib/admin-auth'

export async function updateBooking(id: string, formData: FormData) {
    await requireAdmin()
    try {
        await prisma.booking.update({
            where: { id },
            data: {
                status: formData.get('status') as BookingStatus,
                paymentStatus: formData.get('paymentStatus') as PaymentStatus,
                internalNotes: (formData.get('internalNotes') as string) || null,
                vehicleId: (formData.get('vehicleId') as string) || null,
                guideId: (formData.get('guideId') as string) || null,
            },
        })
    } catch (error) {
        throw new Error(`Failed to update booking: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    revalidatePath('/admin/bookings')
    redirect('/admin/bookings')
}

export async function deleteBooking(id: string) {
    await requireAdmin()
    try {
        await prisma.booking.delete({ where: { id } })
    } catch (error) {
        throw new Error(`Failed to delete booking: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    revalidatePath('/admin/bookings')
}
