'use server'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { logCmsAction } from '@/lib/reliability/cms-audit'
import { invalidateCache } from '@/lib/reliability/cache-manager'
import { z } from 'zod'

function splitLines(val: string | null): string[] {
    return (val ?? '').split('\n').map(s => s.trim()).filter(Boolean)
}

const guideSchema = z.object({
    firstName: z.string().trim().min(2).max(80),
    lastName: z.string().trim().min(2).max(80),
    email: z.string().trim().email('Enter a valid email address.').max(254),
    phone: z.string().trim().min(7, 'Enter a valid phone number.').max(40),
    languages: z.array(z.string().min(1).max(60)).min(1, 'Add at least one language.').max(20),
    specialties: z.array(z.string().min(1).max(100)).max(20),
    experience: z.coerce.number().int().min(0).max(70),
    bio: z.string().trim().max(3000),
    certifications: z.array(z.string().min(1).max(160)).max(30),
    licenseNumber: z.string().trim().max(100),
    avatar: z.string().trim().max(2000),
})

function extractData(f: FormData) {
    const parsed = guideSchema.parse({ firstName: f.get('firstName'), lastName: f.get('lastName'), email: f.get('email'), phone: f.get('phone'), languages: splitLines(f.get('languages') as string), specialties: splitLines(f.get('specialties') as string), experience: f.get('experience'), bio: f.get('bio') ?? '', certifications: splitLines(f.get('certifications') as string), licenseNumber: f.get('licenseNumber') ?? '', avatar: f.get('avatar') ?? '' })
    return { ...parsed, bio: parsed.bio || null, licenseNumber: parsed.licenseNumber || null, avatar: parsed.avatar || null }
}

export async function createGuide(formData: FormData) {
    const admin = await requireAdmin('tours', 'CREATE')
    try {
        const data = extractData(formData)
        const guide = await prisma.guide.create({ data: { ...data, isActive: false } })
        
        logCmsAction('guide', 'create', { entityId: guide.id, newValue: { ...data, isActive: false }, userId: admin.id })
        invalidateCache('guides')
        return { id: guide.id }
    } catch (error) {
        throw new Error(`Failed to create guide: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function updateGuide(id: string, formData: FormData) {
    const admin = await requireAdmin('tours', 'EDIT')
    try {
        const data = extractData(formData)
        const existing = await prisma.guide.findUnique({ where: { id } })
        if (!existing) throw new Error('Guide not found.')
        await prisma.guide.update({ where: { id }, data })
        logCmsAction('guide', 'update', { entityId: id, previousValue: existing, newValue: data, userId: admin.id })
        invalidateCache('guides')
        return { id }
    } catch (error) {
        throw new Error(`Failed to update guide: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function setGuideActive(id: string, isActive: boolean) {
    const admin = await requireAdmin('tours', 'EDIT')
    const existing = await prisma.guide.findUnique({ where: { id } })
    if (!existing) throw new Error('Guide not found.')
    if (isActive && existing.languages.length === 0) throw new Error('Add at least one language before making this guide available.')
    await prisma.guide.update({ where: { id }, data: { isActive } })
    logCmsAction('guide', 'update', { entityId: id, previousValue: existing, newValue: { isActive }, userId: admin.id })
    invalidateCache('guides')
}

export async function deleteGuide(id: string) {
    const admin = await requireAdmin('tours', 'DELETE')
    try {
        const existing = await prisma.guide.findUnique({ where: { id } })
        if (!existing) throw new Error('Guide not found.')
        await prisma.guide.delete({ where: { id } })
        logCmsAction('guide', 'delete', { entityId: id, previousValue: existing, userId: admin.id })
        invalidateCache('guides')
    } catch (error) {
        throw new Error(`Failed to delete guide: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}
