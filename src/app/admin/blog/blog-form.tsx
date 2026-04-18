'use client'

import { useState } from 'react'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { BlogPost } from '@/generated/prisma/client'
import { createBlogPost, updateBlogPost } from './actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ImageUpload } from '@/components/ui/image-upload'

export default function BlogForm({ post }: { post?: BlogPost }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const isEdit = Boolean(post)
    const [featuredImage, setFeaturedImage] = useState(post?.featuredImage ?? '')

    function handleSubmit(formData: FormData) {
        startTransition(async () => {
            if (post) {
                await updateBlogPost(post.id, formData)
            } else {
                await createBlogPost(formData)
            }
        })
    }

    return (
        <form action={handleSubmit}>
            <div className="space-y-6 max-w-3xl">
                <Card>
                    <CardHeader><CardTitle>{isEdit ? 'Edit Blog Post' : 'Create Blog Post'}</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" defaultValue={post?.title ?? ''} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input id="slug" name="slug" defaultValue={post?.slug ?? ''} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subtitle">Subtitle</Label>
                            <Input id="subtitle" name="subtitle" defaultValue={post?.subtitle ?? ''} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <select id="category" name="category" defaultValue={post?.category ?? ''} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" required>
                                    <option value="">Select...</option>
                                    {['Travel Tips', 'Wildlife', 'Destinations', 'Culture', 'Conservation', 'Photography', 'Accommodation', 'Food & Drink'].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="readingTime">Reading Time (min)</Label>
                                <Input id="readingTime" name="readingTime" type="number" min="1" defaultValue={post?.readingTime ?? 5} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="excerpt">Excerpt</Label>
                            <Textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt ?? ''} rows={2} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea id="content" name="content" defaultValue={post?.content ?? ''} rows={12} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="author">Author</Label>
                                <Input id="author" name="author" defaultValue={post?.author ?? ''} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="authorBio">Author Bio</Label>
                                <Input id="authorBio" name="authorBio" defaultValue={post?.authorBio ?? ''} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (one per line)</Label>
                            <Textarea id="tags" name="tags" defaultValue={post?.tags?.join('\n') ?? ''} rows={3} />
                        </div>
                        <div className="space-y-2">
                            <Label>Featured Image</Label>
                            <ImageUpload
                                value={featuredImage}
                                onChange={setFeaturedImage}
                                folder="blog"
                                label=""
                            />
                            <Input id="featuredImage" name="featuredImage" value={featuredImage} className="hidden" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="galleryImages">Gallery Images (one URL per line)</Label>
                            <Textarea id="galleryImages" name="galleryImages" defaultValue={post?.galleryImages?.join('\n') ?? ''} rows={3} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="metaTitle">Meta Title</Label>
                            <Input id="metaTitle" name="metaTitle" defaultValue={post?.metaTitle ?? ''} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="metaDescription">Meta Description</Label>
                            <Textarea id="metaDescription" name="metaDescription" defaultValue={post?.metaDescription ?? ''} rows={2} />
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="isPublished" name="isPublished" defaultChecked={post?.isPublished ?? false} />
                            <Label htmlFor="isPublished">Published</Label>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex gap-3">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/blog')}>Cancel</Button>
                </div>
            </div>
        </form>
    )
}
