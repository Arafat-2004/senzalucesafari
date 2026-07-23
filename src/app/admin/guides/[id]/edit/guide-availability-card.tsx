'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Guide } from '@/generated/prisma/client'
import { setGuideActive } from '../../actions'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, UserCheck, UserX } from 'lucide-react'
import { toast } from 'sonner'

export function GuideAvailabilityCard({ guide }: { guide: Guide }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    function changeAvailability() {
        startTransition(async () => {
            try {
                await setGuideActive(guide.id, !guide.isActive)
                toast.success(guide.isActive ? 'Guide marked unavailable' : 'Guide available for assignment')
                router.refresh()
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Unable to update availability')
            }
        })
    }
    return <Card className={guide.isActive ? 'border-[var(--tone-success-border)]' : 'border-[var(--tone-warning-border)]'}><CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2"><p className="font-semibold">{guide.isActive ? 'Available for booking assignments' : 'Unavailable for booking assignments'}</p><Badge variant={guide.isActive ? 'success' : 'warning'}>{guide.isActive ? 'Available' : 'Unavailable'}</Badge></div><p className="mt-1 text-sm text-muted-foreground">This status controls the guide selector in booking management. It does not publish a public profile.</p></div><Button type="button" variant={guide.isActive ? 'outline' : 'default'} onClick={changeAvailability} disabled={isPending}>{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : guide.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}{guide.isActive ? 'Mark unavailable' : 'Make available'}</Button></CardContent></Card>
}
