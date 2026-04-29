'use server'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { logInquiryUpdate, logCmsAction } from '@/lib/reliability/cms-audit'
import { invalidateInquiries } from '@/lib/reliability/cache-manager'

export async function markAsRead(id: string) {
    const admin = await requireAdmin()
    try {
        const existing = await prisma.contactInquiry.findUnique({ where: { id } })
        const data = { isRead: true }
        
        await prisma.contactInquiry.update({ where: { id }, data })
        
        if (existing) {
            logInquiryUpdate(id, existing, data, admin.id)
        }
        invalidateInquiries()
    } catch (error) {
        throw new Error(`Failed to mark inquiry as read: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function markAsReplied(id: string) {
    const admin = await requireAdmin()
    try {
        const existing = await prisma.contactInquiry.findUnique({ where: { id } })
        const data = { isReplied: true, repliedAt: new Date() }
        
        await prisma.contactInquiry.update({
            where: { id },
            data,
        })
        
        if (existing) {
            logInquiryUpdate(id, existing, data, admin.id)
        }
        invalidateInquiries()
    } catch (error) {
        throw new Error(`Failed to mark inquiry as replied: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function updateInquiryNotes(id: string, formData: FormData) {
    const admin = await requireAdmin()
    try {
        const existing = await prisma.contactInquiry.findUnique({ where: { id } })
        const data = { internalNotes: (formData.get('internalNotes') as string) || null }
        
        await prisma.contactInquiry.update({
            where: { id },
            data,
        })
        
        if (existing) {
            logInquiryUpdate(id, existing, data, admin.id)
        }
        invalidateInquiries()
    } catch (error) {
        throw new Error(`Failed to update inquiry notes: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function deleteInquiry(id: string) {
    const admin = await requireAdmin()
    try {
        await prisma.contactInquiry.delete({ where: { id } })
        
        logCmsAction('inquiry', 'delete', { entityId: id, userId: admin.id })
        invalidateInquiries()
    } catch (error) {
        throw new Error(`Failed to delete inquiry: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}
