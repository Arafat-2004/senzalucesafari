import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAccommodationsByTier } from "@/lib/db";
import type { AccommodationOption } from "@/types/accommodations";
import { Star, MapPin, CheckCircle2, ArrowRight, Crown, Gem, Tent } from "lucide-react";
import { HeroSection } from "@/components/ui/hero-section";

export const metadata: Metadata = {
    title: "Safari Accommodations - Luxury to Budget | Senza Luce Safaris",
    description: "Discover Tanzania's finest safari accommodations from ultra-luxury lodges to budget-friendly camps. Find the perfect stay for your African adventure.",
};

// Revalidate static accommodation data every hour
export const revalidate = 3600;

export default async function AccommodationsPage() {
    const luxuryAccommodations = await getAccommodationsByTier('luxury');
    const midrangeAccommodations = await getAccommodationsByTier('midrange');
    const budgetAccommodations = await getAccommodationsByTier('budget');

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <HeroSection
                title="Where Wilderness Meets Comfort"
                subtitle="From opulent lodges perched on crater rims to authentic bush camps under starlit skies. Your sanctuary in the heart of Africa awaits."
                backgroundImage="/images/accommodations/luxury/luxury-lodge.jpg"
                ctaText="View All Options"
                ctaLink="#luxury"
            />

            {/* Introduction */}
            <section className="container py-12 sm:py-16 md:py-20 lg:py-24">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
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
                        <Link href="#luxury" className="group block p-6 border-2 border-amber-200 dark:border-amber-800 rounded-2xl hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all">
                            <Crown className="w-8 h-8 text-amber-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="font-bold text-foreground mb-1">Luxury Lodges</h3>
                            <p className="text-sm text-muted-foreground">$1,500+ per night</p>
                        </Link>
                        <Link href="#midrange" className="group block p-6 border-2 border-blue-200 dark:border-blue-800 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all">
                            <Gem className="w-8 h-8 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="font-bold text-foreground mb-1">Mid-Range Comfort</h3>
                            <p className="text-sm text-muted-foreground">$300-$700 per night</p>
                        </Link>
                        <Link href="#budget" className="group block p-6 border-2 border-green-200 dark:border-green-800 rounded-2xl hover:bg-green-50 dark:hover:bg-green-950/30 transition-all">
                            <Tent className="w-8 h-8 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="font-bold text-foreground mb-1">Budget-Friendly</h3>
                            <p className="text-sm text-muted-foreground">$30-$350 per night</p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Luxury Section */}
            <section id="luxury" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-amber-50/50 to-transparent dark:from-amber-950/20 scroll-mt-20">
                <div className="container">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 rounded-full mb-4">
                            <Crown className="w-5 h-5" />
                            <span className="font-semibold">PREMIUM LUXURY</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Luxury Lodges & Tented Camps</h2>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            Indulge in unparalleled elegance where every detail is crafted for perfection.
                            Private butlers, infinity pools, gourmet dining, and front-row seats to nature&apos;s greatest spectacle.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {luxuryAccommodations.map((accommodation) => (
                            <LuxuryCard key={accommodation.id} accommodation={accommodation} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Mid-Range Section */}
            <section id="midrange" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/20 scroll-mt-20">
                <div className="container">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full mb-4">
                            <Gem className="w-5 h-5" />
                            <span className="font-semibold">PERFECT BALANCE</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Mid-Range Comfort</h2>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            Experience the best of both worlds with comfortable lodges offering excellent amenities,
                            reliable service, and prime locations without the premium price tag.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {midrangeAccommodations.map((accommodation) => (
                            <MidRangeCard key={accommodation.id} accommodation={accommodation} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Budget Section */}
            <section id="budget" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-green-50/50 to-transparent dark:from-green-950/20 scroll-mt-20">
                <div className="container">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full mb-4">
                            <Tent className="w-5 h-5" />
                            <span className="font-semibold">AUTHENTIC ADVENTURE</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Budget-Friendly Options</h2>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            Don&apos;t compromise on the safari experience. Our budget options offer clean, comfortable
                            accommodations with genuine bush atmosphere and exceptional value for money.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {budgetAccommodations.map((accommodation) => (
                            <BudgetCard key={accommodation.id} accommodation={accommodation} />
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

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b-2 border-border">
                                <th className="text-left p-4 font-bold">Feature</th>
                                <th className="text-center p-4">
                                    <div className="flex flex-col items-center">
                                        <Crown className="w-6 h-6 text-amber-600 mb-2" />
                                        <span className="font-bold">Luxury</span>
                                    </div>
                                </th>
                                <th className="text-center p-4">
                                    <div className="flex flex-col items-center">
                                        <Gem className="w-6 h-6 text-blue-600 mb-2" />
                                        <span className="font-bold">Mid-Range</span>
                                    </div>
                                </th>
                                <th className="text-center p-4">
                                    <div className="flex flex-col items-center">
                                        <Tent className="w-6 h-6 text-green-600 mb-2" />
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
            <section className="container py-16 md:py-24">
                <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-8 md:p-16 text-center text-white">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Find Your Perfect Safari Lodge?</h2>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
                        Let our experts help you find the perfect accommodation for your Tanzanian adventure.
                        We&apos;ll match your preferences, budget, and travel dates with the ideal property.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/contact" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-11 px-8 text-lg">
                            Get Personalized Recommendations
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                        <Link href="/enquiry" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 text-lg bg-white/10 border-white/30 hover:bg-white/20 text-white">
                            Request Custom Quote
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

// Luxury Card Component
function LuxuryCard({ accommodation }: { accommodation: AccommodationOption }) {
    return (
        <div className="bg-card rounded-3xl overflow-hidden shadow-xl border border-amber-200 dark:border-amber-800">
            <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative aspect-video lg:aspect-auto">
                    <Image
                        src={accommodation.image}
                        alt={accommodation.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute top-4 left-4">
                        <div className="bg-amber-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2">
                            <Crown className="w-5 h-5" />
                            LUXURY
                        </div>
                    </div>
                </div>
                <div className="p-8 lg:p-10 space-y-6">
                    <div>
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-2xl md:text-3xl font-bold text-foreground">{accommodation.name}</h3>
                            <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full">
                                <Star className="w-4 h-4 text-amber-600 fill-current" />
                                <span className="font-bold text-amber-700 dark:text-amber-400">{accommodation.rating}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-4">
                            <MapPin className="w-4 h-4" />
                            <span>{accommodation.location}</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{accommodation.description}</p>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-amber-800 dark:text-amber-400">Starting from</span>
                            <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">{accommodation.pricePerNight}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{accommodation.priceRange}</p>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                            Premium Features
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            {accommodation.features.slice(0, 6).map((feature: string, idx: number) => (
                                <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-3">Perfect For</h4>
                        <div className="flex flex-wrap gap-2">
                            {accommodation.bestFor.map((item: string, idx: number) => (
                                <span key={idx} className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 rounded-full text-sm font-medium">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                    <Link href="/enquiry" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 min-h-[44px] h-11 px-4 py-2 w-full bg-amber-600 hover:bg-amber-700 text-white">
                        Inquire About This Lodge
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Mid-Range Card Component
function MidRangeCard({ accommodation }: { accommodation: AccommodationOption }) {
    return (
        <div className="bg-card rounded-2xl overflow-hidden shadow-lg border border-blue-200 dark:border-blue-800 hover:shadow-xl transition-shadow">
            <div className="relative aspect-video">
                <Image
                    src={accommodation.image}
                    alt={accommodation.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-3 left-3">
                    <div className="bg-blue-500 text-white px-3 py-1.5 rounded-full font-semibold text-sm flex items-center gap-1.5">
                        <Gem className="w-4 h-4" />
                        MID-RANGE
                    </div>
                </div>
            </div>
            <div className="p-6 space-y-4">
                <div>
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-foreground">{accommodation.name}</h3>
                        <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                            <Star className="w-3.5 h-3.5 text-blue-600 fill-current" />
                            <span className="font-semibold text-blue-700 dark:text-blue-400 text-sm">{accommodation.rating}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-3">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{accommodation.location}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{accommodation.description}</p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-blue-800 dark:text-blue-400">From</span>
                        <span className="text-lg font-bold text-blue-700 dark:text-blue-300">{accommodation.pricePerNight}</span>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-foreground text-sm mb-2">Key Features</h4>
                    <ul className="space-y-1.5">
                        {accommodation.features.slice(0, 4).map((feature: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                                <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <Link href="/enquiry" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground min-h-[44px] h-11 px-4 py-2 w-full border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30">
                    Learn More
                </Link>
            </div>
        </div>
    );
}

// Budget Card Component
function BudgetCard({ accommodation }: { accommodation: AccommodationOption }) {
    return (
        <div className="bg-card rounded-2xl overflow-hidden shadow-lg border border-green-200 dark:border-green-800 hover:shadow-xl transition-shadow">
            <div className="relative aspect-video">
                <Image
                    src={accommodation.image}
                    alt={accommodation.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-3 left-3">
                    <div className="bg-green-500 text-white px-3 py-1.5 rounded-full font-semibold text-sm flex items-center gap-1.5">
                        <Tent className="w-4 h-4" />
                        BUDGET
                    </div>
                </div>
            </div>
            <div className="p-6 space-y-4">
                <div>
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-foreground">{accommodation.name}</h3>
                        <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                            <Star className="w-3.5 h-3.5 text-green-600 fill-current" />
                            <span className="font-semibold text-green-700 dark:text-green-400 text-sm">{accommodation.rating}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-3">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{accommodation.location}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{accommodation.description}</p>
                </div>

                <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3 border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-green-800 dark:text-green-400">From</span>
                        <span className="text-lg font-bold text-green-700 dark:text-green-300">{accommodation.pricePerNight}</span>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-foreground text-sm mb-2">Highlights</h4>
                    <ul className="space-y-1.5">
                        {accommodation.highlights.slice(0, 3).map((highlight: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                                <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                                <span>{highlight}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <Link href="/enquiry" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground min-h-[44px] h-11 px-4 py-2 w-full border-green-300 hover:bg-green-50 dark:hover:bg-green-950/30">
                    View Details
                </Link>
            </div>
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
