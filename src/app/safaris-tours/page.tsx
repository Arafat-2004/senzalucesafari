import { Metadata } from "next";
import { Suspense } from "react";
import { HeroSection } from "@/components/ui/hero-section";
import { getAllTours } from "@/lib/db";
import { ToursContent } from "./tours-content";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
    title: "Safari & Tours - Senza Luce Safari",
    description: "Discover our curated Tanzania safari packages including wildlife safaris, beach holidays, and Kilimanjaro treks.",
};

// Revalidate static tour data every hour
export const revalidate = 3600;

function TourGridSkeleton() {
    return (
        <div id="tours-section" className="container py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="rounded-2xl border border-border bg-card p-4 space-y-4">
                        <Skeleton className="h-48 w-full rounded-xl" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <div className="flex justify-between items-center pt-2">
                            <Skeleton className="h-6 w-1/4" />
                            <Skeleton className="h-9 w-1/3 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default async function ToursPage() {
    const tours = await getAllTours();

    return (
        <div className="min-h-screen">
            {/* Hero Section with Background Image */}
            <HeroSection
                title="Unforgettable Safari Adventures"
                subtitle="Curated Tanzania safari packages from wildlife expeditions to beach holidays and Kilimanjaro treks"
                backgroundImage="/images/safaris/serengeti-migration.jpg"
                ctaText="Explore Our Tours"
                ctaLink="#tours-section"
            />

            {/* Client Component with Interactive Features */}
            <Suspense fallback={<TourGridSkeleton />}>
                <ToursContent tours={tours} />
            </Suspense>
            
            {/* JSON-LD for SEO: Tour listing (directly in SSR HTML) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        "itemListElement": tours.map((t, idx) => ({
                            "@type": "ListItem",
                            "position": idx + 1,
                            "name": t.name,
                            "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://senzalucesafari.com'}/safaris-tours/${t.slug}`,
                        }))
                    })
                }}
            />
        </div>
    );
}
