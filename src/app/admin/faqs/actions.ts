'use server'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { logCmsAction } from '@/lib/reliability/cms-audit'
import { invalidateCache } from '@/lib/reliability/cache-manager'
import { z } from 'zod'

const faqSchema = z.object({
    question: z.string().trim().min(10, 'Write a complete customer question.').max(240),
    answer: z.string().trim().min(20, 'Provide a helpful answer of at least 20 characters.').max(5000),
    category: z.string().trim().min(2, 'Choose a category.').max(80),
    displayOrder: z.coerce.number().int().min(0).max(9999),
})

function extractData(f: FormData) {
    return faqSchema.parse({
        question: f.get('question'),
        answer: f.get('answer'),
        category: f.get('category'),
        displayOrder: f.get('displayOrder') || 0,
    })
}

export async function createFAQ(formData: FormData) {
    const admin = await requireAdmin('tours', 'CREATE')
    try {
        const data = extractData(formData)
        const faq = await prisma.fAQ.create({ data: { ...data, isActive: false } })
        
        logCmsAction('faq', 'create', { entityId: faq.id, newValue: { ...data, isActive: false }, userId: admin.id })
        invalidateCache('faqs')
        return { id: faq.id }
    } catch (error) {
        throw new Error(`Failed to create FAQ: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function updateFAQ(id: string, formData: FormData) {
    const admin = await requireAdmin('tours', 'EDIT')
    try {
        const data = extractData(formData)
        const existing = await prisma.fAQ.findUnique({ where: { id } })
        if (!existing) throw new Error('FAQ not found.')
        await prisma.fAQ.update({ where: { id }, data })
        logCmsAction('faq', 'update', { entityId: id, previousValue: existing, newValue: data, userId: admin.id })
        invalidateCache('faqs')
        return { id }
    } catch (error) {
        throw new Error(`Failed to update FAQ: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function setFAQActive(id: string, isActive: boolean) {
    const admin = await requireAdmin('tours', 'EDIT')
    const existing = await prisma.fAQ.findUnique({ where: { id } })
    if (!existing) throw new Error('FAQ not found.')
    if (isActive && (existing.question.trim().length < 10 || existing.answer.trim().length < 20)) {
        throw new Error('Complete the question and answer before publishing.')
    }
    await prisma.fAQ.update({ where: { id }, data: { isActive } })
    logCmsAction('faq', 'update', { entityId: id, previousValue: existing, newValue: { isActive }, userId: admin.id })
    invalidateCache('faqs')
}

export async function deleteFAQ(id: string) {
    const admin = await requireAdmin('tours', 'DELETE')
    try {
        const existing = await prisma.fAQ.findUnique({ where: { id } })
        if (!existing) throw new Error('FAQ not found.')
        await prisma.fAQ.delete({ where: { id } })
        logCmsAction('faq', 'delete', { entityId: id, previousValue: existing, userId: admin.id })
        invalidateCache('faqs')
    } catch (error) {
        throw new Error(`Failed to delete FAQ: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}
