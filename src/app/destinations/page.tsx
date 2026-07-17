import { Metadata } from "next";
import Link from 'next/link';
import Image from "next/image";
import { getMainDestinations } from "@/lib/db";
import { DestinationCard } from "@/components/ui/destination-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mountain, PawPrint } from "lucide-react";
import { HeroSection } from "@/components/ui/hero-section";
import { StaggerContainer, StaggerItem, SlideInLeft, SlideInRight } from "@/components/ui/scroll-animation";

export const metadata: Metadata = {
    title: "Destinations - Senza Luce Safaris",
    description: "Explore Tanzania's most iconic safari destinations including Serengeti, Ngorongoro, Tarangire, and Zanzibar.",
};

// Revalidate static destination data every hour
export const revalidate = 3600;

export default async function DestinationsPage() {
    const destinations = await getMainDestinations();

    const safariDestinations = destinations.filter(d => d.slug !== 'zanzibar' && d.slug !== 'ngorongoro');
    const islandDestinations = destinations.filter(d => d.slug === 'zanzibar');
    const featuredDestination = destinations.find(d => d.slug === 'ngorongoro') || destinations[1];

    // Define badges for each destination based on Tanview style
    const getDestinationBadge = (slug: string) => {
        const badges: Record<string, string> = {
            'serengeti': 'Great Migration',
            'ngorongoro': 'World Heritage Site',
            'tarangire': 'Elephant Haven',
            'lake-manyara': 'Tree-Climbing Lions',
            'zanzibar': 'Spice Island'
        };
        return badges[slug];
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section with Background Image */}
            <HeroSection
                title="Discover Tanzania's Iconic Destinations"
                subtitle="From the endless plains of Serengeti to the pristine beaches of Zanzibar, explore nature's most spectacular settings"
                backgroundImage="/images/destinations/serengeti/serengeti.jpg"
                ctaText="Explore Destinations"
                ctaLink="#destinations-grid"
            />

            {/* The Northern Circuit Section */}
            <section id="destinations-grid" className="container py-12 sm:py-16 md:py-20 lg:py-24">
                <div className="text-center mb-10 sm:mb-12">
                    <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
                        Northern Circuit
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 px-2">Tanzania&apos;s Premier Safari Destinations</h2>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
                        Experience the world&apos;s most renowned wildlife destinations in Tanzania&apos;s Northern Circuit
                    </p>
                </div>

                {/* Destinations Grid */}
                <StaggerContainer staggerDelay={0.1}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {safariDestinations.map((destination) => (
                            <StaggerItem key={destination.id}>
                                <DestinationCard
                                    name={destination.name}
                                    slug={destination.slug}
                                    imageUrl={destination.imageUrl}
                                    region={destination.region}
                                    shortDescription={destination.shortDescription}
                                    highlights={destination.highlights}
                                    bestTimeToGo={destination.bestTimeToGo}
                                    badge={getDestinationBadge(destination.slug)}
                                />
                            </StaggerItem>
                        ))}
                    </div>
                </StaggerContainer>
            </section>

            {/* Coastal Extensions Section - Human-centered Beach category */}
            <section className="container pb-12 sm:pb-16 md:pb-20 lg:pb-24">
                <div className="text-center mb-10 sm:mb-12">
                    <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
                        Coastal Extensions
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 px-2">Tropical Island Escapes</h2>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
                        Conclude your wilderness safari with white sands, turquoise waters, and rich spice culture on Zanzibar Island
                    </p>
                </div>

                {/* Zanzibar Feature Layout */}
                <div className="max-w-5xl mx-auto">
                    {islandDestinations.map((destination) => (
                        <DestinationCard
                            key={destination.id}
                            name={destination.name}
                            slug={destination.slug}
                            imageUrl={destination.imageUrl}
                            region={destination.region}
                            shortDescription={destination.shortDescription}
                            highlights={destination.highlights}
                            bestTimeToGo={destination.bestTimeToGo}
                            badge={getDestinationBadge(destination.slug)}
                            isFeatured={true}
                        />
                    ))}
                </div>
            </section>

            {/* Featured Destination - Ngorongoro Crater (No duplication fatigue) */}
            <section className="container py-12 sm:py-16 md:py-20 lg:py-24 border-t border-border/40 bg-muted/10">
                <div className="bg-secondary/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-border/40">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
                        <SlideInLeft>
                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted">
                                <Image
                                    src={featuredDestination?.imageUrl || "/images/destinations/ngorongoro/ngorongoro.jpg"}
                                    alt={featuredDestination?.name || "Ngorongoro Crater"}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover"
                                />
                            </div>
                        </SlideInLeft>
                        <SlideInRight delay={0.2}>
                            <div className="space-y-6">
                                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                                    Featured Destination
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold">{featuredDestination?.name || "Ngorongoro Crater"}</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    {featuredDestination?.shortDescription || "The world's largest inactive volcanic caldera and a UNESCO World Heritage Site. This natural wonder hosts over 25,000 large animals."}
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <span className="px-3 py-1.5 bg-card rounded-full text-sm font-medium shadow-sm flex items-center gap-1.5">
                                        <Mountain className="w-4 h-4 text-primary" />
                                        600m Deep Caldera
                                    </span>
                                    <span className="px-3 py-1.5 bg-card rounded-full text-sm font-medium shadow-sm flex items-center gap-1.5">
                                        <PawPrint className="w-4 h-4 text-primary" />
                                        25,000+ Animals
                                    </span>
                                    <span className="px-3 py-1.5 bg-card rounded-full text-sm font-medium shadow-sm flex items-center gap-1.5">
                                        <PawPrint className="w-4 h-4 text-primary" />
                                        Black Rhino Sanctuary
                                    </span>
                                </div>
                                <Button variant="safari" className="mt-4" nativeButton={false} render={<Link href={`/destinations/${featuredDestination?.slug || 'ngorongoro'}`} />}>
                                    <span className="inline-flex items-center font-semibold">
                                        Explore {featuredDestination?.name.split(' ')[0] || "Ngorongoro"}
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </span>
                                </Button>
                            </div>
                        </SlideInRight>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="container py-12 sm:py-16 md:py-20 lg:py-24">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {[
                        { value: '6+', label: 'National Parks' },
                        { value: '1.5M+', label: 'Migrating Wildebeest' },
                        { value: '550+', label: 'Bird Species' },
                        { value: '25K+', label: 'Crater Animals' },
                        { value: '99%', label: 'Guest Satisfaction' }
                    ].map((stat, index) => (
                        <div key={index} className="text-center p-6 bg-secondary/20 rounded-2xl">
                            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="container py-12 sm:py-16 md:py-20 lg:py-24 text-center bg-primary rounded-3xl text-white">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Explore These Destinations?</h2>
                <p className="text-base md:text-lg mb-6 opacity-90 max-w-2xl mx-auto">
                    Let us create a personalized safari itinerary that includes these incredible destinations
                </p>
                <Button className="bg-white text-primary hover:bg-gray-100 font-semibold">
                    <Link href="/enquiry">Contact Us Today</Link>
                </Button>
            </section>
        </div>
    );
}
