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
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
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
                    toast.success('FAQ updated successfully')
                } else {
                    await createFAQ(formData)
                    toast.success('FAQ created successfully')
                }
                router.push('/admin/faqs')
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
                    <CardHeader><CardTitle>{isEdit ? 'Edit FAQ' : 'Create FAQ'}</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="question">Question</Label>
                            <Input id="question" name="question" defaultValue={faq?.question ?? ''} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="answer">Answer</Label>
                            <Textarea id="answer" name="answer" defaultValue={faq?.answer ?? ''} rows={5} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <select id="category" name="category" defaultValue={faq?.category ?? ''} className="flex h-9 w-full rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm" required>
                                    <option value="">Select...</option>
                                    {['Booking', 'Safari', 'Visa', 'Health', 'Accommodation', 'Transportation', 'Payment', 'General'].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="displayOrder">Display Order</Label>
                                <Input id="displayOrder" name="displayOrder" type="number" defaultValue={faq?.displayOrder ?? 0} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="isActive" name="isActive" defaultChecked={faq?.isActive ?? true} />
                            <Label htmlFor="isActive">Active</Label>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button type="submit" disabled={isPending} className="min-h-[44px]">
                        {isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</> : isEdit ? 'Update FAQ' : 'Create FAQ'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/faqs')} className="min-h-[44px]">Cancel</Button>
                </div>
            </div>
        </form>
    )
}
