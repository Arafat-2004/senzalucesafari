'use server'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
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