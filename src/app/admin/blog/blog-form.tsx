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
import { TagInput } from '@/components/ui/tag-input'
import { GalleryManager } from '@/components/admin/gallery-manager'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { useBeforeUnload } from '@/hooks/use-before-unload'

const categoryOptions = [
    'Travel Tips',
    'Wildlife',
    'Destinations',
    'Culture',
    'Conservation',
    'Photography',
    'Accommodation',
    'Food & Drink'
]

const tagSuggestions = [
    'Safari',
    ' Tanzania',
    'Wildlife',
    'Photography',
    'Conservation',
    'Culture',
    'Adventure',
    'Nature',
    'Photography',
    'Travel Guide'
]

export default function BlogForm({ post }: { post?: BlogPost }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const isEdit = Boolean(post)
    const { toast } = useToast()
    const [formError, setFormError] = useState<string | null>(null)
    const [isDirty, setIsDirty] = useState(false)
    const [featuredImage, setFeaturedImage] = useState(post?.featuredImage ?? '')
    
    const [tags, setTags] = useState<string[]>(post?.tags ?? [])
    const [galleryImages, setGalleryImages] = useState<string[]>(post?.galleryImages ?? [])
    useBeforeUnload(isDirty && !isPending)

    function handleSubmit(formData: FormData) {
        setFormError(null)
        startTransition(async () => {
            try {
                if (post) {
                    await updateBlogPost(post.id, formData)
                    toast({ title: 'Blog post updated successfully', variant: 'default' })
                } else {
                    await createBlogPost(formData)
                    toast({ title: 'Blog post created successfully', variant: 'default' })
                }
                router.push('/admin/blog')
            } catch (error) {
                const message = error instanceof Error ? error.message : 'An error occurred'
                setFormError(message)
                toast({ title: message, variant: 'destructive' })
            }
        })
    }

    return (
        <form action={handleSubmit} onChange={() => setIsDirty(true)}>
            <div className="space-y-6 max-w-3xl">
                {formError && (
                    <div className="mb-4 p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-sm">
                        {formError}
                    </div>
                )}
                <Card>
                    <CardHeader><CardTitle>{isEdit ? 'Edit Blog Post' : 'Create Blog Post'}</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" name="title" defaultValue={post?.title ?? ''} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">URL Slug</Label>
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
                                    <select id="category" name="category" defaultValue={post?.category ?? ''} className="flex h-9 w-full rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm" required>
                                        <option value="">Select category...</option>
                                        {categoryOptions.map(c => (
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
                                <Textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt ?? ''} rows={2} placeholder="Brief summary for previews..." required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">Content</Label>
                                <Textarea id="content" name="content" defaultValue={post?.content ?? ''} rows={15} placeholder="Write your blog post content..." required />
                            </div>
                        </div>

                        {/* Author */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Author</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="author">Author Name</Label>
                                    <Input id="author" name="author" defaultValue={post?.author ?? ''} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="authorBio">Author Bio</Label>
                                    <Input id="authorBio" name="authorBio" defaultValue={post?.authorBio ?? ''} />
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Tags & Categories</h3>
                            <TagInput
                                value={tags}
                                onChange={setTags}
                                label="Tags"
                                description="Related keywords"
                                suggestions={tagSuggestions}
                                maxTags={15}
                                name="tags"
                            />
                        </div>

                        {/* Images */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Images</h3>
                            <div className="space-y-2">
                                <Label>Featured Image</Label>
                                <ImageUpload
                                    value={featuredImage}
                                    onChange={setFeaturedImage}
                                    folder="blog"
                                    label="Main blog image"
                                />
                                <Input id="featuredImage" name="featuredImage" value={featuredImage} className="hidden" />
                            </div>
                            <GalleryManager
                                value={galleryImages}
                                onChange={setGalleryImages}
                                maxImages={10}
                                label="Gallery Images"
                                description="Additional images for the post"
                                name="galleryImages"
                            />
                        </div>

                        {/* SEO */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">SEO</h3>
                            <div className="space-y-2">
                                <Label htmlFor="metaTitle">Meta Title</Label>
                                <Input id="metaTitle" name="metaTitle" defaultValue={post?.metaTitle ?? ''} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="metaDescription">Meta Description</Label>
                                <Textarea id="metaDescription" name="metaDescription" defaultValue={post?.metaDescription ?? ''} rows={2} />
                            </div>
                        </div>

                        {/* Status */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Publishing</h3>
                            <div className="flex items-center gap-2">
                                <Checkbox id="isPublished" name="isPublished" defaultChecked={post?.isPublished ?? false} />
                                <Label htmlFor="isPublished">Published</Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button type="submit" disabled={isPending} className="min-h-[44px]">
                        {isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : isEdit ? 'Update Post' : 'Create Post'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/blog')} className="min-h-[44px]">Cancel</Button>
                </div>
            </div>
        </form>
    )
}
