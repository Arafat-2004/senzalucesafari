'use server'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { logCmsAction } from '@/lib/reliability/cms-audit'
import { invalidateCache } from '@/lib/reliability/cache-manager'

export async function setNewsletterActive(id: string, isActive: boolean) {
    const admin = await requireAdmin('tours', 'EDIT')
    try {
        const existing = await prisma.newsletter.findUnique({ where: { id } })
        if (!existing) throw new Error('Subscriber not found.')
        const data = {
            isActive,
            unsubscribedAt: isActive ? null : new Date(),
        }
        await prisma.newsletter.update({
            where: { id },
            data,
        })
        
        logCmsAction('newsletter', 'update', { entityId: id, previousValue: existing, newValue: data, userId: admin.id })
        invalidateCache('newsletters')
    } catch (error) {
        throw new Error(`Unable to update the subscription. ${error instanceof Error ? error.message : 'Please try again.'}`)
    }
}

export async function deleteNewsletter(id: string) {
    const admin = await requireAdmin('tours', 'DELETE')
    try {
        const existing = await prisma.newsletter.findUnique({ where: { id } })
        if (!existing) throw new Error('Subscriber not found.')
        await prisma.newsletter.delete({ where: { id } })
        logCmsAction('newsletter', 'delete', { entityId: id, previousValue: existing, userId: admin.id })
        invalidateCache('newsletters')
    } catch (error) {
        throw new Error(`Failed to delete newsletter subscriber: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}
