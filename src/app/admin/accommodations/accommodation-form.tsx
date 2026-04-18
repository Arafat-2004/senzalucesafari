'use client'

import { useState } from 'react'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Accommodation } from '@/generated/prisma/client'
import { createAccommodation, updateAccommodation } from './actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ImageUpload } from '@/components/ui/image-upload'

export default function AccommodationForm({ accommodation }: { accommodation?: Accommodation }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const isEdit = Boolean(accommodation)
    const [mainImage, setMainImage] = useState(accommodation?.images?.[0] ?? '')

    function handleSubmit(formData: FormData) {
        startTransition(async () => {
            if (accommodation) {
                await updateAccommodation(accommodation.id, formData)
            } else {
                await createAccommodation(formData)
            }
        })
    }

    return (
        <form action={handleSubmit}>
            <div className="space-y-6 max-w-3xl">
                <Card>
                    <CardHeader><CardTitle>{isEdit ? 'Edit Accommodation' : 'Create Accommodation'}</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" defaultValue={accommodation?.name ?? ''} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input id="slug" name="slug" defaultValue={accommodation?.slug ?? ''} required />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <select id="type" name="type" defaultValue={accommodation?.type ?? ''} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" required>
                                    <option value="">Select...</option>
                                    {['Luxury', 'Mid-Range', 'Budget', 'Camping'].map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tier">Tier</Label>
                                <Input id="tier" name="tier" defaultValue={accommodation?.tier ?? ''} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" name="location" defaultValue={accommodation?.location ?? ''} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" defaultValue={accommodation?.description ?? ''} rows={4} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="pricePerNight">Price Per Night</Label>
                                <Input id="pricePerNight" name="pricePerNight" defaultValue={accommodation?.pricePerNight ?? ''} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="priceRange">Price Range</Label>
                                <Input id="priceRange" name="priceRange" defaultValue={accommodation?.priceRange ?? ''} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <select id="currency" name="currency" defaultValue={accommodation?.currency ?? 'USD'} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                                    {['USD', 'EUR', 'GBP', 'TZS'].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rating">Rating (0-5)</Label>
                            <Input id="rating" name="rating" type="number" step="0.1" min="0" max="5" defaultValue={accommodation?.rating ?? 0} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amenities">Amenities (one per line)</Label>
                            <Textarea id="amenities" name="amenities" defaultValue={accommodation?.amenities?.join('\n') ?? ''} rows={3} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="highlights">Highlights (one per line)</Label>
                            <Textarea id="highlights" name="highlights" defaultValue={accommodation?.highlights?.join('\n') ?? ''} rows={3} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bestFor">Best For (one per line)</Label>
                            <Textarea id="bestFor" name="bestFor" defaultValue={accommodation?.bestFor?.join('\n') ?? ''} rows={3} />
                        </div>
                        <div className="space-y-2">
                            <Label>Main Image</Label>
                            <ImageUpload
                                value={mainImage}
                                onChange={setMainImage}
                                folder="accommodations"
                                label=""
                            />
                            <Input id="imageUrl" name="imageUrl" value={mainImage} className="hidden" />
                            <Label htmlFor="images">Additional Images (one URL per line)</Label>
                            <Textarea id="images" name="images" defaultValue={accommodation?.images?.join('\n') ?? ''} rows={3} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input id="website" name="website" defaultValue={accommodation?.website ?? ''} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" defaultValue={accommodation?.email ?? ''} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" name="phone" defaultValue={accommodation?.phone ?? ''} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="isActive" name="isActive" defaultChecked={accommodation?.isActive ?? true} />
                            <Label htmlFor="isActive">Active</Label>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex gap-3">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Saving...' : isEdit ? 'Update Accommodation' : 'Create Accommodation'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/accommodations')}>Cancel</Button>
                </div>
            </div>
        </form>
    )
}
