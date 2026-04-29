'use server'

import { prisma } from '@/lib/prisma'
import type { BookingStatus, PaymentStatus } from '@/generated/prisma/client'
import { requireAdmin } from '@/lib/admin-auth'
import { logBookingUpdate, logCmsAction } from '@/lib/reliability/cms-audit'
import { invalidateBookings } from '@/lib/reliability/cache-manager'

export async function updateBooking(id: string, formData: FormData) {
    const admin = await requireAdmin()
    try {
        const data = {
            status: formData.get('status') as BookingStatus,
            paymentStatus: formData.get('paymentStatus') as PaymentStatus,
            internalNotes: (formData.get('internalNotes') as string) || null,
            vehicleId: (formData.get('vehicleId') as string) || null,
            guideId: (formData.get('guideId') as string) || null,
        }
        
        const existing = await prisma.booking.findUnique({ where: { id } })
        
        await prisma.booking.update({
            where: { id },
            data,
        })
        
        if (existing) {
            logBookingUpdate(id, existing, data, admin.id)
        }
        invalidateBookings()
    } catch (error) {
        throw new Error(`Failed to update booking: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function deleteBooking(id: string) {
    const admin = await requireAdmin()
    try {
        await prisma.booking.delete({ where: { id } })
        
        logCmsAction('booking', 'delete', { entityId: id, userId: admin.id })
        invalidateBookings()
    } catch (error) {
        throw new Error(`Failed to delete booking: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}