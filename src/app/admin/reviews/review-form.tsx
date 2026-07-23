'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Review } from '@/generated/prisma/client'
import { createReview, updateReview } from './actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { BadgeCheck, Loader2, Megaphone, Star } from 'lucide-react'

export interface ReviewTourOption {
    id: string
    name: string
    isActive: boolean
}

function formatDate(date: Date | null | undefined): string {
    if (!date) return ''
    return new Date(date).toISOString().split('T')[0]
}

function getStatusLabel(review?: Review) {
    if (!review) return 'New review'
    if (review.status === 'APPROVED') return 'Published'
    if (review.status === 'REJECTED') return 'Rejected'
    return 'Awaiting moderation'
}

export default function ReviewForm({ review, tours }: { review?: Review; tours: ReviewTourOption[] }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const isEdit = Boolean(review)
    const canFeature = review?.status === 'APPROVED'

    function handleSubmit(formData: FormData) {
        startTransition(async () => {
            try {
                if (review) {
                    await updateReview(review.id, formData)
                    toast.success('Review details saved')
                    router.refresh()
                } else {
                    const created = await createReview(formData)
                    toast.success('Review saved for moderation')
                    router.push(`/admin/reviews/${created.id}/edit`)
                }
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Unable to save the review')
            }
        })
    }

    return (
        <form action={handleSubmit} className="max-w-5xl space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">{isEdit ? 'Edit review' : 'Add customer review'}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Record the customer&apos;s feedback accurately. Publishing is handled separately through moderation.
                    </p>
                </div>
                <Badge variant={review?.status === 'APPROVED' ? 'default' : 'outline'} className="w-fit">
                    {getStatusLabel(review)}
                </Badge>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Customer and safari</CardTitle>
                    <CardDescription>Identify who supplied the review and which safari they experienced.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="tourId">Safari package</Label>
                        <select
                            id="tourId"
                            name="tourId"
                            defaultValue={review?.tourId ?? ''}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            required
                        >
                            <option value="" disabled>Select the customer&apos;s safari</option>
                            {tours.map(tour => (
                                <option key={tour.id} value={tour.id}>
                                    {tour.name}{tour.isActive ? '' : ' (inactive)'}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-muted-foreground">Customers see this review on the selected safari page after approval.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="customerName">Customer name</Label>
                        <Input id="customerName" name="customerName" autoComplete="name" defaultValue={review?.customerName ?? ''} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="customerEmail">Customer email <span className="font-normal text-muted-foreground">(private, optional)</span></Label>
                        <Input id="customerEmail" name="customerEmail" type="email" autoComplete="email" defaultValue={review?.customerEmail ?? ''} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="country">Country <span className="font-normal text-muted-foreground">(optional)</span></Label>
                        <Input id="country" name="country" autoComplete="country-name" defaultValue={review?.country ?? ''} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="rating">Rating</Label>
                        <select id="rating" name="rating" defaultValue={review?.rating ?? 5} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" required>
                            {[5, 4, 3, 2, 1].map(rating => (
                                <option key={rating} value={rating}>{rating} star{rating === 1 ? '' : 's'}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="travelDate">Travel date <span className="font-normal text-muted-foreground">(optional)</span></Label>
                        <Input id="travelDate" name="travelDate" type="date" defaultValue={formatDate(review?.travelDate)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="reviewDate">Review received</Label>
                        <Input id="reviewDate" name="reviewDate" type="date" defaultValue={formatDate(review?.reviewDate) || formatDate(new Date())} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Review content</CardTitle>
                    <CardDescription>Keep the customer&apos;s meaning and wording intact when transcribing feedback.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="title">Review title</Label>
                        <Input id="title" name="title" maxLength={200} defaultValue={review?.title ?? ''} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="comment">Customer&apos;s review</Label>
                        <Textarea id="comment" name="comment" maxLength={3000} defaultValue={review?.comment ?? ''} rows={6} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Extended testimonial <span className="font-normal text-muted-foreground">(optional)</span></Label>
                        <Textarea id="content" name="content" maxLength={5000} defaultValue={review?.content ?? ''} rows={4} />
                        <p className="text-xs text-muted-foreground">Use only when there is additional feedback beyond the main review.</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Trust and promotion</CardTitle>
                    <CardDescription>Verification confirms authenticity. Featuring controls placement, not publication.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <label htmlFor="verified" className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 hover:bg-muted/40">
                        <Checkbox id="verified" name="verified" defaultChecked={review?.verified ?? false} className="mt-0.5" />
                        <span>
                            <span className="flex items-center gap-2 font-medium"><BadgeCheck className="h-4 w-4 text-primary" /> Verified traveler</span>
                            <span className="mt-1 block text-xs leading-5 text-muted-foreground">Enable only after matching the reviewer to a genuine booking or customer record.</span>
                        </span>
                    </label>
                    <label htmlFor="isFeatured" className={`flex items-start gap-3 rounded-xl border p-4 ${canFeature ? 'cursor-pointer hover:bg-muted/40' : 'cursor-not-allowed opacity-60'}`}>
                        <Checkbox id="isFeatured" name="isFeatured" defaultChecked={review?.isFeatured ?? false} disabled={!canFeature} className="mt-0.5" />
                        <span>
                            <span className="flex items-center gap-2 font-medium"><Megaphone className="h-4 w-4 text-primary" /> Feature this review</span>
                            <span className="mt-1 block text-xs leading-5 text-muted-foreground">{canFeature ? 'Give this published review priority in testimonial sections.' : 'Approve and publish the review before featuring it.'}</span>
                        </span>
                    </label>
                </CardContent>
            </Card>

            <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={() => router.push('/admin/reviews')} className="min-h-11">Cancel</Button>
                <Button type="submit" disabled={isPending || tours.length === 0} className="min-h-11 sm:min-w-36">
                    {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Star className="mr-2 h-4 w-4" /> {isEdit ? 'Save changes' : 'Save for moderation'}</>}
                </Button>
            </div>
        </form>
    )
}
