import { Metadata } from "next";
import { HeroSection } from "@/components/ui/hero-section";
import { getAllTours } from "@/lib/db";

import { ToursContent } from "./tours-content";

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
            <ToursContent tours={tours} />
        </div>
    );
}
