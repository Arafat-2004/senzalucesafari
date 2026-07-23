'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Guide } from '@/generated/prisma/client'
import { createGuide, updateGuide } from './actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ImageUpload } from '@/components/ui/image-upload'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'
import { useBeforeUnload } from '@/hooks/use-before-unload'

export default function GuideForm({ guide }: { guide?: Guide }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const isEdit = Boolean(guide)
    const [formError, setFormError] = useState<string | null>(null)
    const [isDirty, setIsDirty] = useState(false)
    const [avatar, setAvatar] = useState(guide?.avatar ?? '')
    useBeforeUnload(isDirty && !isPending)

    function handleSubmit(formData: FormData) {
        setFormError(null)
        startTransition(async () => {
            try {
                if (guide) {
                    await updateGuide(guide.id, formData)
                    setIsDirty(false)
                    toast.success('Guide profile saved')
                    router.refresh()
                } else {
                    const created = await createGuide(formData)
                    setIsDirty(false)
                    toast.success('Guide profile created as unavailable')
                    router.push(`/admin/guides/${created.id}/edit`)
                }
            } catch (error) {
                const message = error instanceof Error ? error.message : 'An error occurred'
                setFormError(message)
                toast.error(message)
            }
        })
    }

    return (
        <form action={handleSubmit} onChange={() => setIsDirty(true)}>
            <div className="max-w-5xl space-y-6">
                <div className="flex items-start justify-between gap-4"><div><h1 className="text-2xl font-semibold tracking-tight">{isEdit ? 'Edit guide profile' : 'Add guide'}</h1><p className="mt-1 text-sm text-muted-foreground">Maintain accurate contact and professional details for your safari team.</p></div><Badge variant={guide?.isActive ? 'default' : 'outline'}>{guide?.isActive ? 'Available' : 'Unavailable'}</Badge></div>
                {formError && (
                    <div className="mb-4 p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-sm">
                        {formError}
                    </div>
                )}
                <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>Personal details</CardTitle><CardDescription>Private contact information used by the operations team.</CardDescription></CardHeader>
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
                    </CardContent>
                </Card>
                <Card><CardHeader><CardTitle>Professional profile</CardTitle><CardDescription>Experience and expertise used when selecting a guide for a trip.</CardDescription></CardHeader><CardContent className="space-y-4">
                        <div className="space-y-2"><Label htmlFor="experience">Years of experience</Label><Input id="experience" name="experience" type="number" min="0" max="70" defaultValue={guide?.experience ?? 0} required /></div>
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea id="bio" name="bio" defaultValue={guide?.bio ?? ''} rows={6} maxLength={3000} placeholder="Describe this guide's experience, approach, and local knowledge." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="languages">Languages</Label>
                            <Textarea id="languages" name="languages" defaultValue={guide?.languages?.join('\n') ?? ''} rows={3} placeholder={'English\nSwahili'} required />
                            <p className="text-xs text-muted-foreground">Enter one language per line.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="specialties">Specialties</Label>
                            <Textarea id="specialties" name="specialties" defaultValue={guide?.specialties?.join('\n') ?? ''} rows={3} placeholder={'Wildlife tracking\nBirding\nPhotography'} />
                            <p className="text-xs text-muted-foreground">Enter one specialty per line.</p>
                        </div>
                    </CardContent></Card>
                </div>
                <div className="space-y-6 lg:sticky lg:top-6 self-start">
                    <Card><CardHeader><CardTitle>Profile photo</CardTitle><CardDescription>Use a clear, professional portrait.</CardDescription></CardHeader><CardContent>
                        <ImageUpload value={avatar} onChange={value => { setAvatar(value); setIsDirty(true) }} folder="guides" label="Guide portrait" />
                        <Input id="avatar" name="avatar" value={avatar} readOnly className="sr-only" tabIndex={-1} />
                    </CardContent></Card>
                    <Card><CardHeader><CardTitle>Qualifications</CardTitle></CardHeader><CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="certifications">Certifications</Label>
                            <Textarea id="certifications" name="certifications" defaultValue={guide?.certifications?.join('\n') ?? ''} rows={3} />
                            <p className="text-xs text-muted-foreground">Enter one certification per line.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="licenseNumber">Guide license number</Label>
                            <Input id="licenseNumber" name="licenseNumber" defaultValue={guide?.licenseNumber ?? ''} />
                        </div>
                    </CardContent></Card>
                </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button type="submit" disabled={isPending} className="min-h-[44px]">
                        {isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : <><Save className="h-4 w-4" />{isEdit ? 'Save profile' : 'Create profile'}</>}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/guides')} className="min-h-[44px]">Cancel</Button>
                </div>
            </div>
        </form>
    )
}
