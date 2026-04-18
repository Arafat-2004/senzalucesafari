'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { FAQ } from '@/generated/prisma/client'
import { createFAQ, updateFAQ } from './actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

export default function FAQForm({ faq }: { faq?: FAQ }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const isEdit = Boolean(faq)

    function handleSubmit(formData: FormData) {
        startTransition(async () => {
            if (faq) {
                await updateFAQ(faq.id, formData)
            } else {
                await createFAQ(formData)
            }
        })
    }

    return (
        <form action={handleSubmit}>
            <div className="space-y-6 max-w-3xl">
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
                                <select id="category" name="category" defaultValue={faq?.category ?? ''} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" required>
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
                <div className="flex gap-3">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Saving...' : isEdit ? 'Update FAQ' : 'Create FAQ'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/faqs')}>Cancel</Button>
                </div>
            </div>
        </form>
    )
}
