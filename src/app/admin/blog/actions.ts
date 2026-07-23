'use server'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { logBlogCreate, logBlogUpdate, logCmsAction } from '@/lib/reliability/cms-audit'
import { invalidateBlog } from '@/lib/reliability/cache-manager'
import { contentToBlogSections } from '@/lib/blog-content'
import { z } from 'zod'
import type { Prisma } from '@/generated/prisma/client'

const blogFormSchema = z.object({
  title: z.string().trim().min(5, 'Title must contain at least 5 characters.').max(160),
  slug: z.string().trim().min(3).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase words separated by hyphens for the URL.'),
  subtitle: z.string().trim().max(240),
  excerpt: z.string().trim().min(20, 'Add a useful summary of at least 20 characters.').max(500),
  content: z.string().trim().min(20, 'Add the article content before saving.').max(50_000),
  category: z.string().trim().min(2, 'Choose a category.').max(100),
  tags: z.array(z.string().trim().min(1).max(50)).max(15),
  author: z.string().trim().min(2, 'Author name is required.').max(100),
  authorBio: z.string().trim().max(500),
  featuredImage: z.string().trim().max(2_000),
  galleryImages: z.array(z.string().max(2_000)).max(10),
  metaTitle: z.string().trim().max(70),
  metaDescription: z.string().trim().max(170),
  readingTime: z.coerce.number().int().min(1).max(120),
})

function parseStringArray(value: FormDataEntryValue | null): string[] {
  if (typeof value !== 'string' || !value) return []
  try {
    const parsed: unknown = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

function extractData(formData: FormData) {
  const parsed = blogFormSchema.parse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    subtitle: formData.get('subtitle') ?? '',
    excerpt: formData.get('excerpt'),
    content: formData.get('content'),
    category: formData.get('category'),
    tags: parseStringArray(formData.get('tags')),
    author: formData.get('author'),
    authorBio: formData.get('authorBio') ?? '',
    featuredImage: formData.get('featuredImage') ?? '',
    galleryImages: parseStringArray(formData.get('galleryImages')),
    metaTitle: formData.get('metaTitle') ?? '',
    metaDescription: formData.get('metaDescription') ?? '',
    readingTime: formData.get('readingTime'),
  })

  return {
    ...parsed,
    subtitle: parsed.subtitle || null,
    authorBio: parsed.authorBio || null,
    metaTitle: parsed.metaTitle || null,
    metaDescription: parsed.metaDescription || null,
    sections: contentToBlogSections(parsed.content) as unknown as Prisma.InputJsonValue,
  }
}

function mutationError(action: string, error: unknown): Error {
  const message = error instanceof Error ? error.message : String(error)
  if (message.includes('Unique constraint') || message.includes('P2002')) {
    return new Error('That URL slug is already used by another post.')
  }
  return new Error(`Unable to ${action} the blog post. ${message}`)
}

export async function createBlogPost(formData: FormData) {
  const admin = await requireAdmin('tours', 'CREATE')
  try {
    const data = extractData(formData)
    const post = await prisma.blogPost.create({
      data: { ...data, isPublished: false, publishedAt: null },
    })

    logBlogCreate(post.id, { ...data, isPublished: false }, admin.id)
    invalidateBlog()
    return { id: post.id }
  } catch (error) {
    throw mutationError('save', error)
  }
}

export async function updateBlogPost(id: string, formData: FormData) {
  const admin = await requireAdmin('tours', 'EDIT')
  try {
    const data = extractData(formData)
    const existing = await prisma.blogPost.findUnique({ where: { id } })
    if (!existing) throw new Error('Blog post not found.')

    await prisma.blogPost.update({ where: { id }, data })
    logBlogUpdate(id, existing, data, admin.id)
    invalidateBlog()
    return { id }
  } catch (error) {
    throw mutationError('update', error)
  }
}

export async function publishBlogPost(id: string) {
  const admin = await requireAdmin('tours', 'EDIT')
  const existing = await prisma.blogPost.findUnique({ where: { id } })
  if (!existing) throw new Error('Blog post not found.')
  if (!existing.featuredImage) throw new Error('Add a featured image before publishing.')
  if (!existing.content || existing.content.trim().length < 20) throw new Error('Complete the article before publishing.')

  const publishedAt = existing.publishedAt ?? new Date()
  await prisma.blogPost.update({
    where: { id },
    data: { isPublished: true, publishedAt },
  })
  logCmsAction('blog', 'update', { entityId: id, previousValue: existing, newValue: { isPublished: true, publishedAt }, userId: admin.id })
  invalidateBlog()
}

export async function unpublishBlogPost(id: string) {
  const admin = await requireAdmin('tours', 'EDIT')
  const existing = await prisma.blogPost.findUnique({ where: { id } })
  if (!existing) throw new Error('Blog post not found.')

  await prisma.blogPost.update({
    where: { id },
    data: { isPublished: false, publishedAt: null },
  })
  logCmsAction('blog', 'update', { entityId: id, previousValue: existing, newValue: { isPublished: false, publishedAt: null }, userId: admin.id })
  invalidateBlog()
}

export async function deleteBlogPost(id: string) {
  const admin = await requireAdmin('tours', 'DELETE')
  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } })
    if (!existing) throw new Error('Blog post not found.')
    await prisma.blogPost.delete({ where: { id } })
    logCmsAction('blog', 'delete', { entityId: id, previousValue: existing, userId: admin.id })
    invalidateBlog()
  } catch (error) {
    throw mutationError('delete', error)
  }
}
