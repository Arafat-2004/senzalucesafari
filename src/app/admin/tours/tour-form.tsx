'use client'

import { useState } from 'react'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Tour } from '@/generated/prisma/client'
import { createTour, updateTour } from './actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ImageUpload } from '@/components/ui/image-upload'

export default function TourForm({ tour }: { tour?: Tour }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const isEdit = Boolean(tour)
    const [imageUrl, setImageUrl] = useState(tour?.imageUrl ?? '')

    function handleSubmit(formData: FormData) {
        startTransition(async () => {
            if (tour) {
                await updateTour(tour.id, formData)
            } else {
                await createTour(formData)
            }
        })
    }

    return (
        <form action={handleSubmit}>
            <div className="space-y-6 max-w-3xl">
                <Card>
                    <CardHeader><CardTitle>{isEdit ? 'Edit Tour' : 'Create Tour'}</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" defaultValue={tour?.name ?? ''} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input id="slug" name="slug" defaultValue={tour?.slug ?? ''} required />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <select id="category" name="category" defaultValue={tour?.category ?? ''} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" required>
                                    <option value="">Select...</option>
                                    {['Wildlife Safari', 'Safari & Beach', 'Kilimanjaro Trek', 'Cultural & Beach', 'Day Trip', 'Great Migration', 'Honeymoon Safari', 'Photography Safari', 'Family Safari'].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="difficulty">Difficulty</Label>
                                <select id="difficulty" name="difficulty" defaultValue={tour?.difficulty ?? ''} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                                    <option value="">None</option>
                                    {['Easy', 'Moderate', 'Challenging'].map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="shortDescription">Short Description</Label>
                            <Textarea id="shortDescription" name="shortDescription" defaultValue={tour?.shortDescription ?? ''} rows={2} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="overview">Overview</Label>
                            <Textarea id="overview" name="overview" defaultValue={tour?.overview ?? ''} rows={4} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration</Label>
                                <Input id="duration" name="duration" defaultValue={tour?.duration ?? ''} placeholder="5 days / 4 nights" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="startEnd">Start/End</Label>
                                <Input id="startEnd" name="startEnd" defaultValue={tour?.startEnd ?? ''} placeholder="Arusha" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="priceFrom">Price From ($)</Label>
                                <Input id="priceFrom" name="priceFrom" type="number" step="0.01" defaultValue={tour?.priceFrom ?? ''} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Tour Image</Label>
                            <ImageUpload
                                value={imageUrl}
                                onChange={setImageUrl}
                                folder="tours"
                                label=""
                            />
                            <Input id="imageUrl" name="imageUrl" value={imageUrl} className="hidden" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bestFor">Best For (one per line)</Label>
                            <Textarea id="bestFor" name="bestFor" defaultValue={tour?.bestFor?.join('\n') ?? ''} rows={3} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="highlights">Highlights (one per line)</Label>
                            <Textarea id="highlights" name="highlights" defaultValue={tour?.highlights?.join('\n') ?? ''} rows={4} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="included">Included (one per line)</Label>
                            <Textarea id="included" name="included" defaultValue={tour?.included?.join('\n') ?? ''} rows={4} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="excluded">Excluded (one per line)</Label>
                            <Textarea id="excluded" name="excluded" defaultValue={tour?.excluded?.join('\n') ?? ''} rows={3} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="itinerary">Itinerary (JSON)</Label>
                            <Textarea id="itinerary" name="itinerary" defaultValue={tour?.itinerary ? JSON.stringify(tour.itinerary, null, 2) : '[]'} rows={6} className="font-mono text-xs" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="displayOrder">Display Order</Label>
                            <Input id="displayOrder" name="displayOrder" type="number" defaultValue={tour?.displayOrder ?? 0} />
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Checkbox id="isActive" name="isActive" defaultChecked={tour?.isActive ?? true} />
                                <Label htmlFor="isActive">Active</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="isFeatured" name="isFeatured" defaultChecked={tour?.isFeatured ?? false} />
                                <Label htmlFor="isFeatured">Featured</Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex gap-3">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Saving...' : isEdit ? 'Update Tour' : 'Create Tour'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/tours')}>Cancel</Button>
                </div>
            </div>
        </form>
    )
}
