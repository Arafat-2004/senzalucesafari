import { prisma } from '@/lib/prisma'
import BlogClient from './blog-client'

export default async function BlogPage() {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
    return <BlogClient data={posts} />
}
