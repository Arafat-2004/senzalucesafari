'use server'

import { prisma } from '@/lib/prisma'
import type { BookingStatus, PaymentStatus } from '@/generated/prisma/client'
import { requireAdmin } from '@/lib/admin-auth'
import { logBookingUpdate, logCmsAction } from '@/lib/reliability/cms-audit'
import { invalidateBookings } from '@/lib/reliability/cache-manager'
import { sendBookingStatusUpdateEmail } from '@/lib/email/booking-status-update'
import { logger } from '@/lib/reliability/logger'

export async function updateBooking(id: string, formData: FormData) {
    const admin = await requireAdmin('bookings', 'EDIT')
    try {
        const vId = formData.get('vehicleId') as string | null
        const gId = formData.get('guideId') as string | null

        const data = {
            status: formData.get('status') as BookingStatus,
            paymentStatus: formData.get('paymentStatus') as PaymentStatus,
            internalNotes: (formData.get('internalNotes') as string) || null,
            vehicleId: vId?.trim() ? vId.trim() : null,
            guideId: gId?.trim() ? gId.trim() : null,
        }

        const existing = await prisma.booking.findUnique({
            where: { id },
            include: { tour: true },
        })

        const statusChanged = existing && existing.status !== data.status
        const paymentChanged = existing && existing.paymentStatus !== data.paymentStatus

        await prisma.booking.update({
            where: { id },
            data,
        })

        if (existing) {
            logBookingUpdate(id, existing, data, admin.id)
        }
        invalidateBookings()

        if (statusChanged || paymentChanged) {
            const tourName = existing?.tour?.name || 'Safari Tour'
            const customerFirstName = existing?.firstName || 'there'

            sendBookingStatusUpdateEmail({
                bookingRef: existing?.bookingRef || id,
                tourName,
                customerFirstName,
                customerEmail: existing?.email || '',
                travelDate: existing?.travelDate || new Date(),
                endDate: existing?.endDate || new Date(),
                numberOfTravelers: existing?.numberOfTravelers || 1,
                oldStatus: existing?.status || 'PENDING',
                newStatus: data.status,
                oldPaymentStatus: existing?.paymentStatus || undefined,
                newPaymentStatus: data.paymentStatus,
            }).catch(err => {
                logger.error('[Booking] Failed to send status update email', {
                    bookingId: id,
                    error: err instanceof Error ? err.message : String(err),
                })
            })
        }
    } catch (error: unknown) {
        const prismaError = error as { code?: string; meta?: { field_name?: string } }
        if (prismaError?.code === 'P2003') {
            throw new Error(`Invalid ID provided: The specified Vehicle or Guide does not exist.`)
        }
        throw new Error(`Failed to update booking: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function deleteBooking(id: string) {
    const admin = await requireAdmin('bookings', 'DELETE')
    try {
        const existing = await prisma.booking.findUnique({
            where: { id },
            include: { tour: true },
        })

        await prisma.booking.delete({ where: { id } })

        logCmsAction('booking', 'delete', { entityId: id, userId: admin.id })
        invalidateBookings()

        if (existing) {
            sendBookingStatusUpdateEmail({
                bookingRef: existing.bookingRef,
                tourName: existing.tour?.name || 'Safari Tour',
                customerFirstName: existing.firstName,
                customerEmail: existing.email,
                travelDate: existing.travelDate,
                endDate: existing.endDate,
                numberOfTravelers: existing.numberOfTravelers,
                oldStatus: existing.status,
                newStatus: 'CANCELLED',
            }).catch(err => {
                logger.error('[Booking] Failed to send cancellation email', {
                    bookingId: id,
                    error: err instanceof Error ? err.message : String(err),
                })
            })
        }
    } catch (error) {
        throw new Error(`Failed to delete booking: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}
