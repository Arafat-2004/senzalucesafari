import { requireAdmin } from "@/lib/admin-auth"
import { AdminPageHeader } from '../components'
import { PricingSimulation } from "@/components/admin/pricing-simulation";
import { CatalogPricingEditor } from '@/components/admin/catalog-pricing-editor';
import { prisma } from '@/lib/prisma';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function PricingToolPage() {
    await requireAdmin('bookings', 'VIEW');

    const result = await Promise.all([
        prisma.tour.findMany({ select: { id: true, name: true, priceFrom: true }, orderBy: { name: 'asc' } }),
        prisma.accommodation.findMany({ where: { isActive: true }, select: { id: true, name: true, location: true, pricePerNight: true, currency: true }, orderBy: { name: 'asc' } }),
    ]).catch(() => null);

    if (!result) return <div className="space-y-6"><AdminPageHeader title="Pricing & Estimates" description="Maintain public catalogue prices and prepare private safari estimates in one place."/><div role="status" className="admin-tone-warning rounded-xl border p-4 text-sm">Catalogue pricing is temporarily unavailable while the database reconnects. No prices were changed. Refresh this page shortly.</div></div>;
    const [tours, accommodations] = result;

    const formattedTours = tours.map(t => ({
        id: t.id,
        name: t.name,
        price: t.priceFrom || 0
    }));

    const initialPrice = formattedTours.length > 0 ? formattedTours[0].price : 1500;
    const formattedAccommodations = accommodations.map(item => ({ ...item, price: Number.parseFloat(item.pricePerNight.replace(/[^0-9.]/g, '')) || 0 }));

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Pricing & Estimates"
                description="Maintain public catalogue prices and prepare private safari estimates in one place."
            />
            <div className="grid gap-3 md:grid-cols-3"><div className="rounded-xl border bg-card p-4"><p className="font-medium">1. Choose a tour</p><p className="mt-1 text-sm text-muted-foreground">This fills in the advertised starting price.</p></div><div className="rounded-xl border bg-card p-4"><p className="font-medium">2. Enter trip needs</p><p className="mt-1 text-sm text-muted-foreground">Select traveller count and accommodation comfort.</p></div><div className="rounded-xl border bg-card p-4"><p className="font-medium">3. Share an estimate</p><p className="mt-1 text-sm text-muted-foreground">Use the calculated total as guidance, then confirm externally.</p></div></div>
            <Tabs defaultValue="catalog" className="space-y-5">
                <TabsList><TabsTrigger value="catalog">Published catalogue prices</TabsTrigger><TabsTrigger value="estimate">Private estimate</TabsTrigger></TabsList>
                <TabsContent value="catalog" className="space-y-4"><div className="admin-tone-success rounded-xl border p-4 text-sm"><span className="font-semibold">Publishes to the website:</span> saved tour and accommodation prices are audited and their public caches are refreshed immediately.</div><CatalogPricingEditor tours={formattedTours} accommodations={formattedAccommodations}/></TabsContent>
                <TabsContent value="estimate" className="space-y-4"><div className="admin-tone-warning rounded-xl border p-4 text-sm"><span className="font-semibold">Estimate only:</span> this calculator does not charge customers, record a payment, or change a saved public price.</div><PricingSimulation initialPrice={initialPrice} tours={formattedTours} /></TabsContent>
            </Tabs>
        </div>
    );
}
