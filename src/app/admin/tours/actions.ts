'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/admin-auth'

function splitLines(val: string | null): string[] {
    return (val ?? '').split('\n').map(s => s.trim()).filter(Boolean)
}

function safeJsonParse(val: string, fallback: unknown = []) {
    try { return JSON.parse(val) } catch { return fallback }
}

function extractTourData(formData: FormData) {
    return {
        name: formData.get('name') as string,
        slug: formData.get('slug') as string,
        category: formData.get('category') as string,
        shortDescription: formData.get('shortDescription') as string,
        overview: formData.get('overview') as string,
        bestFor: splitLines(formData.get('bestFor') as string),
        duration: formData.get('duration') as string,
        startEnd: formData.get('startEnd') as string,
        highlights: splitLines(formData.get('highlights') as string),
        itinerary: safeJsonParse((formData.get('itinerary') as string) || '[]', []),
        included: splitLines(formData.get('included') as string),
        excluded: splitLines(formData.get('excluded') as string),
        imageUrl: formData.get('imageUrl') as string,
        priceFrom: parseFloat(formData.get('priceFrom') as string) || 0,
        difficulty: (formData.get('difficulty') as string) || null,
        isActive: formData.get('isActive') === 'on',
        isFeatured: formData.get('isFeatured') === 'on',
        displayOrder: parseInt(formData.get('displayOrder') as string) || 0,
    }
}

export async function createTour(formData: FormData) {
    await requireAdmin()
    try {
        await prisma.tour.create({ data: extractTourData(formData) })
    } catch (error) {
        throw new Error(`Failed to create tour: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    revalidatePath('/admin/tours')
    redirect('/admin/tours')
}

export async function updateTour(id: string, formData: FormData) {
    await requireAdmin()
    try {
        await prisma.tour.update({ where: { id }, data: extractTourData(formData) })
    } catch (error) {
        throw new Error(`Failed to update tour: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    revalidatePath('/admin/tours')
    redirect('/admin/tours')
}

export async function deleteTour(id: string) {
    await requireAdmin()
    try {
        await prisma.tour.delete({ where: { id } })
    } catch (error) {
        throw new Error(`Failed to delete tour: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    revalidatePath('/admin/tours')
}
