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
import { TagInput } from '@/components/ui/tag-input'
import { GalleryManager } from '@/components/admin/gallery-manager'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useBeforeUnload } from '@/hooks/use-before-unload'

const regionOptions = ['Northern Circuit', 'Southern Circuit', 'Western Circuit', 'Coastal']

const bigFiveOptions = ['Lion', 'Leopard', 'Rhino', 'Elephant', 'Buffalo']

export default function DestinationForm({ destination }: { destination?: Destination }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const isEdit = Boolean(destination)
    const d = destination
    const [imageUrl, setImageUrl] = useState(destination?.imageUrl ?? '')
    const [formError, setFormError] = useState<string | null>(null)
    const [isDirty, setIsDirty] = useState(false)
    useBeforeUnload(isDirty && !isPending)

    const [bigFive, setBigFive] = useState<string[]>(destination?.bigFive ?? [])
    const [keySpecies, setKeySpecies] = useState<string[]>(destination?.keySpecies ?? [])
    const [uniqueSpecies, setUniqueSpecies] = useState<string[]>(destination?.uniqueSpecies ?? [])
    const [highlights, setHighlights] = useState<string[]>(destination?.highlights ?? [])
    const [ecosystems, setEcosystems] = useState<string[]>(destination?.ecosystems ?? [])
    const [bestTimeToGo, setBestTimeToGo] = useState<string[]>(destination?.bestTimeToGo ?? [])
    const [galleryImages, setGalleryImages] = useState<string[]>(destination?.galleryImages ?? [])

    function handleSubmit(formData: FormData) {
        setFormError(null)
        startTransition(async () => {
            try {
                if (d) {
                    await updateDestination(d.id, formData)
                    toast.success('Destination updated successfully')
                } else {
                    await createDestination(formData)
                    toast.success('Destination created successfully')
                }
                router.push('/admin/destinations')
            } catch (error) {
                const message = error instanceof Error ? error.message : 'An error occurred'
                setFormError(message)
                toast.error(message)
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
                    <CardHeader><CardTitle>{isEdit ? 'Edit Destination' : 'Create Destination'}</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" defaultValue={d?.name ?? ''} required /></div>
                                <div className="space-y-2"><Label htmlFor="slug">URL Slug</Label><Input id="slug" name="slug" defaultValue={d?.slug ?? ''} required /></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="region">Region</Label>
                                    <select id="region" name="region" defaultValue={d?.region ?? ''} className="flex h-9 w-full rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm" required>
                                        <option value="">Select region...</option>
                                        {regionOptions.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2"><Label htmlFor="wildlifeRating">Wildlife Rating (1-5)</Label><Input id="wildlifeRating" name="wildlifeRating" type="number" min={1} max={5} defaultValue={d?.wildlifeRating ?? 3} /></div>
                            </div>
                            <div className="space-y-2"><Label htmlFor="shortDescription">Short Description</Label><Textarea id="shortDescription" name="shortDescription" defaultValue={d?.shortDescription ?? ''} rows={2} required /></div>
                            <div className="space-y-2"><Label htmlFor="whyVisit">Why Visit</Label><Textarea id="whyVisit" name="whyVisit" defaultValue={d?.whyVisit ?? ''} rows={3} required /></div>
                            <div className="space-y-2"><Label htmlFor="fullDescription">Full Description</Label><Textarea id="fullDescription" name="fullDescription" defaultValue={d?.fullDescription ?? ''} rows={5} required /></div>
                        </div>

                        {/* Park Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Park Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2"><Label htmlFor="parkSize">Park Size</Label><Input id="parkSize" name="parkSize" defaultValue={d?.parkSize ?? ''} placeholder="e.g., 1,200 km²" /></div>
                                <div className="space-y-2"><Label htmlFor="elevation">Elevation</Label><Input id="elevation" name="elevation" defaultValue={d?.elevation ?? ''} placeholder="e.g., 1,400m" /></div>
                                <div className="space-y-2"><Label htmlFor="established">Established</Label><Input id="established" name="established" defaultValue={d?.established ?? ''} placeholder="e.g., 1910" /></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label htmlFor="nearestAirport">Nearest Airport</Label><Input id="nearestAirport" name="nearestAirport" defaultValue={d?.nearestAirport ?? ''} /></div>
                                <div className="space-y-2"><Label htmlFor="distanceFromArusha">Distance from Arusha</Label><Input id="distanceFromArusha" name="distanceFromArusha" defaultValue={d?.distanceFromArusha ?? ''} /></div>
                            </div>
                            <div className="space-y-2"><Label htmlFor="recommendedStay">Recommended Stay</Label><Input id="recommendedStay" name="recommendedStay" defaultValue={d?.recommendedStay ?? ''} placeholder="e.g., 2-3 days" /></div>
                        </div>

                        {/* Images */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Images</h3>
                            <div className="space-y-2">
                                <Label>Hero Image</Label>
                                <ImageUpload
                                    value={imageUrl}
                                    onChange={setImageUrl}
                                    folder="destinations"
                                    label="Main destination image"
                                />
                                <Input id="imageUrl" name="imageUrl" value={imageUrl} className="hidden" />
                            </div>
                            <GalleryManager
                                value={galleryImages}
                                onChange={setGalleryImages}
                                maxImages={10}
                                label="Gallery Images"
                                description="Add up to 10 images"
                                name="galleryImages"
                            />
                        </div>

                        {/* Wildlife */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Wildlife</h3>
                            <TagInput
                                value={bigFive}
                                onChange={setBigFive}
                                label="Big Five"
                                description="The iconic safari animals"
                                suggestions={bigFiveOptions}
                                maxTags={5}
                                name="bigFive"
                            />
                            <TagInput
                                value={keySpecies}
                                onChange={setKeySpecies}
                                label="Key Species"
                                description="Main animals to spot"
                                maxTags={15}
                                name="keySpecies"
                            />
                            <TagInput
                                value={uniqueSpecies}
                                onChange={setUniqueSpecies}
                                label="Unique Species"
                                description="Rare/endemic species"
                                maxTags={10}
                                name="uniqueSpecies"
                            />
                        </div>

                        {/* Highlights & Features */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Highlights & Features</h3>
                            <TagInput
                                value={highlights}
                                onChange={setHighlights}
                                label="Highlights"
                                description="Key attractions"
                                maxTags={10}
                                name="highlights"
                            />
                            <TagInput
                                value={ecosystems}
                                onChange={setEcosystems}
                                label="Ecosystems"
                                description="environments found here"
                                maxTags={8}
                                name="ecosystems"
                            />
                        </div>

                        {/* Best Time */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Best Time to Visit</h3>
                            <TagInput
                                value={bestTimeToGo}
                                onChange={setBestTimeToGo}
                                label="Best Time"
                                description="Optimal months/seasons"
                                suggestions={['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']}
                                maxTags={6}
                                name="bestTimeToGo"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label htmlFor="peakSeason">Peak Season</Label><Input id="peakSeason" name="peakSeason" defaultValue={d?.peakSeason ?? ''} /></div>
                                <div className="space-y-2"><Label htmlFor="lowSeason">Low Season</Label><Input id="lowSeason" name="lowSeason" defaultValue={d?.lowSeason ?? ''} /></div>
                            </div>
                        </div>

                        {/* Landscape & Culture */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Landscape & Culture</h3>
                            <div className="space-y-2"><Label htmlFor="landscape">Landscape</Label><Textarea id="landscape" name="landscape" defaultValue={d?.landscape ?? ''} rows={2} /></div>
                            <div className="space-y-2"><Label htmlFor="conservation">Conservation</Label><Textarea id="conservation" name="conservation" defaultValue={d?.conservation ?? ''} rows={3} /></div>
                            <div className="space-y-2"><Label htmlFor="communityInitiatives">Community Initiatives</Label><Textarea id="communityInitiatives" name="communityInitiatives" defaultValue={d?.communityInitiatives ?? ''} rows={2} /></div>
                            <div className="space-y-2"><Label htmlFor="culturalContext">Cultural Context</Label><Textarea id="culturalContext" name="culturalContext" defaultValue={d?.culturalContext ?? ''} rows={2} /></div>
                        </div>

                        {/* SEO */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">SEO</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label htmlFor="metaTitle">Meta Title</Label><Input id="metaTitle" name="metaTitle" defaultValue={d?.metaTitle ?? ''} /></div>
                                <div className="space-y-2"><Label htmlFor="metaDescription">Meta Description</Label><Input id="metaDescription" name="metaDescription" defaultValue={d?.metaDescription ?? ''} /></div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Status</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2"><Label htmlFor="displayOrder">Display Order</Label><Input id="displayOrder" name="displayOrder" type="number" defaultValue={d?.displayOrder ?? 0} /></div>
                            </div>
                            <div className="flex flex-wrap gap-6">
                                <div className="flex items-center gap-2"><Checkbox id="birdWatching" name="birdWatching" defaultChecked={d?.birdWatching ?? false} /><Label htmlFor="birdWatching">Bird Watching Destination</Label></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button type="submit" disabled={isPending} className="min-h-[44px]">
                        {isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : isEdit ? 'Update Destination' : 'Create Destination'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/destinations')} className="min-h-[44px]">Cancel</Button>
                </div>
            </div>
        </form>
    )
}
