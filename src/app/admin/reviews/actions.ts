'use server'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { createNotification } from '@/lib/admin-audit'
import { logger } from '@/lib/reliability/logger'
import { logReviewCreate, logCmsAction } from '@/lib/reliability/cms-audit'
import { invalidateReviews, invalidateTours } from '@/lib/reliability/cache-manager'
import { z } from 'zod'

const reviewFormSchema = z.object({
    tourId: z.string().uuid('Please select a safari package.'),
    customerName: z.string().trim().min(2, 'Customer name is required.').max(100),
    customerEmail: z.union([z.literal(''), z.string().trim().email('Enter a valid email address.')]),
    country: z.string().trim().max(100),
    rating: z.coerce.number().int().min(1).max(5),
    title: z.string().trim().min(3, 'Add a short review title.').max(200),
    comment: z.string().trim().min(3, 'Add the customer review.').max(3000),
    content: z.string().trim().max(5000),
    travelDate: z.string(),
    reviewDate: z.string(),
    verified: z.boolean(),
    isFeatured: z.boolean(),
})

const rejectionReasonSchema = z.string().trim().min(3, 'Please provide a clear reason.').max(500, 'Keep the reason under 500 characters.')

function extractData(f: FormData) {
    const parsed = reviewFormSchema.parse({
        tourId: f.get('tourId'),
        customerName: f.get('customerName'),
        customerEmail: f.get('customerEmail') ?? '',
        country: f.get('country') ?? '',
        rating: f.get('rating'),
        title: f.get('title'),
        comment: f.get('comment'),
        content: f.get('content') ?? '',
        travelDate: f.get('travelDate') ?? '',
        reviewDate: f.get('reviewDate') ?? '',
        verified: f.get('verified') === 'on',
        isFeatured: f.get('isFeatured') === 'on',
    })

    return {
        ...parsed,
        customerEmail: parsed.customerEmail || null,
        author: parsed.customerName,
        country: parsed.country || null,
        content: parsed.content || null,
        travelDate: parsed.travelDate ? new Date(`${parsed.travelDate}T12:00:00.000Z`) : null,
        reviewDate: parsed.reviewDate ? new Date(`${parsed.reviewDate}T12:00:00.000Z`) : new Date(),
    }
}

export async function createReview(formData: FormData) {
    const admin = await requireAdmin('reviews', 'EDIT')
    try {
        const data = extractData(formData)
        const review = await prisma.review.create({
            data: {
                ...data,
                isApproved: false,
                isFeatured: false,
                status: 'PENDING',
            },
        })
        
        logReviewCreate(review.id, data, admin.id)
        invalidateReviews()
        invalidateTours() // Reviews affect tour ratings
        return { id: review.id }
    } catch (error) {
        throw new Error(`Failed to create review: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function updateReview(id: string, formData: FormData) {
    const admin = await requireAdmin('reviews', 'EDIT')
    try {
        const data = extractData(formData)
        const existing = await prisma.review.findUnique({ where: { id } })
        if (!existing) throw new Error('Review not found')

        const nextData = {
            ...data,
            isFeatured: existing.status === 'APPROVED' ? data.isFeatured : false,
        }

        await prisma.review.update({ where: { id }, data: nextData })
        
        if (existing) {
            logCmsAction('review', 'update', { entityId: id, previousValue: existing, newValue: nextData, userId: admin.id })
        }
        invalidateReviews()
        invalidateTours()
    } catch (error) {
        throw new Error(`Failed to update review: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function deleteReview(id: string) {
    const admin = await requireAdmin('reviews', 'DELETE')
    try {
        await prisma.review.delete({ where: { id } })
        
        logCmsAction('review', 'delete', { entityId: id, userId: admin.id })
        invalidateReviews()
        invalidateTours()
    } catch (error) {
        throw new Error(`Failed to delete review: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

// REVIEW_APPROVAL: Approve a review via server action
export async function approveReview(id: string) {
    const admin = await requireAdmin('reviews', 'APPROVE')
    try {
        const existing = await prisma.review.findUnique({
            where: { id },
            include: { tour: { select: { name: true } } },
        })
        if (!existing) throw new Error('Review not found')

        await prisma.review.update({
            where: { id },
            data: {
                status: 'APPROVED',
                isApproved: true,
                rejectionReason: null,
                rejectedAt: null,
                approvedAt: new Date(),
                approvedBy: admin.id,
            },
        })

        createNotification({
            type: 'REVIEW_APPROVED',
            title: 'Review Approved',
            message: `"${existing.title.substring(0, 50)}..." by ${existing.customerName} is now live on ${existing.tour.name}`,
            actionUrl: `/admin/reviews/${id}/edit`,
        }).catch(err => logger.error('[Review Approval] Notification error', { error: err instanceof Error ? err.message : String(err) }))

        logCmsAction('review', 'update', { entityId: id, previousValue: existing, newValue: { isApproved: true }, userId: admin.id })
        invalidateReviews()
        invalidateTours()

        return { success: true }
    } catch (error) {
        throw new Error(`Failed to approve review: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

// REVIEW_APPROVAL: Reject a review via server action
export async function rejectReview(id: string, reason: string) {
    const admin = await requireAdmin('reviews', 'APPROVE')
    try {
        const safeReason = rejectionReasonSchema.parse(reason)
        const existing = await prisma.review.findUnique({
            where: { id },
            include: { tour: { select: { name: true } } },
        })
        if (!existing) throw new Error('Review not found')

        await prisma.review.update({
            where: { id },
            data: {
                status: 'REJECTED',
                isApproved: false,
                isFeatured: false,
                approvedAt: null,
                approvedBy: null,
                rejectionReason: safeReason,
                rejectedAt: new Date(),
            },
        })

        createNotification({
            type: 'REVIEW_REJECTED',
            title: 'Review Rejected',
            message: `Review "${existing.title.substring(0, 50)}..." by ${existing.customerName} was rejected`,
            actionUrl: `/admin/reviews/${id}/edit`,
        }).catch(err => logger.error('[Review Rejection] Notification error', { error: err instanceof Error ? err.message : String(err) }))

        logCmsAction('review', 'update', { entityId: id, previousValue: existing, newValue: { status: 'REJECTED', isApproved: false, reason: safeReason }, userId: admin.id })

        invalidateReviews()
        invalidateTours()

        return { success: true }
    } catch (error) {
        throw new Error(`Failed to reject review: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}
