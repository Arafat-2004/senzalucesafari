'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Review } from '@/generated/prisma/client'
import { createReview, updateReview } from './actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

function formatDate(d: Date | null | undefined): string {
    if (!d) return ''
    return new Date(d).toISOString().split('T')[0]
}

export default function ReviewForm({ review }: { review?: Review }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const { toast } = useToast()
    const isEdit = Boolean(review)

    function handleSubmit(formData: FormData) {
        startTransition(async () => {
            try {
                if (review) {
                    await updateReview(review.id, formData)
                } else {
                    await createReview(formData)
                }
                router.refresh()
                toast({ title: 'Success', description: isEdit ? 'Review updated' : 'Review created', variant: 'default' })
            } catch (error) {
                toast({ title: 'Error', description: 'Operation failed', variant: 'destructive' })
            }
        })
    }

    return (
        <form action={handleSubmit}>
            <div className="space-y-6 max-w-3xl">
                <Card>
                    <CardHeader><CardTitle>{isEdit ? 'Edit Review' : 'Create Review'}</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="tourId">Tour ID</Label>
                            <Input id="tourId" name="tourId" defaultValue={review?.tourId ?? ''} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="customerName">Customer Name</Label>
                                <Input id="customerName" name="customerName" defaultValue={review?.customerName ?? ''} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="customerEmail">Customer Email</Label>
                                <Input id="customerEmail" name="customerEmail" type="email" defaultValue={review?.customerEmail ?? ''} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="author">Author</Label>
                                <Input id="author" name="author" defaultValue={review?.author ?? ''} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input id="country" name="country" defaultValue={review?.country ?? ''} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="rating">Rating (1-5)</Label>
                                <select id="rating" name="rating" defaultValue={review?.rating ?? 5} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" required>
                                    {[1, 2, 3, 4, 5].map(r => (
                                        <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="safariPackage">Safari Package</Label>
                                <Input id="safariPackage" name="safariPackage" defaultValue={review?.safariPackage ?? ''} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" defaultValue={review?.title ?? ''} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="comment">Comment</Label>
                            <Textarea id="comment" name="comment" defaultValue={review?.comment ?? ''} rows={4} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">Additional Content</Label>
                            <Textarea id="content" name="content" defaultValue={review?.content ?? ''} rows={3} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="travelDate">Travel Date</Label>
                                <Input id="travelDate" name="travelDate" type="date" defaultValue={formatDate(review?.travelDate)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reviewDate">Review Date</Label>
                                <Input id="reviewDate" name="reviewDate" type="date" defaultValue={formatDate(review?.reviewDate)} />
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Checkbox id="isApproved" name="isApproved" defaultChecked={review?.isApproved ?? false} />
                                <Label htmlFor="isApproved">Approved</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="verified" name="verified" defaultChecked={review?.verified ?? false} />
                                <Label htmlFor="verified">Verified</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="isFeatured" name="isFeatured" defaultChecked={review?.isFeatured ?? false} />
                                <Label htmlFor="isFeatured">Featured</Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button type="submit" disabled={isPending} className="min-h-[44px]">
                        {isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : isEdit ? 'Update Review' : 'Create Review'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/reviews')} className="min-h-[44px]">Cancel</Button>
                </div>
            </div>
        </form>
    )
}
