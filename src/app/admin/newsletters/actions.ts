'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/admin-auth'

export async function toggleNewsletterActive(id: string, currentlyActive: boolean) {
    await requireAdmin()
    try {
        await prisma.newsletter.update({
            where: { id },
            data: {
                isActive: !currentlyActive,
                unsubscribedAt: currentlyActive ? new Date() : null,
            },
        })
    } catch (error) {
        throw new Error(`Failed to toggle newsletter status: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    revalidatePath('/admin/newsletters')
}

export async function deleteNewsletter(id: string) {
    await requireAdmin()
    try {
        await prisma.newsletter.delete({ where: { id } })
    } catch (error) {
        throw new Error(`Failed to delete newsletter subscriber: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    revalidatePath('/admin/newsletters')
}
