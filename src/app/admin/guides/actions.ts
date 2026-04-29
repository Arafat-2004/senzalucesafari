'use server'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { logCmsAction } from '@/lib/reliability/cms-audit'
import { invalidateCache } from '@/lib/reliability/cache-manager'

function splitLines(val: string | null): string[] {
    return (val ?? '').split('\n').map(s => s.trim()).filter(Boolean)
}

function extractData(f: FormData) {
    return {
        firstName: f.get('firstName') as string,
        lastName: f.get('lastName') as string,
        email: f.get('email') as string,
        phone: f.get('phone') as string,
        languages: splitLines(f.get('languages') as string),
        specialties: splitLines(f.get('specialties') as string),
        experience: parseInt(f.get('experience') as string) || 0,
        bio: (f.get('bio') as string) || null,
        certifications: splitLines(f.get('certifications') as string),
        licenseNumber: (f.get('licenseNumber') as string) || null,
        avatar: (f.get('avatar') as string) || null,
        isActive: f.get('isActive') === 'on',
    }
}

export async function createGuide(formData: FormData) {
    const admin = await requireAdmin()
    try {
        const data = extractData(formData)
        const guide = await prisma.guide.create({ data })
        
        logCmsAction('guide', 'create', { entityId: guide.id, newValue: data, userId: admin.id })
        invalidateCache('guides')
    } catch (error) {
        throw new Error(`Failed to create guide: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function updateGuide(id: string, formData: FormData) {
    const admin = await requireAdmin()
    try {
        const data = extractData(formData)
        const existing = await prisma.guide.findUnique({ where: { id } })
        
        await prisma.guide.update({ where: { id }, data })
        
        if (existing) {
            logCmsAction('guide', 'update', { entityId: id, previousValue: existing, newValue: data, userId: admin.id })
        }
        invalidateCache('guides')
    } catch (error) {
        throw new Error(`Failed to update guide: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function deleteGuide(id: string) {
    const admin = await requireAdmin()
    try {
        await prisma.guide.delete({ where: { id } })
        
        logCmsAction('guide', 'delete', { entityId: id, userId: admin.id })
        invalidateCache('guides')
    } catch (error) {
        throw new Error(`Failed to delete guide: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}