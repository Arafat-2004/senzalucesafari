'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Guide } from '@/generated/prisma/client'
import { createGuide, updateGuide } from './actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

export default function GuideForm({ guide }: { guide?: Guide }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const isEdit = Boolean(guide)

    function handleSubmit(formData: FormData) {
        startTransition(async () => {
            if (guide) {
                await updateGuide(guide.id, formData)
            } else {
                await createGuide(formData)
            }
        })
    }

    return (
        <form action={handleSubmit}>
            <div className="space-y-6 max-w-3xl">
                <Card>
                    <CardHeader><CardTitle>{isEdit ? 'Edit Guide' : 'Create Guide'}</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" name="firstName" defaultValue={guide?.firstName ?? ''} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" name="lastName" defaultValue={guide?.lastName ?? ''} required />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" defaultValue={guide?.email ?? ''} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" name="phone" defaultValue={guide?.phone ?? ''} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="experience">Years of Experience</Label>
                            <Input id="experience" name="experience" type="number" min="0" defaultValue={guide?.experience ?? 0} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea id="bio" name="bio" defaultValue={guide?.bio ?? ''} rows={4} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="languages">Languages (one per line)</Label>
                            <Textarea id="languages" name="languages" defaultValue={guide?.languages?.join('\n') ?? ''} rows={3} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="specialties">Specialties (one per line)</Label>
                            <Textarea id="specialties" name="specialties" defaultValue={guide?.specialties?.join('\n') ?? ''} rows={3} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="certifications">Certifications (one per line)</Label>
                            <Textarea id="certifications" name="certifications" defaultValue={guide?.certifications?.join('\n') ?? ''} rows={3} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="licenseNumber">License Number</Label>
                            <Input id="licenseNumber" name="licenseNumber" defaultValue={guide?.licenseNumber ?? ''} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="avatar">Avatar URL</Label>
                            <Input id="avatar" name="avatar" defaultValue={guide?.avatar ?? ''} />
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="isActive" name="isActive" defaultChecked={guide?.isActive ?? true} />
                            <Label htmlFor="isActive">Active</Label>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex gap-3">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Saving...' : isEdit ? 'Update Guide' : 'Create Guide'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/guides')}>Cancel</Button>
                </div>
            </div>
        </form>
    )
}
