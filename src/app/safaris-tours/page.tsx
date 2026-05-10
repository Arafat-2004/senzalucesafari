import { Metadata } from "next";
import { Suspense } from "react";
import { HeroSection } from "@/components/ui/hero-section";
import { getAllTours } from "@/lib/db";

import { ToursContent } from "./tours-content";
import Script from 'next/script';

export const metadata: Metadata = {
    title: "Safari & Tours - Senza Luce Safaris",
    description: "Discover our curated Tanzania safari packages including wildlife safaris, beach holidays, and Kilimanjaro treks.",
};

// Revalidate static tour data every hour
export const revalidate = 3600;

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
            <Suspense fallback={null}>
                <ToursContent tours={tours} />
            </Suspense>
            {/* JSON-LD for SEO: Tour listing */}
            <Script id="tour-list-json-ld" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "itemListElement": tours.map((t, idx) => ({
                "@type": "ListItem",
                "position": idx + 1,
                "name": t.name,
                "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com'}/safaris-tours/${t.slug}`,
              }))
            }) }} />
        </div>
    );
}
