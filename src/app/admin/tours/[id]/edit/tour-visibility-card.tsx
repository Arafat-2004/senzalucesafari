'use client'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Tour } from '@/generated/prisma/client'
import { setTourFeatured, setTourVisibility } from '../../actions'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

export function TourVisibilityCard({ tour }: { tour: Tour }) {
 const [pending, startTransition] = useTransition(); const router = useRouter()
 const change = (kind: 'live'|'featured') => startTransition(async()=>{try { if(kind==='live') await setTourVisibility(tour.id,!tour.isActive); else await setTourFeatured(tour.id,!tour.isFeatured); toast.success(kind==='live' ? (tour.isActive?'Tour returned to draft':'Tour published') : (tour.isFeatured?'Removed from featured tours':'Tour featured')); router.refresh() } catch(e){toast.error(e instanceof Error?e.message:'Unable to update tour')}})
    return <Card className={tour.isActive?'border-[var(--tone-success-border)]':'border-[var(--tone-warning-border)]'}><CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"><div><div className="flex flex-wrap gap-2"><Badge variant={tour.isActive?'success':'draft'}>{tour.isActive?'Published':'Draft'}</Badge>{tour.isFeatured&&<Badge variant="featured"><Sparkles className="mr-1 h-3 w-3"/>Featured</Badge>}</div><p className="mt-2 text-sm text-muted-foreground">Save package changes first. Publishing controls public visibility; featuring controls homepage promotion.</p></div><div className="flex flex-wrap gap-2">{tour.isActive&&<Button type="button" variant="outline" onClick={()=>change('featured')} disabled={pending}>{tour.isFeatured?'Remove feature':'Feature tour'}</Button>}<Button type="button" onClick={()=>change('live')} variant={tour.isActive?'outline':'default'} disabled={pending}>{pending&&<Loader2 className="h-4 w-4 animate-spin"/>}{tour.isActive?'Return to draft':'Publish tour'}</Button></div></CardContent></Card>
}
