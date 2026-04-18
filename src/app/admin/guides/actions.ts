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
    await requireAdmin()
    try {
        await prisma.guide.create({ data: extractData(formData) })
    } catch (error) {
        throw new Error(`Failed to create guide: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    revalidatePath('/admin/guides')
    redirect('/admin/guides')
}

export async function updateGuide(id: string, formData: FormData) {
    await requireAdmin()
    try {
        await prisma.guide.update({ where: { id }, data: extractData(formData) })
    } catch (error) {
        throw new Error(`Failed to update guide: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    revalidatePath('/admin/guides')
    redirect('/admin/guides')
}

export async function deleteGuide(id: string) {
    await requireAdmin()
    try {
        await prisma.guide.delete({ where: { id } })
    } catch (error) {
        throw new Error(`Failed to delete guide: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    revalidatePath('/admin/guides')
}
