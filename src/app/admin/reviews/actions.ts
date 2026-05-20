'use server'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { createNotification } from '@/lib/admin-audit'
import { logger } from '@/lib/reliability/logger'
import { logReviewCreate, logCmsAction } from '@/lib/reliability/cms-audit'
import { invalidateReviews, invalidateTours } from '@/lib/reliability/cache-manager'

function extractData(f: FormData) {
    return {
        tourId: f.get('tourId') as string,
        customerName: f.get('customerName') as string,
        customerEmail: (f.get('customerEmail') as string) || null,
        author: (f.get('author') as string) || null,
        country: (f.get('country') as string) || null,
        rating: parseInt(f.get('rating') as string) || 5,
        title: f.get('title') as string,
        comment: f.get('comment') as string,
        content: (f.get('content') as string) || null,
        safariPackage: (f.get('safariPackage') as string) || null,
        travelDate: (f.get('travelDate') as string) ? new Date(f.get('travelDate') as string) : null,
        reviewDate: (f.get('reviewDate') as string) ? new Date(f.get('reviewDate') as string) : null,
        verified: f.get('verified') === 'on',
        isApproved: f.get('isApproved') === 'on',
        isFeatured: f.get('isFeatured') === 'on',
    }
}

export async function createReview(formData: FormData) {
    const admin = await requireAdmin()
    try {
        const data = extractData(formData)
        const review = await prisma.review.create({ data })
        
        logReviewCreate(review.id, data, admin.id)
        invalidateReviews()
        invalidateTours() // Reviews affect tour ratings
    } catch (error) {
        throw new Error(`Failed to create review: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function updateReview(id: string, formData: FormData) {
    const admin = await requireAdmin()
    try {
        const data = extractData(formData)
        const existing = await prisma.review.findUnique({ where: { id } })
        
        await prisma.review.update({ where: { id }, data })
        
        if (existing) {
            logCmsAction('review', 'update', { entityId: id, previousValue: existing, newValue: data, userId: admin.id })
        }
        invalidateReviews()
        invalidateTours()
    } catch (error) {
        throw new Error(`Failed to update review: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function deleteReview(id: string) {
    const admin = await requireAdmin()
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
    const admin = await requireAdmin()
    try {
        const existing = await prisma.review.findUnique({
            where: { id },
            include: { tour: { select: { name: true } } },
        })
        if (!existing) throw new Error('Review not found')

        const updated = await prisma.review.update({
            where: { id },
            data: {
                isApproved: true,
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
    const admin = await requireAdmin()
    try {
        const existing = await prisma.review.findUnique({
            where: { id },
            include: { tour: { select: { name: true } } },
        })
        if (!existing) throw new Error('Review not found')

        const updated = await prisma.review.update({
            where: { id },
            data: {
                isApproved: false,
                rejectionReason: reason,
                rejectedAt: new Date(),
            },
        })

        createNotification({
            type: 'REVIEW_REJECTED',
            title: 'Review Rejected',
            message: `Review "${existing.title.substring(0, 50)}..." by ${existing.customerName} was rejected`,
            actionUrl: `/admin/reviews/${id}/edit`,
        }).catch(err => logger.error('[Review Rejection] Notification error', { error: err instanceof Error ? err.message : String(err) }))

        logCmsAction('review', 'update', { entityId: id, previousValue: existing, newValue: { isApproved: false, reason }, userId: admin.id })

        return { success: true }
    } catch (error) {
        throw new Error(`Failed to reject review: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}