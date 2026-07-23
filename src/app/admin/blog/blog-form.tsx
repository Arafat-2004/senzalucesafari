'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { BlogPost } from '@/generated/prisma/client'
import { createBlogPost, updateBlogPost } from './actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ImageUpload } from '@/components/ui/image-upload'
import { TagInput } from '@/components/ui/tag-input'
import { GalleryManager } from '@/components/admin/gallery-manager'
import { toast } from 'sonner'
import { Loader2, Save, Search } from 'lucide-react'
import { useBeforeUnload } from '@/hooks/use-before-unload'

const categoryOptions = ['Travel Tips', 'Travel Planning', 'Wildlife', 'Wildlife & Photography', 'Wildlife & Conservation', 'Destinations', 'Culture', 'Culture & History', 'Conservation', 'Photography', 'Accommodation', 'Accommodation & Luxury', 'Food & Drink', 'Adventure & Trekking']
const tagSuggestions = ['Safari', 'Tanzania', 'Wildlife', 'Photography', 'Conservation', 'Culture', 'Adventure', 'Nature', 'Travel Guide']

function slugify(value: string) {
    return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export default function BlogForm({ post }: { post?: BlogPost }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const isEdit = Boolean(post)
    const [formError, setFormError] = useState<string | null>(null)
    const [isDirty, setIsDirty] = useState(false)
    const [title, setTitle] = useState(post?.title ?? '')
    const [slug, setSlug] = useState(post?.slug ?? '')
    const [slugEdited, setSlugEdited] = useState(Boolean(post))
    const [featuredImage, setFeaturedImage] = useState(post?.featuredImage ?? '')
    const [tags, setTags] = useState<string[]>(post?.tags ?? [])
    const [galleryImages, setGalleryImages] = useState<string[]>(post?.galleryImages ?? [])
    const [metaTitle, setMetaTitle] = useState(post?.metaTitle ?? '')
    const [metaDescription, setMetaDescription] = useState(post?.metaDescription ?? '')
    const [content, setContent] = useState(post?.content ?? '')
    useBeforeUnload(isDirty && !isPending)

    function handleTitleChange(value: string) {
        setTitle(value)
        if (!slugEdited) setSlug(slugify(value))
    }

    function handleSubmit(formData: FormData) {
        setFormError(null)
        startTransition(async () => {
            try {
                if (post) {
                    await updateBlogPost(post.id, formData)
                    setIsDirty(false)
                    toast.success(post.isPublished ? 'Published article updated' : 'Draft saved')
                    router.refresh()
                } else {
                    const created = await createBlogPost(formData)
                    setIsDirty(false)
                    toast.success('Draft created')
                    router.push(`/admin/blog/${created.id}/edit`)
                }
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unable to save the blog post'
                setFormError(message)
                toast.error(message)
            }
        })
    }

    return (
        <form action={handleSubmit} onChange={() => setIsDirty(true)} className="max-w-6xl space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">{isEdit ? 'Edit blog post' : 'Create blog post'}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Write and save safely as a draft. Publication is a separate editorial decision.</p>
                </div>
                <Badge variant={post?.isPublished ? 'default' : 'outline'} className="w-fit">{post?.isPublished ? 'Published' : 'Draft'}</Badge>
            </div>

            {formError && <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{formError}</div>}

            <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Article</CardTitle>
                            <CardDescription>Create a clear headline, useful summary, and well-structured story.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" value={title} onChange={event => handleTitleChange(event.target.value)} maxLength={160} required />
                                <p className="text-right text-xs text-muted-foreground">{title.length}/160</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subtitle">Subtitle <span className="font-normal text-muted-foreground">(optional)</span></Label>
                                <Input id="subtitle" name="subtitle" defaultValue={post?.subtitle ?? ''} maxLength={240} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="excerpt">Listing summary</Label>
                                <Textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt ?? ''} rows={3} maxLength={500} placeholder="A concise reason to read this article..." required />
                                <p className="text-xs text-muted-foreground">Displayed on blog cards and search results.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">Article content</Label>
                                <Textarea id="content" name="content" value={content} onChange={event => setContent(event.target.value)} rows={22} maxLength={50000} placeholder={'Opening introduction...\n\n## First section\n\nWrite the section content here.'} required className="min-h-[440px] font-serif leading-7" />
                                <div className="flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:justify-between">
                                    <span>Separate paragraphs with a blank line. Start headings with ## or ###.</span>
                                    <span>{content.length.toLocaleString()}/50,000</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Media</CardTitle>
                            <CardDescription>The featured image is required before publishing. Gallery images are optional.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Featured image</Label>
                                <ImageUpload value={featuredImage} onChange={value => { setFeaturedImage(value); setIsDirty(true) }} folder="blog" label="Main article image" />
                                <Input id="featuredImage" name="featuredImage" value={featuredImage} readOnly className="sr-only" tabIndex={-1} />
                            </div>
                            <GalleryManager value={galleryImages} onChange={value => { setGalleryImages(value); setIsDirty(true) }} maxImages={10} label="Gallery images" description="Optional supporting photography" name="galleryImages" />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6 xl:sticky xl:top-6 self-start">
                    <Card>
                        <CardHeader><CardTitle>Post settings</CardTitle></CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="slug">URL slug</Label>
                                <Input id="slug" name="slug" value={slug} onChange={event => { setSlugEdited(true); setSlug(slugify(event.target.value)) }} required />
                                <p className="break-all text-xs text-muted-foreground">/blog/{slug || 'your-post-url'}</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <select id="category" name="category" defaultValue={post?.category ?? ''} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                                    <option value="" disabled>Select a category</option>
                                    {post?.category && !categoryOptions.includes(post.category) && <option value={post.category}>{post.category}</option>}
                                    {categoryOptions.map(category => <option key={category} value={category}>{category}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="readingTime">Reading time</Label>
                                <div className="relative"><Input id="readingTime" name="readingTime" type="number" min="1" max="120" defaultValue={post?.readingTime ?? 5} className="pr-16" required /><span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">minutes</span></div>
                            </div>
                            <TagInput value={tags} onChange={value => { setTags(value); setIsDirty(true) }} label="Tags" description="Up to 15 discovery keywords" suggestions={tagSuggestions} maxTags={15} name="tags" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Author</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2"><Label htmlFor="author">Author name</Label><Input id="author" name="author" defaultValue={post?.author ?? ''} maxLength={100} required /></div>
                            <div className="space-y-2"><Label htmlFor="authorBio">Short bio <span className="font-normal text-muted-foreground">(optional)</span></Label><Textarea id="authorBio" name="authorBio" defaultValue={post?.authorBio ?? ''} rows={4} maxLength={500} /></div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Search className="h-4 w-4" /> Search preview</CardTitle><CardDescription>Optional SEO text. Sensible defaults come from the title and summary.</CardDescription></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2"><Label htmlFor="metaTitle">SEO title</Label><Input id="metaTitle" name="metaTitle" value={metaTitle} onChange={event => setMetaTitle(event.target.value)} maxLength={70} /><p className="text-right text-xs text-muted-foreground">{metaTitle.length}/70</p></div>
                            <div className="space-y-2"><Label htmlFor="metaDescription">SEO description</Label><Textarea id="metaDescription" name="metaDescription" value={metaDescription} onChange={event => setMetaDescription(event.target.value)} rows={4} maxLength={170} /><p className="text-right text-xs text-muted-foreground">{metaDescription.length}/170</p></div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={() => router.push('/admin/blog')} className="min-h-11">Cancel</Button>
                <Button type="submit" disabled={isPending} className="min-h-11 sm:min-w-40">
                    {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> {isEdit ? 'Save changes' : 'Save draft'}</>}
                </Button>
            </div>
        </form>
    )
}
