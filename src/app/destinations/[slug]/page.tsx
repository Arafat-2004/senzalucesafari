import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDestinationBySlug, getAllDestinationSlugs } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb-nav";
import { Calendar, CheckCircle, Info, Plane, Users, Leaf } from "lucide-react";
import {
    DestinationHero,
    WildlifeGrid,
    ActivityCards,
    AccommodationSection,
    ItineraryTimeline,
    FAQAccordion,
    PhotoGallery,
    RelatedDestinations,
    RelatedTours,
    DestinationSectionNav
} from "@/components/destinations";

type Props = {
    params: Promise<{ slug: string }>;
};

// Revalidate static destination detail data every hour
export const revalidate = 3600;

export async function generateStaticParams() {
    const slugs = await getAllDestinationSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const destination = await getDestinationBySlug(slug);

    if (!destination) {
        return {
            title: "Destination Not Found",
        };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    return {
        title: `${destination.name} - Senza Luce Safaris`,
        description: destination.fullDescription.substring(0, 160),
        openGraph: {
            title: `${destination.name} - Senza Luce Safaris`,
            description: destination.fullDescription.substring(0, 160),
            type: 'article',
            url: `${siteUrl}/destinations/${slug}`,
            images: [
                {
                    url: destination.imageUrl || `${siteUrl}/images/og/home.jpg`,
                    width: 1200,
                    height: 630,
                    alt: destination.name,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${destination.name} - Senza Luce Safaris`,
            description: destination.fullDescription.substring(0, 160),
            images: [destination.imageUrl || `${siteUrl}/images/og/home.jpg`],
        },
        alternates: {
            canonical: `${siteUrl}/destinations/${slug}`,
        },
    };
}

export default async function DestinationDetailPage({ params }: Props) {
    const { slug } = await params;
    const destination = await getDestinationBySlug(slug);

    if (!destination) {
        notFound();
    }

    const sections = [
        { id: "overview", title: "Overview" },
        { id: "wildlife", title: "Wildlife" },
        { id: "activities", title: "Experiences" },
        { id: "best-time", title: "Best Time to Visit" },
        { id: "accommodations", title: "Stay" },
        { id: "itineraries", title: "Itineraries" },
        { id: "tours", title: "Safari Packages" },
        { id: "gallery", title: "Gallery" },
        { id: "travel-tips", title: "Travel Info" }
    ];

    return (
        <main className="min-h-screen bg-background">
            {/* Breadcrumb Navigation */}
            <div className="bg-muted/30 border-b">
                <div className="container px-4 py-4">
                    <Breadcrumb />
                </div>
            </div>

            {/* Hero Section */}
            <DestinationHero
                name={destination.name}
                region={destination.region}
                imageUrl={destination.imageUrl}
                fullDescription={destination.shortDescription || destination.fullDescription}
                parkSize={destination.parkSize}
                elevation={destination.elevation}
                established={destination.established}
                recommendedStay={destination.recommendedStay}
            />

            <DestinationSectionNav sections={sections} />

            {/* Destination guide content */}
            <div className="destination-guide container relative px-4 py-12 md:py-16">
                <div className="mx-auto max-w-6xl">
                    <div className="space-y-12 md:space-y-16">

                        {/* Overview */}
                        <section id="overview" className="scroll-mt-24">
                            <h2 className="text-3xl font-bold text-foreground mb-6">Overview</h2>
                            <div className="prose prose-lg max-w-none">
                                {destination.fullDescription.split('\n\n').map((paragraph, idx) => (
                                    <p key={idx} className="text-muted-foreground leading-relaxed mb-4">{paragraph}</p>
                                ))}
                            </div>
                        </section>

                        {/* Wildlife */}
                        <section id="wildlife" className="scroll-mt-24">
                            <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                                <CheckCircle className="w-8 h-8 text-primary" />
                                Wildlife & Biodiversity
                            </h2>
                            <WildlifeGrid
                                bigFive={destination.bigFive}
                                keySpecies={destination.keySpecies}
                                uniqueSpecies={destination.uniqueSpecies}
                                birdWatching={destination.birdWatching}
                                wildlifeRating={destination.wildlifeRating}
                            />
                        </section>

                        {/* Activities */}
                        <section id="activities" className="scroll-mt-24">
                            <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                                <Info className="w-8 h-8 text-primary" />
                                Experiences & Activities
                            </h2>
                            <ActivityCards activities={destination.activities} />
                        </section>

                        {/* Best Time to Visit */}
                        <section id="best-time" className="scroll-mt-24">
                            <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                                <Calendar className="w-8 h-8 text-primary" />
                                Best Time to Visit
                            </h2>
                            <div className="bg-card border border-border/50 rounded-xl p-6 md:p-8">
                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-primary/5 rounded-lg p-4">
                                        <h3 className="font-semibold text-foreground mb-2">Peak Season</h3>
                                        <p className="text-sm text-muted-foreground">{destination.peakSeason}</p>
                                    </div>
                                    <div className="bg-muted rounded-lg p-4">
                                        <h3 className="font-semibold text-foreground mb-2">Low Season</h3>
                                        <p className="text-sm text-muted-foreground">{destination.lowSeason}</p>
                                    </div>
                                </div>

                                <h3 className="font-semibold text-foreground mb-4">Month-by-Month Guide</h3>
                                <div className="space-y-3">
                                    {destination.monthlyBreakdown.map((month, idx) => (
                                        <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-4 bg-muted/50 rounded-lg">
                                            <div className="flex-shrink-0 w-full sm:w-20 font-semibold text-primary">{month.month}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-foreground mb-1"><strong>Wildlife:</strong> {month.wildlife}</p>
                                                <p className="text-sm text-muted-foreground"><strong>Weather:</strong> {month.weather}</p>
                                            </div>
                                            <div className="flex-shrink-0 flex items-center gap-1 mt-2 sm:mt-0">
                                                {[...Array(5)].map((_, i) => (
                                                    <div
                                                        key={i}
                                        className={`h-2 w-2 rounded-full ${i < month.rating ? 'bg-primary' : 'bg-muted'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Accommodations */}
                        <section id="accommodations" className="scroll-mt-24">
                            <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                                <Users className="w-8 h-8 text-primary" />
                                Where to Stay
                            </h2>
                            <AccommodationSection accommodations={destination.accommodations} />
                        </section>

                        {/* Sample Itineraries */}
                        <section id="itineraries" className="scroll-mt-24">
                            <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                                <Calendar className="w-8 h-8 text-primary" />
                                Sample Itineraries
                            </h2>
                            <ItineraryTimeline itineraries={destination.sampleItineraries ?? []} />
                        </section>

                        {/* Safari Packages */}
                        <section id="tours" className="scroll-mt-24">
                            <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                                <Calendar className="w-8 h-8 text-primary" />
                                Safari Packages Including {destination.name}
                            </h2>
                            <p className="text-muted-foreground mb-6">
                                Explore our curated safari packages that include visits to {destination.name}. Each tour is carefully designed to showcase the best of this incredible destination.
                            </p>
                            <RelatedTours destinationSlug={destination.slug} />
                        </section>

                        {/* Photo Gallery */}
                        <section id="gallery" className="scroll-mt-24">
                            <h2 className="text-3xl font-bold text-foreground mb-6">Photo Gallery</h2>
                            <PhotoGallery images={destination.gallery ?? []} destinationName={destination.name} />
                        </section>

                        {/* Travel Tips */}
                        <section id="travel-tips" className="scroll-mt-24">
                            <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                                <Plane className="w-8 h-8 text-primary" />
                                Travel Info
                            </h2>

                            <div className="space-y-8">
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="bg-card border border-border/50 rounded-xl p-6">
                                        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                            <Plane className="w-5 h-5 text-primary" />
                                            By Air
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{destination.gettingThere.byAir}</p>
                                    </div>
                                    <div className="bg-card border border-border/50 rounded-xl p-6">
                                        <h3 className="font-semibold text-foreground mb-3">By Road</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{destination.gettingThere.byRoad}</p>
                                    </div>
                                    <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
                                        <h3 className="font-semibold text-foreground mb-3">Transfer Time</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{destination.gettingThere.transferTime}</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-card border border-border/50 rounded-xl p-6">
                                        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                            <Leaf className="w-5 h-5 text-primary" />
                                            Conservation Efforts
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{destination.conservation}</p>
                                    </div>
                                    <div className="bg-card border border-border/50 rounded-xl p-6">
                                        <h3 className="font-semibold text-foreground mb-3">Community Initiatives</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{destination.communityInitiatives}</p>
                                    </div>
                                </div>

                                {destination.culturalContext && (
                                    <div className="rounded-xl border border-featured/25 bg-featured/10 p-6">
                                        <h3 className="font-semibold text-foreground mb-3">Cultural Context</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{destination.culturalContext}</p>
                                        {(destination.localTribes ?? []).length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {(destination.localTribes ?? []).map((tribe, idx) => (
                                                    <span key={idx} className="rounded-full bg-featured/15 px-3 py-1 text-xs font-medium text-featured">
                                                        {tribe}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-6">
                                    {destination.travelTips.map((tipGroup, idx) => (
                                        <div key={idx} className="bg-card border border-border/50 rounded-xl p-6">
                                            <h3 className="font-semibold text-foreground mb-3">{tipGroup.category}</h3>
                                            <ul className="space-y-2">
                                                {tipGroup.tips.map((tip, tipIdx) => (
                                                    <li key={tipIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                                        <span>{tip}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-foreground mb-4">Frequently Asked Questions</h3>
                                    <FAQAccordion faqs={destination.faqs} />
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-foreground mb-4">Explore Related Destinations</h3>
                                    <RelatedDestinations destinationSlugs={destination.relatedDestinations ?? []} />
                                </div>
                            </div>
                        </section>

                        {/* CTA Section */}
                        <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 rounded-2xl p-8 md:p-12 text-center border border-primary/20">
                            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Explore {destination.name}?</h2>
                            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                                Let our expert team help you plan the perfect safari experience tailored to your interests and budget
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/enquiry">
                                    <Button size="lg">Plan Your Safari</Button>
                                </Link>
                                <Link href="/safaris-tours">
                                    <Button size="lg" variant="outline">View Tour Packages</Button>
                                </Link>
                            </div>
                        </section>
                    </div>

                </div>
            </div>
        </main>
    );
}
