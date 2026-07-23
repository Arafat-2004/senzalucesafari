'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { BlogPost } from '@/generated/prisma/client'
import { publishBlogPost, unpublishBlogPost } from '../../actions'
import { Card, CardContent } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { CalendarClock, ExternalLink, EyeOff, Loader2, Send } from 'lucide-react'

export function BlogPublishingCard({ post }: { post: BlogPost }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    function publish() {
        startTransition(async () => {
            try {
                await publishBlogPost(post.id)
                toast.success('Article published on the public blog')
                router.refresh()
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Unable to publish the article')
            }
        })
    }

    function unpublish() {
        startTransition(async () => {
            try {
                await unpublishBlogPost(post.id)
                toast.success('Article returned to draft')
                router.refresh()
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Unable to unpublish the article')
            }
        })
    }

    return (
        <Card className={post.isPublished ? 'border-[var(--tone-success-border)]' : 'border-[var(--tone-warning-border)]'}>
            <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3">
                    <div className={`rounded-full border p-2 ${post.isPublished ? 'admin-tone-success' : 'admin-tone-warning'}`}>
                        {post.isPublished ? <Send className="h-4 w-4" /> : <CalendarClock className="h-4 w-4" />}
                    </div>
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold">{post.isPublished ? 'This article is public' : 'This article is a draft'}</p>
                            <Badge variant={post.isPublished ? 'default' : 'outline'}>{post.isPublished ? 'Published' : 'Draft'}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {post.isPublished && post.publishedAt
                                ? `Published ${new Date(post.publishedAt).toLocaleString()}. Saving edits updates the live article.`
                                : 'Save and review the article before publishing it to customers.'}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                    {post.isPublished && (
                        <Link href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: 'outline' }))}>
                            <ExternalLink className="h-4 w-4" /> View live article
                        </Link>
                    )}
                    <Button type="button" variant={post.isPublished ? 'outline' : 'default'} onClick={post.isPublished ? unpublish : publish} disabled={isPending}>
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : post.isPublished ? <EyeOff className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                        {post.isPublished ? 'Return to draft' : 'Publish article'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
