'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toggleNewsletterActive } from '../../actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'

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
            await toggleNewsletterActive(newsletter.id, newsletter.isActive)
            router.refresh()
        })
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Subscriber: {newsletter.email}</CardTitle>
                        <Badge variant={newsletter.isActive ? 'default' : 'secondary'}>
                            {newsletter.isActive ? 'Active' : 'Unsubscribed'}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-lg bg-muted p-4 space-y-2 text-sm">
                        <div><span className="text-muted-foreground">Email:</span> {newsletter.email}</div>
                        {newsletter.firstName && <div><span className="text-muted-foreground">First Name:</span> {newsletter.firstName}</div>}
                        {newsletter.lastName && <div><span className="text-muted-foreground">Last Name:</span> {newsletter.lastName}</div>}
                        {newsletter.country && <div><span className="text-muted-foreground">Country:</span> {newsletter.country}</div>}
                        {newsletter.interests.length > 0 && <div><span className="text-muted-foreground">Interests:</span> {newsletter.interests.join(', ')}</div>}
                        <div><span className="text-muted-foreground">Subscribed:</span> {new Date(newsletter.subscribedAt).toLocaleString()}</div>
                        {newsletter.unsubscribedAt && <div><span className="text-muted-foreground">Unsubscribed:</span> {new Date(newsletter.unsubscribedAt).toLocaleString()}</div>}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button onClick={handleToggle} disabled={isPending} variant={newsletter.isActive ? 'destructive' : 'default'} className="min-h-[44px]">
                            {isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Updating...</> : newsletter.isActive ? 'Deactivate' : 'Reactivate'}
                        </Button>
                        <Button variant="outline" onClick={() => router.push('/admin/newsletters')} className="min-h-[44px]">Back</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
