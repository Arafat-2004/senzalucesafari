'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/admin-auth'

export async function upsertSetting(formData: FormData) {
    await requireAdmin()
    const key = formData.get('key') as string
    const value = formData.get('value') as string
    const description = (formData.get('description') as string) || null

    try {
        await prisma.siteSettings.upsert({
            where: { key },
            create: { key, value, description },
            update: { value, description },
        })
    } catch (error) {
        throw new Error(`Failed to save setting: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    revalidatePath('/admin/settings')
    redirect('/admin/settings')
}

export async function updateSetting(id: string, formData: FormData) {
    await requireAdmin()
    try {
        await prisma.siteSettings.update({
            where: { id },
            data: {
                key: formData.get('key') as string,
                value: formData.get('value') as string,
                description: (formData.get('description') as string) || null,
            },
        })
    } catch (error) {
        throw new Error(`Failed to update setting: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    revalidatePath('/admin/settings')
    redirect('/admin/settings')
}

export async function deleteSetting(id: string) {
    await requireAdmin()
    try {
        await prisma.siteSettings.delete({ where: { id } })
    } catch (error) {
        throw new Error(`Failed to delete setting: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    revalidatePath('/admin/settings')
}
