'use server'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { logCmsAction } from '@/lib/reliability/cms-audit'
import { invalidateCache } from '@/lib/reliability/cache-manager'
import { z } from 'zod'
const accommodationSchema = z.object({name:z.string().trim().min(2).max(160),slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),type:z.string().min(2),tier:z.string().nullable(),location:z.string().min(2),description:z.string().min(20).max(10000),priceRange:z.string().nullable(),amenities:z.array(z.string()),images:z.array(z.string()).min(1,'Add at least one image.'),bestFor:z.array(z.string()),highlights:z.array(z.string()),rating:z.number().min(0).max(5),pricePerNight:z.string().min(1),currency:z.string().length(3),website:z.string().nullable(),email:z.string().nullable(),phone:z.string().nullable()})

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
    }
}

export async function createAccommodation(formData: FormData) {
    const admin = await requireAdmin('tours', 'CREATE')
    try {
        const data = accommodationSchema.parse(extractData(formData))
        const newAccommodation = await prisma.accommodation.create({ data: {...data,isActive:false} })
        
        logCmsAction('accommodation', 'create', { entityId: newAccommodation.id, newValue: data, userId: admin.id })
        // Use correct cache key for accommodations
        invalidateCache('accommodations')
    } catch (error) {
        throw new Error(`Failed to create accommodation: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function updateAccommodation(id: string, formData: FormData) {
    const admin = await requireAdmin('tours', 'EDIT')
    try {
        const data = accommodationSchema.parse(extractData(formData))
        const currentAcc = await prisma.accommodation.findUnique({ where: { id } })
        
        await prisma.accommodation.update({ where: { id }, data })
        
        if (currentAcc) {
            logCmsAction('accommodation', 'update', { entityId: id, previousValue: currentAcc, newValue: data, userId: admin.id })
        }
        invalidateCache('accommodations')
    } catch (error) {
        throw new Error(`Failed to update accommodation: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function setAccommodationActive(id:string,isActive:boolean){const admin=await requireAdmin('tours','EDIT');const existing=await prisma.accommodation.findUnique({where:{id}});if(!existing)throw new Error('Accommodation not found.');await prisma.accommodation.update({where:{id},data:{isActive}});logCmsAction('accommodation','update',{entityId:id,previousValue:existing,newValue:{isActive},userId:admin.id});invalidateCache('accommodations')}

export async function deleteAccommodation(id: string) {
    const admin = await requireAdmin('tours', 'DELETE')
    try {
        await prisma.accommodation.delete({ where: { id } })
        
        logCmsAction('accommodation', 'delete', { entityId: id, userId: admin.id })
        invalidateCache('accommodations')
    } catch (error) {
        throw new Error(`Failed to delete accommodation: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}
