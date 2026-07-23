'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { setNewsletterActive } from '../../actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CalendarDays, Globe2, Loader2, Mail, Tags, UserRound } from 'lucide-react'
import { toast } from 'sonner'

type NewsletterData = {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    country: string | null
    interests: string[]
    isActive: boolean
    subscribedAt: Date
    unsubscribedAt: Date | null
}

export default function NewsletterEditPage({ newsletter }: { newsletter: NewsletterData }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    function handleToggle() {
        startTransition(async () => {
            try {
                await setNewsletterActive(newsletter.id, !newsletter.isActive)
                toast.success(newsletter.isActive ? 'Subscriber deactivated' : 'Subscriber reactivated')
                router.refresh()
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Unable to update the subscription')
            }
        })
    }

    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <Button variant="ghost" onClick={() => router.push('/admin/newsletters')} className="mb-3"><ArrowLeft className="h-4 w-4" /> Subscribers</Button>
                <h1 className="text-2xl font-semibold tracking-tight">Subscriber details</h1>
                <p className="mt-1 text-sm text-muted-foreground">Review contact information and manage newsletter consent.</p>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Subscriber: {newsletter.email}</CardTitle>
                        <Badge variant={newsletter.isActive ? 'default' : 'secondary'}>
                            {newsletter.isActive ? 'Active' : 'Unsubscribed'}
                        </Badge>
                    </div>
                    <CardDescription>{newsletter.isActive ? 'This person currently agrees to receive newsletter communications.' : 'This person must not receive newsletter communications.'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 rounded-xl bg-muted/60 p-5 text-sm sm:grid-cols-2">
                        <div className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Email address</p><p className="font-medium break-all">{newsletter.email}</p></div></div>
                        <div className="flex gap-3"><UserRound className="mt-0.5 h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Name</p><p className="font-medium">{[newsletter.firstName, newsletter.lastName].filter(Boolean).join(' ') || 'Not provided'}</p></div></div>
                        <div className="flex gap-3"><Globe2 className="mt-0.5 h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Country</p><p className="font-medium">{newsletter.country || 'Not provided'}</p></div></div>
                        <div className="flex gap-3"><Tags className="mt-0.5 h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Interests</p><p className="font-medium">{newsletter.interests.join(', ') || 'Not provided'}</p></div></div>
                        <div className="flex gap-3"><CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Subscribed</p><p className="font-medium">{new Date(newsletter.subscribedAt).toLocaleString()}</p></div></div>
                        {newsletter.unsubscribedAt && <div className="flex gap-3"><CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Unsubscribed</p><p className="font-medium">{new Date(newsletter.unsubscribedAt).toLocaleString()}</p></div></div>}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button onClick={handleToggle} disabled={isPending} variant={newsletter.isActive ? 'destructive' : 'default'} className="min-h-[44px]">
                            {isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Updating...</> : newsletter.isActive ? 'Deactivate subscription' : 'Reactivate subscription'}
                        </Button>
                        <Button variant="outline" onClick={() => router.push('/admin/newsletters')} className="min-h-[44px]">Back</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
