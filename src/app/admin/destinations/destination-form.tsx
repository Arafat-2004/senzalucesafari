'use client'

import { useState } from 'react'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Destination } from '@/generated/prisma/client'
import { createDestination, updateDestination } from './actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ImageUpload } from '@/components/ui/image-upload'

export default function DestinationForm({ destination }: { destination?: Destination }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const isEdit = Boolean(destination)
    const d = destination
    const [imageUrl, setImageUrl] = useState(destination?.imageUrl ?? '')

    function handleSubmit(formData: FormData) {
        startTransition(async () => {
            if (d) { await updateDestination(d.id, formData) }
            else { await createDestination(formData) }
        })
    }

    return (
        <form action={handleSubmit}>
            <div className="space-y-6 max-w-3xl">
                <Card>
                    <CardHeader><CardTitle>{isEdit ? 'Edit Destination' : 'Create Destination'}</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" defaultValue={d?.name ?? ''} required /></div>
                            <div className="space-y-2"><Label htmlFor="slug">Slug</Label><Input id="slug" name="slug" defaultValue={d?.slug ?? ''} required /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="region">Region</Label>
                                <select id="region" name="region" defaultValue={d?.region ?? ''} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" required>
                                    <option value="">Select...</option>
                                    {['Northern Circuit', 'Southern Circuit', 'Western Circuit', 'Coastal'].map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2"><Label htmlFor="wildlifeRating">Wildlife Rating (1-5)</Label><Input id="wildlifeRating" name="wildlifeRating" type="number" min={1} max={5} defaultValue={d?.wildlifeRating ?? 3} /></div>
                        </div>
                        <div className="space-y-2"><Label htmlFor="shortDescription">Short Description</Label><Textarea id="shortDescription" name="shortDescription" defaultValue={d?.shortDescription ?? ''} rows={2} required /></div>
                        <div className="space-y-2"><Label htmlFor="whyVisit">Why Visit</Label><Textarea id="whyVisit" name="whyVisit" defaultValue={d?.whyVisit ?? ''} rows={3} required /></div>
                        <div className="space-y-2"><Label htmlFor="fullDescription">Full Description</Label><Textarea id="fullDescription" name="fullDescription" defaultValue={d?.fullDescription ?? ''} rows={5} required /></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2"><Label htmlFor="parkSize">Park Size</Label><Input id="parkSize" name="parkSize" defaultValue={d?.parkSize ?? ''} /></div>
                            <div className="space-y-2"><Label htmlFor="elevation">Elevation</Label><Input id="elevation" name="elevation" defaultValue={d?.elevation ?? ''} /></div>
                            <div className="space-y-2"><Label htmlFor="established">Established</Label><Input id="established" name="established" defaultValue={d?.established ?? ''} /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label htmlFor="nearestAirport">Nearest Airport</Label><Input id="nearestAirport" name="nearestAirport" defaultValue={d?.nearestAirport ?? ''} /></div>
                            <div className="space-y-2"><Label htmlFor="distanceFromArusha">Distance from Arusha</Label><Input id="distanceFromArusha" name="distanceFromArusha" defaultValue={d?.distanceFromArusha ?? ''} /></div>
                        </div>
                        <div className="space-y-2"><Label htmlFor="recommendedStay">Recommended Stay</Label><Input id="recommendedStay" name="recommendedStay" defaultValue={d?.recommendedStay ?? ''} /></div>
                        <div className="space-y-2">
                            <Label>Destination Image</Label>
                            <ImageUpload
                                value={imageUrl}
                                onChange={setImageUrl}
                                folder="destinations"
                                label=""
                            />
                            <Input id="imageUrl" name="imageUrl" value={imageUrl} className="hidden" />
                        </div>
                        <div className="space-y-2"><Label htmlFor="bigFive">Big Five (one per line)</Label><Textarea id="bigFive" name="bigFive" defaultValue={d?.bigFive?.join('\n') ?? ''} rows={3} /></div>
                        <div className="space-y-2"><Label htmlFor="keySpecies">Key Species (one per line)</Label><Textarea id="keySpecies" name="keySpecies" defaultValue={d?.keySpecies?.join('\n') ?? ''} rows={3} /></div>
                        <div className="space-y-2"><Label htmlFor="uniqueSpecies">Unique Species (one per line)</Label><Textarea id="uniqueSpecies" name="uniqueSpecies" defaultValue={d?.uniqueSpecies?.join('\n') ?? ''} rows={3} /></div>
                        <div className="space-y-2"><Label htmlFor="highlights">Highlights (one per line)</Label><Textarea id="highlights" name="highlights" defaultValue={d?.highlights?.join('\n') ?? ''} rows={3} /></div>
                        <div className="space-y-2"><Label htmlFor="ecosystems">Ecosystems (one per line)</Label><Textarea id="ecosystems" name="ecosystems" defaultValue={d?.ecosystems?.join('\n') ?? ''} rows={3} /></div>
                        <div className="space-y-2"><Label htmlFor="bestTimeToGo">Best Time to Go (one per line)</Label><Textarea id="bestTimeToGo" name="bestTimeToGo" defaultValue={d?.bestTimeToGo?.join('\n') ?? ''} rows={2} /></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label htmlFor="peakSeason">Peak Season</Label><Input id="peakSeason" name="peakSeason" defaultValue={d?.peakSeason ?? ''} /></div>
                            <div className="space-y-2"><Label htmlFor="lowSeason">Low Season</Label><Input id="lowSeason" name="lowSeason" defaultValue={d?.lowSeason ?? ''} /></div>
                        </div>
                        <div className="space-y-2"><Label htmlFor="landscape">Landscape</Label><Textarea id="landscape" name="landscape" defaultValue={d?.landscape ?? ''} rows={2} /></div>
                        <div className="space-y-2"><Label htmlFor="conservation">Conservation</Label><Textarea id="conservation" name="conservation" defaultValue={d?.conservation ?? ''} rows={3} /></div>
                        <div className="space-y-2"><Label htmlFor="communityInitiatives">Community Initiatives</Label><Textarea id="communityInitiatives" name="communityInitiatives" defaultValue={d?.communityInitiatives ?? ''} rows={2} /></div>
                        <div className="space-y-2"><Label htmlFor="culturalContext">Cultural Context</Label><Textarea id="culturalContext" name="culturalContext" defaultValue={d?.culturalContext ?? ''} rows={2} /></div>
                        <div className="space-y-2"><Label htmlFor="galleryImages">Gallery Images (one URL per line)</Label><Textarea id="galleryImages" name="galleryImages" defaultValue={d?.galleryImages?.join('\n') ?? ''} rows={3} /></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label htmlFor="metaTitle">Meta Title</Label><Input id="metaTitle" name="metaTitle" defaultValue={d?.metaTitle ?? ''} /></div>
                            <div className="space-y-2"><Label htmlFor="metaDescription">Meta Description</Label><Input id="metaDescription" name="metaDescription" defaultValue={d?.metaDescription ?? ''} /></div>
                        </div>
                        <div className="space-y-2"><Label htmlFor="displayOrder">Display Order</Label><Input id="displayOrder" name="displayOrder" type="number" defaultValue={d?.displayOrder ?? 0} /></div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2"><Checkbox id="isActive" name="isActive" defaultChecked={d?.isActive ?? true} /><Label htmlFor="isActive">Active</Label></div>
                            <div className="flex items-center gap-2"><Checkbox id="birdWatching" name="birdWatching" defaultChecked={d?.birdWatching ?? false} /><Label htmlFor="birdWatching">Bird Watching</Label></div>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex gap-3">
                    <Button type="submit" disabled={isPending}>{isPending ? 'Saving...' : isEdit ? 'Update Destination' : 'Create Destination'}</Button>
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/destinations')}>Cancel</Button>
                </div>
            </div>
        </form>
    )
}
