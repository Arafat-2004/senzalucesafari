'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/admin-auth'

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
    await requireAdmin()
    try {
        await prisma.review.create({ data: extractData(formData) })
        revalidatePath('/admin/reviews')
    } catch (error) {
        throw new Error(`Failed to create review: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function updateReview(id: string, formData: FormData) {
    await requireAdmin()
    try {
        await prisma.review.update({ where: { id }, data: extractData(formData) })
        revalidatePath('/admin/reviews')
        revalidatePath(`/admin/reviews/${id}/edit`)
    } catch (error) {
        throw new Error(`Failed to update review: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function deleteReview(id: string) {
    await requireAdmin()
    try {
        await prisma.review.delete({ where: { id } })
    } catch (error) {
        throw new Error(`Failed to delete review: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    revalidatePath('/admin/reviews')
}
