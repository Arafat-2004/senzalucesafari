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
import { TagInput } from '@/components/ui/tag-input'
import { ItineraryEditor } from '@/components/admin/tour-itinerary-editor'
import { useToast } from '@/hooks/use-toast'
import { useBeforeUnload } from '@/hooks/use-before-unload'
import { Loader2 } from 'lucide-react'

interface ItineraryDay {
    day: number;
    title: string;
    description: string;
    activities: string[];
    meals: string[];
    accommodation: string;
    imageUrl?: string;
}

const categoryOptions = [
    'Wildlife Safari',
    'Safari & Beach',
    'Kilimanjaro Trek',
    'Cultural & Beach',
    'Day Trip',
    'Great Migration',
    'Honeymoon Safari',
    'Photography Safari',
    'Family Safari'
]

const bestForOptions = [
    'Couples',
    'Families',
    'Solo Travelers',
    'Groups',
    'Photography',
    'Adventure Seekers',
    'Luxury Travelers',
    'Budget Travelers',
    'First-time Safari'
]

export default function TourForm({ tour }: { tour?: Tour }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const { toast } = useToast()
    const isEdit = Boolean(tour)
    const [imageUrl, setImageUrl] = useState(tour?.imageUrl ?? '')
    const [formError, setFormError] = useState<string | null>(null)
    const [isDirty, setIsDirty] = useState(false)
    useBeforeUnload(isDirty && !isPending)
    
    const [bestFor, setBestFor] = useState<string[]>(tour?.bestFor ?? [])
    const [highlights, setHighlights] = useState<string[]>(tour?.highlights ?? [])
    const [included, setIncluded] = useState<string[]>(tour?.included ?? [])
    const [excluded, setExcluded] = useState<string[]>(tour?.excluded ?? [])
    const [itinerary, setItinerary] = useState<ItineraryDay[]>(
        tour?.itinerary ? (tour.itinerary as unknown as ItineraryDay[]) : []
    )

    function handleSubmit(formData: FormData) {
        setFormError(null)
        startTransition(async () => {
            try {
                if (tour) {
                    await updateTour(tour.id, formData)
                    toast({ title: 'Tour updated successfully', variant: 'default' })
                } else {
                    await createTour(formData)
                    toast({ title: 'Tour created successfully', variant: 'default' })
                }
                router.push('/admin/tours')
            } catch (error) {
                const message = error instanceof Error ? error.message : 'An error occurred'
                setFormError(message)
                toast({ title: message, variant: 'destructive' })
            }
        })
    }

    return (
        <form action={handleSubmit} onChange={() => setIsDirty(true)}>
            {formError && (
                <div className="mb-4 p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-sm">
                    {formError}
                </div>
            )}
            <div className="space-y-6 max-w-3xl">
                <Card>
                    <CardHeader><CardTitle>{isEdit ? 'Edit Tour' : 'Create Tour'}</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Tour Name</Label>
                                    <Input id="name" name="name" defaultValue={tour?.name ?? ''} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">URL Slug</Label>
                                    <Input id="slug" name="slug" defaultValue={tour?.slug ?? ''} placeholder="tour-name" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <select id="category" name="category" defaultValue={tour?.category ?? ''} className="flex h-9 w-full rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm" required>
                                        <option value="">Select category...</option>
                                        {categoryOptions.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="difficulty">Difficulty Level</Label>
                                    <select id="difficulty" name="difficulty" defaultValue={tour?.difficulty ?? ''} className="flex h-9 w-full rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm">
                                        <option value="">Select difficulty...</option>
                                        {['Easy', 'Moderate', 'Challenging'].map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="shortDescription">Short Description</Label>
                                <Textarea id="shortDescription" name="shortDescription" defaultValue={tour?.shortDescription ?? ''} rows={2} placeholder="Brief summary for listings..." required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="overview">Full Overview</Label>
                                <Textarea id="overview" name="overview" defaultValue={tour?.overview ?? ''} rows={5} placeholder="Detailed tour description..." required />
                            </div>
                        </div>

                        {/* Trip Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Trip Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="duration">Duration</Label>
                                    <Input id="duration" name="duration" defaultValue={tour?.duration ?? ''} placeholder="5 days / 4 nights" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="startEnd">Start/End Point</Label>
                                    <Input id="startEnd" name="startEnd" defaultValue={tour?.startEnd ?? ''} placeholder="Arusha" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="priceFrom">Price From ($)</Label>
                                    <Input id="priceFrom" name="priceFrom" type="number" step="0.01" defaultValue={tour?.priceFrom ?? ''} placeholder="0.00" required />
                                </div>
                            </div>
                        </div>

                        {/* Images */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Images</h3>
                            <div className="space-y-2">
                                <Label>Cover Image</Label>
                                <ImageUpload
                                    value={imageUrl}
                                    onChange={setImageUrl}
                                    folder="tours"
                                    label="Upload tour cover image"
                                />
                                <Input id="imageUrl" name="imageUrl" value={imageUrl} className="hidden" />
                            </div>
                        </div>

                        {/* Best For */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Target Audience</h3>
                            <TagInput
                                value={bestFor}
                                onChange={setBestFor}
                                label="Best For"
                                description="Who is this tour ideal for?"
                                suggestions={bestForOptions}
                                maxTags={10}
                                name="bestFor"
                            />
                        </div>

                        {/* Highlights */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Highlights</h3>
                            <TagInput
                                value={highlights}
                                onChange={setHighlights}
                                label="Tour Highlights"
                                description="Key experiences and attractions"
                                maxTags={15}
                                name="highlights"
                            />
                        </div>

                        {/* Included */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">What&apos;s Included</h3>
                            <TagInput
                                value={included}
                                onChange={setIncluded}
                                label="Included"
                                description="What&apos;s included in the tour price"
                                maxTags={20}
                                name="included"
                            />
                        </div>

                        {/* Excluded */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">What&apos;s Not Included</h3>
                            <TagInput
                                value={excluded}
                                onChange={setExcluded}
                                label="Excluded"
                                description="Additional costs not covered"
                                maxTags={10}
                                name="excluded"
                            />
                        </div>

                        {/* Itinerary */}
                        <div className="space-y-4">
                            <ItineraryEditor
                                value={itinerary}
                                onChange={setItinerary}
                                name="itinerary"
                            />
                        </div>

                        {/* Status */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Status & Display</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="displayOrder">Display Order</Label>
                                    <Input id="displayOrder" name="displayOrder" type="number" defaultValue={tour?.displayOrder ?? 0} />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-6">
                                <div className="flex items-center gap-2">
                                    <Checkbox id="isActive" name="isActive" defaultChecked={tour?.isActive ?? true} />
                                    <Label htmlFor="isActive">Active</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox id="isFeatured" name="isFeatured" defaultChecked={tour?.isFeatured ?? false} />
                                    <Label htmlFor="isFeatured">Featured</Label>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button type="submit" disabled={isPending} className="min-h-[44px]">
                        {isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : isEdit ? 'Update Tour' : 'Create Tour'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/tours')} className="min-h-[44px]">Cancel</Button>
                </div>
            </div>
        </form>
    )
}
