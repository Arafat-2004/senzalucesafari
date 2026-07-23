'use client'

import { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { FAQ } from '@/generated/prisma/client'
import { createFAQ, updateFAQ } from './actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'
import { useBeforeUnload } from '@/hooks/use-before-unload'

export default function FAQForm({ faq }: { faq?: FAQ }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const isEdit = Boolean(faq)
    const [formError, setFormError] = useState<string | null>(null)
    const [isDirty, setIsDirty] = useState(false)
    useBeforeUnload(isDirty && !isPending)

    function handleSubmit(formData: FormData) {
        setFormError(null)
        startTransition(async () => {
            try {
                if (faq) {
                    await updateFAQ(faq.id, formData)
                    setIsDirty(false)
                    toast.success(faq.isActive ? 'Published FAQ updated' : 'Draft saved')
                    router.refresh()
                } else {
                    const created = await createFAQ(formData)
                    setIsDirty(false)
                    toast.success('FAQ draft created')
                    router.push(`/admin/faqs/${created.id}/edit`)
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
            <div className="max-w-4xl space-y-6">
                <div className="flex items-start justify-between gap-4"><div><h1 className="text-2xl font-semibold tracking-tight">{isEdit ? 'Edit FAQ' : 'Create FAQ'}</h1><p className="mt-1 text-sm text-muted-foreground">Answer a real customer question clearly, then publish it when reviewed.</p></div><Badge variant={faq?.isActive ? 'default' : 'outline'}>{faq?.isActive ? 'Published' : 'Draft'}</Badge></div>
                {formError && (
                    <div className="mb-4 p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-sm">
                        {formError}
                    </div>
                )}
                <Card>
                    <CardHeader><CardTitle>Question and answer</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="question">Question</Label>
                            <Input id="question" name="question" defaultValue={faq?.question ?? ''} maxLength={240} placeholder="What would a traveller ask?" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="answer">Answer</Label>
                            <Textarea id="answer" name="answer" defaultValue={faq?.answer ?? ''} rows={8} maxLength={5000} placeholder="Give a direct, reassuring answer in plain language." required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <select id="category" name="category" defaultValue={faq?.category ?? ''} className="flex h-9 w-full rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm" required>
                                    <option value="">Select...</option>
                                    {faq?.category && !['Booking', 'Safari', 'Travel', 'Visa', 'Health', 'Accommodation', 'Transportation', 'Payments made outside the website', 'General'].includes(faq.category) && <option value={faq.category}>{faq.category}</option>}
                                    {['Booking', 'Safari', 'Travel', 'Visa', 'Health', 'Accommodation', 'Transportation', 'Payments made outside the website', 'General'].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="displayOrder">Display priority</Label>
                                <Input id="displayOrder" name="displayOrder" type="number" min="0" max="9999" defaultValue={faq?.displayOrder ?? 0} />
                                <p className="text-xs text-muted-foreground">Lower numbers appear first within the category.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button type="submit" disabled={isPending} className="min-h-[44px]">
                        {isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : <><Save className="h-4 w-4" />{isEdit ? 'Save changes' : 'Save draft'}</>}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/faqs')} className="min-h-[44px]">Cancel</Button>
                </div>
            </div>
        </form>
    )
}
