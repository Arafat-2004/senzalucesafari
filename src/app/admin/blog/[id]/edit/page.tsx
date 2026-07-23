import { requireAdmin } from "@/lib/admin-auth"
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BlogForm from '../../blog-form'
import { BlogPublishingCard } from './blog-publishing-card'

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    await requireAdmin('tours', 'EDIT');
    const post = await prisma.blogPost.findUnique({ where: { id } })
    if (!post) notFound()
    return (
        <div className="space-y-6">
            <BlogPublishingCard post={post} />
            <BlogForm post={post} />
        </div>
    )
}
