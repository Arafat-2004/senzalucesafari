'use server'

import { prisma } from '@/lib/prisma'
import type { BookingStatus, PaymentStatus } from '@/generated/prisma/client'
import { requireAdmin } from '@/lib/admin-auth'
import { logBookingUpdate, logCmsAction } from '@/lib/reliability/cms-audit'
import { invalidateBookings } from '@/lib/reliability/cache-manager'
import { sendBookingStatusUpdateEmail } from '@/lib/email/booking-status-update'
import { sendBookingConfirmationEmail } from '@/lib/email/booking-confirmation'
import { calculateSafariPrice } from '@/lib/pricing-engine'
import { logger } from '@/lib/reliability/logger'

function generateBookingRef(): string {
    const prefix = 'SLS'
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `${prefix}-${timestamp}-${random}`
}

export async function createAdminBooking(formData: FormData) {
    const admin = await requireAdmin('bookings', 'CREATE')
    try {
        const tourId = String(formData.get('tourId') ?? '')
        const tour = await prisma.tour.findUnique({ where: { id: tourId } })
        if (!tour) throw new Error('Please select a valid safari package.')

        const firstName = String(formData.get('firstName') ?? '').trim()
        const lastName = String(formData.get('lastName') ?? '').trim()
        const email = String(formData.get('email') ?? '').trim().toLowerCase()
        const phone = String(formData.get('phone') ?? '').trim()
        const country = String(formData.get('country') ?? '').trim() || 'Not specified'
        const travelDateValue = String(formData.get('travelDate') ?? '')
        const endDateValue = String(formData.get('endDate') ?? '')
        const numberOfTravelers = Math.max(1, Number(formData.get('numberOfTravelers') ?? 1))
        const accommodationLevel = String(formData.get('accommodationLevel') ?? 'mid-range')
        const specialRequests = String(formData.get('specialRequests') ?? '').trim() || null
        const internalNotes = String(formData.get('internalNotes') ?? '').trim() || null
        const inquiryId = String(formData.get('inquiryId') ?? '').trim()

        if (!firstName || !lastName || !email || !phone || !travelDateValue) {
            throw new Error('Customer name, email, phone, and travel date are required.')
        }

        const pricing = calculateSafariPrice(tour.priceFrom || 0, numberOfTravelers, accommodationLevel)
        const travelDate = new Date(`${travelDateValue}T12:00:00.000Z`)
        const endDate = endDateValue
            ? new Date(`${endDateValue}T12:00:00.000Z`)
            : (() => {
                const date = new Date(travelDate)
                const daysMatch = tour.duration.match(/(\d+)\s*days?/)
                date.setDate(date.getDate() + (daysMatch ? parseInt(daysMatch[1]) : 1))
                return date
            })()

        let booking
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                booking = await prisma.booking.create({
                    data: {
                        bookingRef: generateBookingRef(),
                        tourId,
                        firstName,
                        lastName,
                        email,
                        phone,
                        country,
                        travelDate,
                        endDate,
                        numberOfTravelers,
                        accommodationLevel,
                        pricePerPerson: pricing.pricePerPerson,
                        totalPrice: pricing.totalPrice,
                        paymentStatus: 'PENDING',
                        status: 'PENDING',
                        specialRequests,
                        internalNotes: inquiryId ? `${internalNotes ? `${internalNotes}\n\n` : ''}Converted from inquiry ${inquiryId}` : internalNotes,
                        source: inquiryId ? 'admin_inquiry_conversion' : 'admin',
                    },
                })
                break
            } catch (err: unknown) {
                const maybePrisma = err as { code?: string }
                if (maybePrisma.code !== 'P2002' || attempt === 2) throw err
            }
        }

        if (!booking) throw new Error('Unable to create booking reference. Please try again.')

        if (inquiryId) {
            await prisma.contactInquiry.update({
                where: { id: inquiryId },
                data: {
                    isRead: true,
                    isReplied: true,
                    repliedAt: new Date(),
                    internalNotes: `Converted to booking ${booking.bookingRef}${internalNotes ? `\n\n${internalNotes}` : ''}`,
                },
            }).catch(err => logger.warn('[Booking] Inquiry conversion note failed', { inquiryId, error: err instanceof Error ? err.message : String(err) }))
        }

        logCmsAction('booking', 'create', { entityId: booking.id, newValue: { bookingRef: booking.bookingRef, source: booking.source }, userId: admin.id })
        invalidateBookings()

        sendBookingConfirmationEmail({
            bookingRef: booking.bookingRef,
            tourName: tour.name,
            customerFirstName: firstName,
            customerEmail: email,
            travelDate,
            endDate,
            numberOfTravelers,
            accommodationLevel,
            totalPrice: pricing.totalPrice,
            currency: booking.currency,
            pricePerPerson: pricing.pricePerPerson,
        }).catch(err => logger.error('[Booking] Admin-created confirmation email failed', { error: err instanceof Error ? err.message : String(err) }))

        return { id: booking.id }
    } catch (error) {
        throw new Error(`Failed to create booking: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

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
                tourSlug: existing?.tour?.slug,
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
                tourSlug: existing.tour?.slug,
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
