'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/admin-auth'

export async function markAsRead(id: string) {
    await requireAdmin()
    try {
        await prisma.contactInquiry.update({ where: { id }, data: { isRead: true } })
        revalidatePath('/admin/inquiries')
        revalidatePath(`/admin/inquiries/${id}/edit`)
    } catch (error) {
        throw new Error(`Failed to mark inquiry as read: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function markAsReplied(id: string) {
    await requireAdmin()
    try {
        await prisma.contactInquiry.update({
            where: { id },
            data: { isReplied: true, repliedAt: new Date() },
        })
        revalidatePath('/admin/inquiries')
        revalidatePath(`/admin/inquiries/${id}/edit`)
    } catch (error) {
        throw new Error(`Failed to mark inquiry as replied: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function updateInquiryNotes(id: string, formData: FormData) {
    await requireAdmin()
    try {
        await prisma.contactInquiry.update({
            where: { id },
            data: { internalNotes: (formData.get('internalNotes') as string) || null },
        })
        revalidatePath('/admin/inquiries')
        revalidatePath(`/admin/inquiries/${id}/edit`)
    } catch (error) {
        throw new Error(`Failed to update inquiry notes: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function deleteInquiry(id: string) {
    await requireAdmin()
    try {
        await prisma.contactInquiry.delete({ where: { id } })
    } catch (error) {
        throw new Error(`Failed to delete inquiry: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    revalidatePath('/admin/inquiries')
}
