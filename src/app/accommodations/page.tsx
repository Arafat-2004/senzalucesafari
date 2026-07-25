import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAccommodationsByTier } from "@/lib/db";
import type { AccommodationOption } from "@/types/accommodations";
import { Star, MapPin, CheckCircle2, ArrowRight, Crown, Gem, Tent } from "lucide-react";
import { HeroSection } from "@/components/ui/hero-section";
import { Button } from "@/components/ui/button";
import { AccommodationCard } from "./components/accommodation-card";

export const metadata: Metadata = {
    title: "Safari Accommodations - Luxury to Budget | Senza Luce Safari",
    description: "Discover Tanzania's finest safari accommodations from ultra-luxury lodges to budget-friendly camps. Find the perfect stay for your African adventure.",
};

// Revalidate static accommodation data every hour
export const revalidate = 3600;

export default async function AccommodationsPage() {
    const luxuryAccommodations = await getAccommodationsByTier('luxury');
    const midrangeAccommodations = await getAccommodationsByTier('midrange');
    const budgetAccommodations = await getAccommodationsByTier('budget');

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section - Upgraded with targeted bottom-up contrast gradient overlay */}
            <HeroSection
                title="Where Wilderness Meets Comfort"
                subtitle="From opulent lodges perched on crater rims to authentic bush camps under starlit skies. Your sanctuary in the heart of Africa awaits."
                backgroundImage="/images/accommodations/luxury/luxury-lodge.jpg"
                ctaText="View All Options"
                ctaLink="#luxury"
                overlayStyle={{ background: 'linear-gradient(to top, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.25))' }}
            />

            {/* Introduction */}
            <section className="container py-12 sm:py-16 md:py-20 lg:py-24">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4 font-semibold text-xs tracking-wider">
                        Find Your Perfect Stay
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Accommodations for Every Dream</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                        Tanzania offers an extraordinary range of accommodations to suit every preference and budget.
                        Whether you dream of waking up to champagne breakfasts overlooking the Serengeti plains or
                        prefer the authentic experience of sleeping under canvas surrounded by the sounds of the wild,
                        we have curated the finest options across three distinct tiers.
                    </p>

                    {/* Quick Navigation */}
                    <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                        <Link href="#luxury" className="tone-featured group block rounded-2xl border-2 p-6 transition-all hover:brightness-95">
                            <Crown className="mx-auto mb-3 h-8 w-8 transition-transform group-hover:scale-110" />
                            <h3 className="font-bold text-foreground mb-1">Luxury Lodges</h3>
                            <p className="text-sm text-muted-foreground">$1,500+ per night</p>
                        </Link>
                        <Link href="#midrange" className="tone-info group block rounded-2xl border-2 p-6 transition-all hover:brightness-95">
                            <Gem className="mx-auto mb-3 h-8 w-8 transition-transform group-hover:scale-110" />
                            <h3 className="font-bold text-foreground mb-1">Mid-Range Comfort</h3>
                            <p className="text-sm text-muted-foreground">$300-$700 per night</p>
                        </Link>
                        <Link href="#budget" className="tone-success group block rounded-2xl border-2 p-6 transition-all hover:brightness-95">
                            <Tent className="mx-auto mb-3 h-8 w-8 transition-transform group-hover:scale-110" />
                            <h3 className="font-bold text-foreground mb-1">Budget-Friendly</h3>
                            <p className="text-sm text-muted-foreground">$30-$350 per night</p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Luxury Section */}
            <section id="luxury" className="scroll-mt-20 bg-muted/15 py-12 sm:py-16 md:py-20 lg:py-24">
                <div className="container">
                    <div className="text-center mb-12">
                        {/* Subtitles styled cleanly as italics without raw markdown asterisks */}
                        <div className="tone-featured mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold italic tracking-wider">
                            <Crown className="w-4 h-4" />
                            <span>PREMIUM LUXURY</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Luxury Lodges & Tented Camps</h2>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            Indulge in unparalleled elegance where every detail is crafted for perfection.
                            Private butlers, infinity pools, gourmet dining, and front-row seats to nature&apos;s greatest spectacle.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {luxuryAccommodations.map((accommodation) => (
                            <AccommodationCard key={accommodation.id} accommodation={accommodation} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Mid-Range Section */}
            <section id="midrange" className="scroll-mt-20 py-12 sm:py-16 md:py-20 lg:py-24">
                <div className="container">
                    <div className="text-center mb-12">
                        <div className="tone-info mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold italic tracking-wider">
                            <Gem className="w-4 h-4" />
                            <span>PERFECT BALANCE</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Mid-Range Comfort</h2>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            Experience the best of both worlds with comfortable lodges offering excellent amenities,
                            reliable service, and prime locations without the premium price tag.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {midrangeAccommodations.map((accommodation) => (
                            <AccommodationCard key={accommodation.id} accommodation={accommodation} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Budget Section */}
            <section id="budget" className="scroll-mt-20 bg-muted/15 py-12 sm:py-16 md:py-20 lg:py-24">
                <div className="container">
                    <div className="text-center mb-12">
                        <div className="tone-success mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold italic tracking-wider">
                            <Tent className="w-4 h-4" />
                            <span>AUTHENTIC ADVENTURE</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Budget-Friendly Options</h2>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            Don&apos;t compromise on the safari experience. Our budget options offer clean, comfortable
                            accommodations with genuine bush atmosphere and exceptional value for money.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {budgetAccommodations.map((accommodation) => (
                            <AccommodationCard key={accommodation.id} accommodation={accommodation} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="container py-12 sm:py-16 md:py-20 lg:py-24">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Quick Comparison</h2>
                    <p className="text-muted-foreground">Find the tier that matches your safari dreams</p>
                </div>

                <div className="table-scroll">
                    {/* min-w-[700px] protects grid structure on mobile screens */}
                    <table className="w-full min-w-[700px] border-collapse">
                        <thead>
                            <tr className="border-b-2 border-border">
                                <th className="text-left p-4 font-bold">Feature</th>
                                <th className="text-center p-4">
                                    <div className="flex flex-col items-center">
                                        <Crown className="mb-2 h-6 w-6 text-featured" />
                                        <span className="font-bold">Luxury</span>
                                    </div>
                                </th>
                                <th className="text-center p-4">
                                    <div className="flex flex-col items-center">
                                        <Gem className="mb-2 h-6 w-6 text-info" />
                                        <span className="font-bold">Mid-Range</span>
                                    </div>
                                </th>
                                <th className="text-center p-4">
                                    <div className="flex flex-col items-center">
                                        <Tent className="mb-2 h-6 w-6 text-success" />
                                        <span className="font-bold">Budget</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <ComparisonRow feature="Price Range" luxury="$1,500-$4,000+" midrange="$300-$700" budget="$30-$350" />
                            <ComparisonRow feature="Room Type" luxury="Suites & Villas" midrange="Standard Rooms" budget="Tents & Basic Rooms" />
                            <ComparisonRow feature="Service Level" luxury="Butler & Maid" midrange="Professional Staff" budget="Friendly Service" />
                            <ComparisonRow feature="Dining" luxury="Gourmet & Private" midrange="Restaurant & Bar" budget="Communal Dining" />
                            <ComparisonRow feature="Amenities" luxury="Spa, Pool, WiFi" midrange="Pool, Restaurant" budget="Basic Facilities" />
                            <ComparisonRow feature="Game Drives" luxury="Private Vehicles" midrange="Shared Vehicles" budget="Group Activities" />
                            <ComparisonRow feature="Best For" luxury="Honeymoons, Special Occasions" midrange="Families, First-Timers" budget="Adventurers, Students" />
                        </tbody>
                    </table>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-muted/20 py-16 md:py-24">
                <div className="container px-4 text-center">
                    <h2 className="mb-6 text-3xl font-bold text-foreground md:text-5xl">Ready to Find Your Perfect Safari Lodge?</h2>
                    <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
                        Let our experts help you find the perfect accommodation for your Tanzanian adventure.
                        We&apos;ll match your preferences, budget, and travel dates with the ideal property.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" variant="safari" nativeButton={false} render={<Link href="/enquiry" className="inline-flex items-center" />}>
                            Get Personalized Recommendations
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/enquiry" className="inline-flex items-center" />}>
                            Request Custom Quote
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}

// Comparison Row Component
function ComparisonRow({ feature, luxury, midrange, budget }: { feature: string; luxury: string; midrange: string; budget: string }) {
    return (
        <tr className="border-b border-border hover:bg-muted/50 transition-colors">
            <td className="p-4 font-semibold text-foreground">{feature}</td>
            <td className="p-4 text-center text-muted-foreground">{luxury}</td>
            <td className="p-4 text-center text-muted-foreground">{midrange}</td>
            <td className="p-4 text-center text-muted-foreground">{budget}</td>
        </tr>
    );
}
