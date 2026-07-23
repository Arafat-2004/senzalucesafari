'use client'

import { useState, useTransition } from 'react'
import { Building2, CheckCircle2, PackageOpen, Save } from 'lucide-react'
import { toast } from 'sonner'
import { updateAccommodationCatalogPrice, updateTourCatalogPrice } from '@/app/admin/pricing/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type TourPrice = { id: string; name: string; price: number }
type AccommodationPrice = { id: string; name: string; location: string; price: number; currency: string }

export function CatalogPricingEditor({ tours, accommodations }: { tours: TourPrice[]; accommodations: AccommodationPrice[] }) {
  const [tourId, setTourId] = useState(tours[0]?.id || '')
  const [tourPrice, setTourPrice] = useState(tours[0]?.price || 0)
  const [accommodationId, setAccommodationId] = useState(accommodations[0]?.id || '')
  const [accommodationPrice, setAccommodationPrice] = useState(accommodations[0]?.price || 0)
  const [currency, setCurrency] = useState(accommodations[0]?.currency || 'USD')
  const [pending, startTransition] = useTransition()

  function saveTour() {
    if (!tourId) return
    startTransition(async () => {
      try {
        await updateTourCatalogPrice({ id: tourId, price: tourPrice, currency: 'USD' })
        toast.success('Tour starting price published and public caches refreshed')
      } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to update tour price') }
    })
  }

  function saveAccommodation() {
    if (!accommodationId) return
    startTransition(async () => {
      try {
        await updateAccommodationCatalogPrice({ id: accommodationId, price: accommodationPrice, currency })
        toast.success('Accommodation nightly rate published and public caches refreshed')
      } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to update accommodation rate') }
    })
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><PackageOpen className="h-5 w-5" />Tour package prices</CardTitle><CardDescription>Changes the “from” price shown on the public tour catalogue. This does not collect or record payment.</CardDescription></CardHeader><CardContent className="space-y-4">
        {tours.length === 0 ? <p className="text-sm text-muted-foreground">No tour packages are available.</p> : <><div className="space-y-2"><Label>Tour package</Label><Select value={tourId} onValueChange={value => { if (!value) return; const item = tours.find(tour => tour.id === value); setTourId(value); if (item) setTourPrice(item.price) }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{tours.map(tour => <SelectItem key={tour.id} value={tour.id}>{tour.name}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label htmlFor="tour-catalog-price">Advertised starting price per person (USD)</Label><Input id="tour-catalog-price" type="number" min="0" step="1" value={tourPrice} onChange={event => setTourPrice(Number(event.target.value))} /></div><Button onClick={saveTour} disabled={pending || tourPrice < 0}><Save className="mr-2 h-4 w-4" />Publish tour price</Button></>}
      </CardContent></Card>
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" />Accommodation rates</CardTitle><CardDescription>Maintains the public nightly reference rate used when preparing safari estimates.</CardDescription></CardHeader><CardContent className="space-y-4">
        {accommodations.length === 0 ? <p className="text-sm text-muted-foreground">No accommodations are available.</p> : <><div className="space-y-2"><Label>Accommodation</Label><Select value={accommodationId} onValueChange={value => { if (!value) return; const item = accommodations.find(accommodation => accommodation.id === value); setAccommodationId(value); if (item) { setAccommodationPrice(item.price); setCurrency(item.currency) } }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{accommodations.map(item => <SelectItem key={item.id} value={item.id}>{item.name} — {item.location}</SelectItem>)}</SelectContent></Select></div><div className="grid grid-cols-[1fr_120px] gap-3"><div className="space-y-2"><Label htmlFor="nightly-rate">Nightly reference rate</Label><Input id="nightly-rate" type="number" min="0" step="0.01" value={accommodationPrice} onChange={event => setAccommodationPrice(Number(event.target.value))} /></div><div className="space-y-2"><Label>Currency</Label><Select value={currency} onValueChange={value => value && setCurrency(value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['USD','EUR','GBP','TZS'].map(code => <SelectItem key={code} value={code}>{code}</SelectItem>)}</SelectContent></Select></div></div><Button onClick={saveAccommodation} disabled={pending || accommodationPrice < 0}><Save className="mr-2 h-4 w-4" />Publish nightly rate</Button></>}
            <p className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 admin-text-success" />Every published change is written to Audit Logs and refreshes the affected public pages.</p>
      </CardContent></Card>
    </div>
  )
}
