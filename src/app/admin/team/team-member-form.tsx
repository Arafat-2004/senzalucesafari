'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { TeamMember } from '@/generated/prisma/client'
import { createTeamMember, updateTeamMember } from './actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ui/image-upload'
import { toast } from 'sonner'
import { Loader2, Save, Users } from 'lucide-react'
import { useBeforeUnload } from '@/hooks/use-before-unload'

export default function TeamMemberForm({ member }: { member?: TeamMember }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const isEdit = Boolean(member)
    const [isDirty, setIsDirty] = useState(false)
    const [imageUrl, setImageUrl] = useState(member?.imageUrl ?? '')
    const [formError, setFormError] = useState<string | null>(null)
    useBeforeUnload(isDirty && !isPending)

    function handleSubmit(formData: FormData) {
        setFormError(null)
        formData.set('imageUrl', imageUrl)
        startTransition(async () => {
            try {
                if (member) {
                    await updateTeamMember(member.id, formData)
                    setIsDirty(false)
                    toast.success('Team member updated')
                    router.refresh()
                } else {
                    const created = await createTeamMember(formData)
                    setIsDirty(false)
                    toast.success('Team member created')
                    router.push(`/admin/team/${created.id}/edit`)
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
            <div className="max-w-3xl space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {isEdit ? 'Edit team member' : 'Add team member'}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        This member will appear on the public About page under "Meet Your Safari Team."
                    </p>
                </div>

                {formError && (
                    <div className="p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-sm animate-in fade-in duration-200">
                        {formError}
                    </div>
                )}

                {/* Photo */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile photo</CardTitle>
                        <CardDescription>
                            Upload a professional portrait. Square photos (1:1) work best.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ImageUpload
                            value={imageUrl}
                            onChange={setImageUrl}
                            bucket="team"
                            label="Profile photo"
                            aspectRatio="aspect-square"
                            objectFit="object-contain"
                        />
                        <input type="hidden" name="imageUrl" value={imageUrl} />
                    </CardContent>
                </Card>

                {/* Identity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Identity</CardTitle>
                        <CardDescription>Name and role displayed on the public site.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full name <span className="text-destructive">*</span></Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={member?.name ?? ''}
                                placeholder="e.g. Hamisi Ibrahim Omary"
                                required
                                disabled={isPending}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role / job title <span className="text-destructive">*</span></Label>
                            <Input
                                id="role"
                                name="role"
                                defaultValue={member?.role ?? ''}
                                placeholder="e.g. Co-founder & Managing Director"
                                required
                                disabled={isPending}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio">
                                Short bio <span className="text-muted-foreground font-normal">(optional)</span>
                            </Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                defaultValue={member?.bio ?? ''}
                                placeholder="A 2–3 sentence description displayed under the photo..."
                                rows={4}
                                maxLength={1000}
                                disabled={isPending}
                            />
                            <p className="text-xs text-muted-foreground">Max 1,000 characters</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Display settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Display settings</CardTitle>
                        <CardDescription>Control order and visibility on the About page.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="displayOrder">Display order</Label>
                            <Input
                                id="displayOrder"
                                name="displayOrder"
                                type="number"
                                min={0}
                                max={999}
                                defaultValue={member?.displayOrder ?? 0}
                                disabled={isPending}
                            />
                            <p className="text-xs text-muted-foreground">Lower number = appears first.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email <span className="text-muted-foreground font-normal">(optional)</span>
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={member?.email ?? ''}
                                placeholder="name@senzaluce.com"
                                disabled={isPending}
                            />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="linkedinUrl">
                                LinkedIn URL <span className="text-muted-foreground font-normal">(optional)</span>
                            </Label>
                            <Input
                                id="linkedinUrl"
                                name="linkedinUrl"
                                defaultValue={member?.linkedinUrl ?? ''}
                                placeholder="https://linkedin.com/in/..."
                                disabled={isPending}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isVisible"
                                    defaultChecked={member?.isVisible ?? true}
                                    className="h-4 w-4 rounded border-input accent-primary"
                                    disabled={isPending}
                                />
                                <span className="text-sm font-medium">Visible on public About page</span>
                            </label>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-3 border-t pt-5 justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/admin/team')}
                        className="min-h-11"
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending} className="min-h-11 min-w-36">
                        {isPending
                            ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                            : <><Save className="mr-2 h-4 w-4" /> {isEdit ? 'Save changes' : 'Create member'}</>
                        }
                    </Button>
                </div>
            </div>
        </form>
    )
}
