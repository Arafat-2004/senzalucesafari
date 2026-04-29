'use server'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { logCmsAction } from '@/lib/reliability/cms-audit'
import { invalidateCache } from '@/lib/reliability/cache-manager'

function extractData(f: FormData) {
    return {
        question: f.get('question') as string,
        answer: f.get('answer') as string,
        category: f.get('category') as string,
        displayOrder: parseInt(f.get('displayOrder') as string) || 0,
        isActive: f.get('isActive') === 'on',
    }
}

export async function createFAQ(formData: FormData) {
    const admin = await requireAdmin()
    try {
        const data = extractData(formData)
        const faq = await prisma.fAQ.create({ data })
        
        logCmsAction('faq', 'create', { entityId: faq.id, newValue: data, userId: admin.id })
        invalidateCache('faqs')
    } catch (error) {
        throw new Error(`Failed to create FAQ: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function updateFAQ(id: string, formData: FormData) {
    const admin = await requireAdmin()
    try {
        const data = extractData(formData)
        const existing = await prisma.fAQ.findUnique({ where: { id } })
        
        await prisma.fAQ.update({ where: { id }, data })
        
        if (existing) {
            logCmsAction('faq', 'update', { entityId: id, previousValue: existing, newValue: data, userId: admin.id })
        }
        invalidateCache('faqs')
    } catch (error) {
        throw new Error(`Failed to update FAQ: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function deleteFAQ(id: string) {
    const admin = await requireAdmin()
    try {
        await prisma.fAQ.delete({ where: { id } })
        
        logCmsAction('faq', 'delete', { entityId: id, userId: admin.id })
        invalidateCache('faqs')
    } catch (error) {
        throw new Error(`Failed to delete FAQ: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}