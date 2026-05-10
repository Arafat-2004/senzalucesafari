import { requireAdmin } from "@/lib/admin-auth"
import { prisma } from '@/lib/prisma'
import BlogClient from './blog-client'

export const revalidate = 60

export default async function BlogPage() {
    await requireAdmin();
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' }, take: 50 })
    const data = posts.map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        category: p.category,
        author: p.author,
        readingTime: p.readingTime,
        isPublished: p.isPublished,
        views: p.views,
    }))
    return <BlogClient data={data} />
}
