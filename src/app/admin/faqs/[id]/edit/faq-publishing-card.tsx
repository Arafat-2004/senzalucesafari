'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { FAQ } from '@/generated/prisma/client'
import { setFAQActive } from '../../actions'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EyeOff, Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'

export function FAQPublishingCard({ faq }: { faq: FAQ }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    function changeStatus() {
        startTransition(async () => {
            try {
                await setFAQActive(faq.id, !faq.isActive)
                toast.success(faq.isActive ? 'FAQ returned to draft' : 'FAQ published')
                router.refresh()
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Unable to update the FAQ status')
            }
        })
    }

    return (
            <Card className={faq.isActive ? 'border-[var(--tone-success-border)]' : 'border-[var(--tone-warning-border)]'}>
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div><div className="flex items-center gap-2"><p className="font-semibold">{faq.isActive ? 'Visible on the public FAQ page' : 'Saved as a private draft'}</p><Badge variant={faq.isActive ? 'default' : 'outline'}>{faq.isActive ? 'Published' : 'Draft'}</Badge></div><p className="mt-1 text-sm text-muted-foreground">{faq.isActive ? 'Saving changes updates the public answer.' : 'Save and review the answer before publishing.'}</p></div>
                <Button type="button" variant={faq.isActive ? 'outline' : 'default'} onClick={changeStatus} disabled={isPending}>{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : faq.isActive ? <EyeOff className="h-4 w-4" /> : <Send className="h-4 w-4" />}{faq.isActive ? 'Return to draft' : 'Publish FAQ'}</Button>
            </CardContent>
        </Card>
    )
}
