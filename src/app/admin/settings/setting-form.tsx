'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { SiteSettings } from '@/generated/prisma/client'
import { upsertSetting, updateSetting } from './actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function SettingForm({ setting }: { setting?: SiteSettings }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const isEdit = Boolean(setting)

    function handleSubmit(formData: FormData) {
        startTransition(async () => {
            if (setting) {
                await updateSetting(setting.id, formData)
            } else {
                await upsertSetting(formData)
            }
        })
    }

    return (
        <form action={handleSubmit}>
            <div className="space-y-6 max-w-3xl">
                <Card>
                    <CardHeader><CardTitle>{isEdit ? 'Edit Setting' : 'Create Setting'}</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="key">Key</Label>
                            <Input id="key" name="key" defaultValue={setting?.key ?? ''} placeholder="e.g., site_name, contact_email" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="value">Value</Label>
                            <Textarea id="value" name="value" defaultValue={setting?.value ?? ''} rows={4} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" name="description" defaultValue={setting?.description ?? ''} placeholder="What this setting controls..." />
                        </div>
                    </CardContent>
                </Card>
                <div className="flex gap-3">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Saving...' : isEdit ? 'Update Setting' : 'Create Setting'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/settings')}>Cancel</Button>
                </div>
            </div>
        </form>
    )
}
