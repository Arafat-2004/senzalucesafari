'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/admin-auth'

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
    await requireAdmin()
    try {
        await prisma.fAQ.create({ data: extractData(formData) })
    } catch (error) {
        throw new Error(`Failed to create FAQ: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    revalidatePath('/admin/faqs')
    redirect('/admin/faqs')
}

export async function updateFAQ(id: string, formData: FormData) {
    await requireAdmin()
    try {
        await prisma.fAQ.update({ where: { id }, data: extractData(formData) })
    } catch (error) {
        throw new Error(`Failed to update FAQ: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    revalidatePath('/admin/faqs')
    redirect('/admin/faqs')
}

export async function deleteFAQ(id: string) {
    await requireAdmin()
    try {
        await prisma.fAQ.delete({ where: { id } })
    } catch (error) {
        throw new Error(`Failed to delete FAQ: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    revalidatePath('/admin/faqs')
}
