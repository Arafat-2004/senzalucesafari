'use client'

import { useState } from 'react'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Vehicle } from '@/generated/prisma/client'
import { createVehicle, updateVehicle } from './actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ImageUpload } from '@/components/ui/image-upload'
import { Loader2 } from 'lucide-react'

export default function VehicleForm({ vehicle }: { vehicle?: Vehicle }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const isEdit = Boolean(vehicle)
    const [imageUrl, setImageUrl] = useState(vehicle?.imageUrl ?? '')

    function handleSubmit(formData: FormData) {
        startTransition(async () => {
            if (vehicle) {
                await updateVehicle(vehicle.id, formData)
            } else {
                await createVehicle(formData)
            }
        })
    }

    return (
        <form action={handleSubmit}>
            <div className="space-y-6 max-w-3xl">
                <Card>
                    <CardHeader><CardTitle>{isEdit ? 'Edit Vehicle' : 'Create Vehicle'}</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" defaultValue={vehicle?.name ?? ''} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <select id="category" name="category" defaultValue={vehicle?.category ?? ''} className="flex h-9 w-full rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm" required>
                                    <option value="">Select...</option>
                                    {['Luxury Safari Vehicle', 'Standard Safari Vehicle', 'Budget Safari Vehicle', 'Transfer Vehicle'].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Vehicle Image</Label>
                            <ImageUpload
                                value={imageUrl}
                                onChange={setImageUrl}
                                folder="vehicles"
                                label=""
                            />
                            <Input id="imageUrl" name="imageUrl" value={imageUrl} className="hidden" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="capacity">Capacity</Label>
                                <Input id="capacity" name="capacity" defaultValue={vehicle?.capacity ?? ''} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rating">Rating</Label>
                                <Input id="rating" name="rating" type="number" step="0.1" min="0" max="5" defaultValue={vehicle?.rating ?? 0} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reviews">Reviews Count</Label>
                                <Input id="reviews" name="reviews" type="number" defaultValue={vehicle?.reviews ?? 0} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="priceRange">Price Range</Label>
                            <Input id="priceRange" name="priceRange" defaultValue={vehicle?.priceRange ?? ''} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" defaultValue={vehicle?.description ?? ''} rows={4} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="engine">Engine</Label>
                                <Input id="engine" name="engine" defaultValue={vehicle?.engine ?? ''} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="transmission">Transmission</Label>
                                <Input id="transmission" name="transmission" defaultValue={vehicle?.transmission ?? ''} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fuelType">Fuel Type</Label>
                                <select id="fuelType" name="fuelType" defaultValue={vehicle?.fuelType ?? ''} className="flex h-9 w-full rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm">
                                    <option value="">Select...</option>
                                    {['Diesel', 'Petrol'].map(f => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="year">Year</Label>
                            <Input id="year" name="year" type="number" defaultValue={vehicle?.year ?? ''} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="features">Features (one per line)</Label>
                            <Textarea id="features" name="features" defaultValue={vehicle?.features?.join('\n') ?? ''} rows={3} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bestFor">Best For (one per line)</Label>
                            <Textarea id="bestFor" name="bestFor" defaultValue={vehicle?.bestFor?.join('\n') ?? ''} rows={3} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="safetyFeatures">Safety Features (one per line)</Label>
                            <Textarea id="safetyFeatures" name="safetyFeatures" defaultValue={vehicle?.safetyFeatures?.join('\n') ?? ''} rows={3} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="safariEquipment">Safari Equipment (one per line)</Label>
                            <Textarea id="safariEquipment" name="safariEquipment" defaultValue={vehicle?.safariEquipment?.join('\n') ?? ''} rows={3} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="specifications">Specifications (JSON)</Label>
                            <Textarea id="specifications" name="specifications" defaultValue={vehicle?.specifications ? JSON.stringify(vehicle.specifications, null, 2) : '{}'} rows={4} className="font-mono text-xs" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="images">Images (one URL per line)</Label>
                            <Textarea id="images" name="images" defaultValue={vehicle?.images?.join('\n') ?? ''} rows={3} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="interiorImages">Interior Images (one URL per line)</Label>
                            <Textarea id="interiorImages" name="interiorImages" defaultValue={vehicle?.interiorImages?.join('\n') ?? ''} rows={2} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="exteriorImages">Exterior Images (one URL per line)</Label>
                            <Textarea id="exteriorImages" name="exteriorImages" defaultValue={vehicle?.exteriorImages?.join('\n') ?? ''} rows={2} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="actionShots">Action Shots (one URL per line)</Label>
                            <Textarea id="actionShots" name="actionShots" defaultValue={vehicle?.actionShots?.join('\n') ?? ''} rows={2} />
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="isActive" name="isActive" defaultChecked={vehicle?.isActive ?? true} />
                            <Label htmlFor="isActive">Active</Label>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button type="submit" disabled={isPending} className="min-h-[44px]">
                        {isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : isEdit ? 'Update Vehicle' : 'Create Vehicle'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/vehicles')} className="min-h-[44px]">Cancel</Button>
                </div>
            </div>
        </form>
    )
}
