'use server'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { logBlogCreate, logBlogUpdate, logCmsAction } from '@/lib/reliability/cms-audit'
import { invalidateBlog } from '@/lib/reliability/cache-manager'

function safeJsonParse(val: string, fallback: unknown = []) {
    try { return JSON.parse(val) } catch { return fallback }
}

function extractData(f: FormData) {
    const isPublished = f.get('isPublished') === 'on'
    const tagsStr = f.get('tags') as string
    const galleryImagesStr = f.get('galleryImages') as string

    return {
        title: f.get('title') as string,
        slug: f.get('slug') as string,
        subtitle: (f.get('subtitle') as string) || null,
        excerpt: f.get('excerpt') as string,
        content: f.get('content') as string,
        sections: (() => { try { const v = f.get('sections') as string; return v ? JSON.parse(v) : null } catch { return null } })(),
        relatedPosts: (() => { try { const v = f.get('relatedPosts') as string; return v ? JSON.parse(v) : null } catch { return null } })(),
        category: f.get('category') as string,
        tags: safeJsonParse(tagsStr, []),
        author: f.get('author') as string,
        authorBio: (f.get('authorBio') as string) || null,
        featuredImage: f.get('featuredImage') as string,
        galleryImages: safeJsonParse(galleryImagesStr, []),
        metaTitle: (f.get('metaTitle') as string) || null,
        metaDescription: (f.get('metaDescription') as string) || null,
        readingTime: parseInt(f.get('readingTime') as string) || 5,
        isPublished,
        publishedAt: isPublished ? new Date() : null,
    }
}

export async function createBlogPost(formData: FormData) {
    const admin = await requireAdmin()
    try {
        const slug = formData.get('slug') as string
        const data = extractData(formData)
        const newPost = await prisma.blogPost.create({ data })
        
        logBlogCreate(newPost.id, data, admin.id)
        invalidateBlog()
    } catch (error) {
        throw new Error(`Failed to create blog post: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function updateBlogPost(id: string, formData: FormData) {
    const admin = await requireAdmin()
    try {
        const data = extractData(formData)
        const slug = formData.get('slug') as string
        const existing = await prisma.blogPost.findUnique({ where: { id } })
        
        if (data.isPublished && existing?.publishedAt) {
            data.publishedAt = existing.publishedAt
        }
        
        await prisma.blogPost.update({ where: { id }, data })
        
        if (existing) {
            logBlogUpdate(id, existing, data, admin.id)
        }
        invalidateBlog()
    } catch (error) {
        throw new Error(`Failed to update blog post: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function deleteBlogPost(id: string) {
    const admin = await requireAdmin()
    try {
        const post = await prisma.blogPost.findUnique({ where: { id }, select: { slug: true } })
        await prisma.blogPost.delete({ where: { id } })
        
        logCmsAction('blog', 'delete', { entityId: id, userId: admin.id })
        invalidateBlog()
    } catch (error) {
        throw new Error(`Failed to delete blog post: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}