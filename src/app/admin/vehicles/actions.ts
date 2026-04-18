'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/admin-auth'

function splitLines(val: string | null): string[] {
    return (val ?? '').split('\n').map(s => s.trim()).filter(Boolean)
}

function safeJsonParse(val: string, fallback: unknown = {}) {
    try { return JSON.parse(val) } catch { return fallback }
}

function extractData(f: FormData) {
    return {
        name: f.get('name') as string,
        category: f.get('category') as string,
        imageUrl: f.get('imageUrl') as string,
        capacity: f.get('capacity') as string,
        rating: parseFloat(f.get('rating') as string) || 0,
        reviews: parseInt(f.get('reviews') as string) || 0,
        priceRange: f.get('priceRange') as string,
        description: f.get('description') as string,
        features: splitLines(f.get('features') as string),
        bestFor: splitLines(f.get('bestFor') as string),
        specifications: safeJsonParse((f.get('specifications') as string) || '{}', {}),
        safetyFeatures: splitLines(f.get('safetyFeatures') as string),
        safariEquipment: splitLines(f.get('safariEquipment') as string),
        interiorImages: splitLines(f.get('interiorImages') as string),
        exteriorImages: splitLines(f.get('exteriorImages') as string),
        actionShots: splitLines(f.get('actionShots') as string),
        images: splitLines(f.get('images') as string),
        engine: (f.get('engine') as string) || null,
        transmission: (f.get('transmission') as string) || null,
        fuelType: (f.get('fuelType') as string) || null,
        year: parseInt(f.get('year') as string) || null,
        isActive: f.get('isActive') === 'on',
    }
}

export async function createVehicle(formData: FormData) {
    await requireAdmin()
    try {
        await prisma.vehicle.create({ data: extractData(formData) })
    } catch (error) {
        throw new Error(`Failed to create vehicle: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    revalidatePath('/admin/vehicles')
    redirect('/admin/vehicles')
}

export async function updateVehicle(id: string, formData: FormData) {
    await requireAdmin()
    try {
        await prisma.vehicle.update({ where: { id }, data: extractData(formData) })
    } catch (error) {
        throw new Error(`Failed to update vehicle: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    revalidatePath('/admin/vehicles')
    redirect('/admin/vehicles')
}

export async function deleteVehicle(id: string) {
    await requireAdmin()
    try {
        await prisma.vehicle.delete({ where: { id } })
    } catch (error) {
        throw new Error(`Failed to delete vehicle: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    revalidatePath('/admin/vehicles')
}
