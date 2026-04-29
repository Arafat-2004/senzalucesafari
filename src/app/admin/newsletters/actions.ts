'use server'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { logCmsAction } from '@/lib/reliability/cms-audit'
import { invalidateCache } from '@/lib/reliability/cache-manager'

export async function toggleNewsletterActive(id: string, currentlyActive: boolean) {
    const admin = await requireAdmin()
    try {
        const data = {
            isActive: !currentlyActive,
            unsubscribedAt: currentlyActive ? new Date() : null,
        }
        
        const existing = await prisma.newsletter.findUnique({ where: { id } })
        await prisma.newsletter.update({
            where: { id },
            data,
        })
        
        if (existing) {
            logCmsAction('settings', 'update', { entityId: id, previousValue: existing, newValue: data, userId: admin.id })
        }
        invalidateCache('newsletters')
    } catch (error) {
        throw new Error(`Failed to toggle newsletter status: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function deleteNewsletter(id: string) {
    const admin = await requireAdmin()
    try {
        await prisma.newsletter.delete({ where: { id } })
        
        logCmsAction('settings', 'delete', { entityId: id, userId: admin.id })
        invalidateCache('newsletters')
    } catch (error) {
        throw new Error(`Failed to delete newsletter subscriber: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}
