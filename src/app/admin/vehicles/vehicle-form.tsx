'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Vehicle } from '@/generated/prisma/client'
import { createVehicle, updateVehicle } from './actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ui/image-upload'
import { Loader2, Plus, X } from 'lucide-react'
import { toast } from 'sonner'

type SpecificationRow = { id: string; label: string; value: string }

function getInitialSpecifications(value: Vehicle['specifications'] | undefined): SpecificationRow[] {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return []
    return Object.entries(value as Record<string, unknown>).map(([label, specificationValue], index) => ({
        id: `existing-${index}`,
        label,
        value: String(specificationValue ?? ''),
    }))
}

export default function VehicleForm({ vehicle }: { vehicle?: Vehicle }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const isEdit = Boolean(vehicle)
    const [imageUrl, setImageUrl] = useState(vehicle?.imageUrl ?? '')
    const [specifications, setSpecifications] = useState<SpecificationRow[]>(() => getInitialSpecifications(vehicle?.specifications))

    const serializedSpecifications = JSON.stringify(Object.fromEntries(
        specifications
            .filter(item => item.label.trim())
            .map(item => [item.label.trim(), item.value.trim()])
    ))

    function handleSubmit(formData: FormData) {
        startTransition(async () => {
            try {
                if (vehicle) {
                    await updateVehicle(vehicle.id, formData)
                    toast.success('Vehicle updated successfully')
                    router.refresh()
                } else {
                    const created = await createVehicle(formData)
                    toast.success('Vehicle created successfully')
                    router.push(`/admin/vehicles/${created.id}/edit`)
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to save vehicle'
                toast.error(message)
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
                            <input type="hidden" id="imageUrl" name="imageUrl" value={imageUrl} />
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
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label>Vehicle Specifications</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSpecifications(prev => [...prev, { id: `new-${Date.now()}`, label: '', value: '' }])}
                                >
                                    <Plus className="h-4 w-4 mr-1" /> Add Spec
                                </Button>
                            </div>
                            {specifications.map((row, index) => (
                                <div key={row.id} className="flex items-center gap-2">
                                    <Input
                                        placeholder="Feature (e.g. WiFi)"
                                        value={row.label}
                                        onChange={e => {
                                            const val = e.target.value
                                            setSpecifications(prev => prev.map((item, i) => i === index ? { ...item, label: val } : item))
                                        }}
                                    />
                                    <Input
                                        placeholder="Detail (e.g. High-speed 4G)"
                                        value={row.value}
                                        onChange={e => {
                                            const val = e.target.value
                                            setSpecifications(prev => prev.map((item, i) => i === index ? { ...item, value: val } : item))
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSpecifications(prev => prev.filter((_, i) => i !== index))}
                                    >
                                        <X className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                            <input type="hidden" name="specifications" value={serializedSpecifications} />
                        </div>
                    </CardContent>
                </Card>
                <div className="flex gap-3">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : isEdit ? 'Update Vehicle' : 'Create Vehicle'}
                    </Button>
                </div>
            </div>
        </form>
    )
}
