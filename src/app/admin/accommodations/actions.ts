'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/admin-auth'

function splitLines(val: string | null): string[] {
    return (val ?? '').split('\n').map(s => s.trim()).filter(Boolean)
}

function extractData(f: FormData) {
    return {
        name: f.get('name') as string,
        slug: f.get('slug') as string,
        type: f.get('type') as string,
        tier: (f.get('tier') as string) || null,
        location: f.get('location') as string,
        description: f.get('description') as string,
        priceRange: (f.get('priceRange') as string) || null,
        amenities: splitLines(f.get('amenities') as string),
        images: splitLines(f.get('images') as string),
        bestFor: splitLines(f.get('bestFor') as string),
        highlights: splitLines(f.get('highlights') as string),
        rating: parseFloat(f.get('rating') as string) || 0,
        pricePerNight: f.get('pricePerNight') as string,
        currency: (f.get('currency') as string) || 'USD',
        website: (f.get('website') as string) || null,
        email: (f.get('email') as string) || null,
        phone: (f.get('phone') as string) || null,
        isActive: f.get('isActive') === 'on',
    }
}

export async function createAccommodation(formData: FormData) {
    await requireAdmin()
    try {
        await prisma.accommodation.create({ data: extractData(formData) })
    } catch (error) {
        throw new Error(`Failed to create accommodation: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    revalidatePath('/admin/accommodations')
    redirect('/admin/accommodations')
}

export async function updateAccommodation(id: string, formData: FormData) {
    await requireAdmin()
    try {
        await prisma.accommodation.update({ where: { id }, data: extractData(formData) })
    } catch (error) {
        throw new Error(`Failed to update accommodation: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    revalidatePath('/admin/accommodations')
    redirect('/admin/accommodations')
}

export async function deleteAccommodation(id: string) {
    await requireAdmin()
    try {
        await prisma.accommodation.delete({ where: { id } })
    } catch (error) {
        throw new Error(`Failed to delete accommodation: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    revalidatePath('/admin/accommodations')
}
