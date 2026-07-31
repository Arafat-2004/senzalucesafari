"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    Info,
    PawPrint,
    Sparkles,
    CalendarDays,
    TentTree,
    Route,
    MapPin,
    CheckCircle,
    Calendar,
    Users,
    Compass,
    Plane,
    Map,
    Clock,
    Leaf,
} from "lucide-react";

import { Destination } from "@/types/destinations";
import WildlifeGrid from "./WildlifeGrid";
import ActivityCards from "./ActivityCards";
import AccommodationSection from "./AccommodationSection";
import ItineraryTimeline from "./ItineraryTimeline";
import FAQAccordion from "./FAQAccordion";
import PhotoGallery from "./PhotoGallery";
import { Button } from "@/components/ui/button";

interface DestinationTabsClientProps {
    destination: Destination;
    relatedToursNode: React.ReactNode;
    relatedDestinationsNode: React.ReactNode;
}

const VALID_TABS = [
    "overview",
    "wildlife",
    "experiences",
    "best-time",
    "accommodations",
    "itineraries",
    "travel-info",
];

const TABS = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "wildlife", label: "Wildlife", icon: PawPrint },
    { id: "experiences", label: "Experiences", icon: Sparkles },
    { id: "best-time", label: "Best Time to Visit", icon: CalendarDays },
    { id: "accommodations", label: "Accommodations", icon: TentTree },
    { id: "itineraries", label: "Itineraries", icon: Route },
    { id: "travel-info", label: "Travel Info", icon: MapPin },
];

export default function DestinationTabsClient({
    destination,
    relatedToursNode,
    relatedDestinationsNode,
}: DestinationTabsClientProps) {
    const searchParams = useSearchParams();
    const initialTab = searchParams.get("tab");
    const [activeTab, setActiveTab] = useState<string>(
        initialTab && VALID_TABS.includes(initialTab) ? initialTab : "overview"
    );
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tabFromUrl = searchParams.get("tab");
        if (tabFromUrl && VALID_TABS.includes(tabFromUrl)) {
            setActiveTab(tabFromUrl);
        }
    }, [searchParams]);

    const handleTabChange = (tabId: string) => {
        if (!VALID_TABS.includes(tabId)) return;
        setActiveTab(tabId);

        const url = new URL(window.location.href);
        url.searchParams.set("tab", tabId);
        window.history.replaceState(null, "", url.pathname + url.search);

        if (containerRef.current && typeof containerRef.current.scrollIntoView === "function") {
            const rect = containerRef.current.getBoundingClientRect();
            if (rect.top < 0) {
                containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    };

    return (
        <div ref={containerRef} className="scroll-mt-20">
            {/* Sticky Blurred Tab Bar */}
            <nav
                className="sticky top-16 sm:top-20 z-40 bg-background/95 backdrop-blur-xl border-y border-border/70 shadow-sm"
                aria-label="Destination section tabs"
            >
                <div className="container px-0 sm:px-4">
                    <div className="flex overflow-x-auto snap-x scrollbar-hide py-2 px-4 gap-2 items-center">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const active = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => handleTabChange(tab.id)}
                                    aria-selected={active}
                                    aria-controls={`panel-${tab.id}`}
                                    id={`tab-${tab.id}`}
                                    role="tab"
                                    className={`flex min-w-max snap-center items-center gap-2 px-4 py-2 text-sm transition-all duration-200 ${
                                        active
                                            ? "bg-primary text-primary-foreground shadow-md rounded-xl font-bold"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl font-medium"
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* Tab Panel Content */}
            <div className="destination-guide container relative px-4 py-10 md:py-14">
                <div className="mx-auto max-w-6xl">
                    {/* Tab 1: Overview */}
                    {activeTab === "overview" && (
                        <div
                            id="panel-overview"
                            role="tabpanel"
                            aria-labelledby="tab-overview"
                            className="space-y-10 animate-in fade-in-50 duration-200"
                        >
                            <div>
                                <h2 className="text-3xl font-bold text-foreground mb-6">Overview</h2>
                                <div className="prose prose-lg max-w-none">
                                    {destination.fullDescription.split("\n\n").map((paragraph, idx) => (
                                        <p key={idx} className="text-muted-foreground leading-relaxed mb-4">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {(destination.whyVisit || (destination.highlights && destination.highlights.length > 0)) && (
                                <div className="grid md:grid-cols-2 gap-6 pt-2">
                                    {destination.whyVisit && (
                                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                                            <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                                                <Sparkles className="w-5 h-5 text-primary" />
                                                Why Visit {destination.name}
                                            </h3>
                                            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                                                {destination.whyVisit}
                                            </p>
                                        </div>
                                    )}
                                    {destination.highlights && destination.highlights.length > 0 && (
                                        <div className="bg-card border border-border/50 rounded-2xl p-6">
                                            <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5 text-primary" />
                                                Key Highlights
                                            </h3>
                                            <ul className="space-y-2.5">
                                                {destination.highlights.map((highlight, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm md:text-base text-muted-foreground">
                                                        <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                                        <span>{highlight}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="bg-card border border-border/60 rounded-2xl p-6 md:p-8 shadow-sm">
                                <h3 className="text-xl font-bold text-foreground mb-6">Quick Stats Summary</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    <div className="bg-muted/40 rounded-xl p-4">
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Region</p>
                                        <p className="text-base font-bold text-foreground mt-1">{destination.region}</p>
                                    </div>
                                    <div className="bg-muted/40 rounded-xl p-4">
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Park Size</p>
                                        <p className="text-base font-bold text-foreground mt-1">{destination.parkSize}</p>
                                    </div>
                                    <div className="bg-muted/40 rounded-xl p-4">
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Established</p>
                                        <p className="text-base font-bold text-foreground mt-1">{destination.established}</p>
                                    </div>
                                    <div className="bg-muted/40 rounded-xl p-4">
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Elevation</p>
                                        <p className="text-base font-bold text-foreground mt-1">{destination.elevation}</p>
                                    </div>
                                    <div className="bg-muted/40 rounded-xl p-4">
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Recommended Stay</p>
                                        <p className="text-base font-bold text-foreground mt-1">{destination.recommendedStay}</p>
                                    </div>
                                    {destination.nearestAirport && (
                                        <div className="bg-muted/40 rounded-xl p-4">
                                            <p className="text-xs text-muted-foreground uppercase font-semibold">Nearest Airport</p>
                                            <p className="text-base font-bold text-foreground mt-1">{destination.nearestAirport}</p>
                                        </div>
                                    )}
                                    {destination.landscape && (
                                        <div className="bg-muted/40 rounded-xl p-4 col-span-2">
                                            <p className="text-xs text-muted-foreground uppercase font-semibold">Landscape</p>
                                            <p className="text-base font-bold text-foreground mt-1">{destination.landscape}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab 2: Wildlife */}
                    {activeTab === "wildlife" && (
                        <div
                            id="panel-wildlife"
                            role="tabpanel"
                            aria-labelledby="tab-wildlife"
                            className="space-y-8 animate-in fade-in-50 duration-200"
                        >
                            <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                                <PawPrint className="w-8 h-8 text-primary" />
                                Wildlife & Biodiversity
                            </h2>
                            <WildlifeGrid
                                bigFive={destination.bigFive}
                                keySpecies={destination.keySpecies}
                                uniqueSpecies={destination.uniqueSpecies}
                                birdWatching={destination.birdWatching}
                                wildlifeRating={destination.wildlifeRating}
                            />
                        </div>
                    )}

                    {/* Tab 3: Experiences */}
                    {activeTab === "experiences" && (
                        <div
                            id="panel-experiences"
                            role="tabpanel"
                            aria-labelledby="tab-experiences"
                            className="space-y-8 animate-in fade-in-50 duration-200"
                        >
                            <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                                <Sparkles className="w-8 h-8 text-primary" />
                                Experiences & Activities
                            </h2>
                            <ActivityCards activities={destination.activities} />
                        </div>
                    )}

                    {/* Tab 4: Best Time to Visit */}
                    {activeTab === "best-time" && (
                        <div
                            id="panel-best-time"
                            role="tabpanel"
                            aria-labelledby="tab-best-time"
                            className="space-y-8 animate-in fade-in-50 duration-200"
                        >
                            <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                                <Calendar className="w-8 h-8 text-primary" />
                                Best Time to Visit
                            </h2>
                            <div className="bg-card border border-border/50 rounded-xl p-6 md:p-8">
                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                                        <h3 className="font-semibold text-foreground mb-2">Peak Season</h3>
                                        <p className="text-sm text-muted-foreground">{destination.peakSeason}</p>
                                    </div>
                                    <div className="bg-muted rounded-lg p-4 border border-border/50">
                                        <h3 className="font-semibold text-foreground mb-2">Low Season</h3>
                                        <p className="text-sm text-muted-foreground">{destination.lowSeason}</p>
                                    </div>
                                </div>

                                <h3 className="font-semibold text-foreground mb-4">Month-by-Month Guide</h3>
                                <div className="space-y-3">
                                    {destination.monthlyBreakdown.map((month, idx) => (
                                        <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-4 bg-muted/50 rounded-lg border border-border/40">
                                            <div className="flex-shrink-0 w-full sm:w-24 font-semibold text-primary">{month.month}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-foreground mb-1"><strong>Wildlife:</strong> {month.wildlife}</p>
                                                <p className="text-sm text-muted-foreground"><strong>Weather:</strong> {month.weather}</p>
                                            </div>
                                            <div className="flex-shrink-0 flex items-center gap-1 mt-2 sm:mt-0">
                                                {[...Array(5)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-2 w-2 rounded-full ${i < month.rating ? "bg-primary" : "bg-muted"}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab 5: Accommodations */}
                    {activeTab === "accommodations" && (
                        <div
                            id="panel-accommodations"
                            role="tabpanel"
                            aria-labelledby="tab-accommodations"
                            className="space-y-8 animate-in fade-in-50 duration-200"
                        >
                            <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                                <Users className="w-8 h-8 text-primary" />
                                Where to Stay
                            </h2>
                            <AccommodationSection accommodations={destination.accommodations} />
                        </div>
                    )}

                    {/* Tab 6: Itineraries */}
                    {activeTab === "itineraries" && (
                        <div
                            id="panel-itineraries"
                            role="tabpanel"
                            aria-labelledby="tab-itineraries"
                            className="space-y-12 animate-in fade-in-50 duration-200"
                        >
                            <div>
                                <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <Calendar className="w-8 h-8 text-primary" />
                                    Sample Itineraries
                                </h2>
                                <ItineraryTimeline itineraries={destination.sampleItineraries ?? []} />
                            </div>

                            <div>
                                <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <Compass className="w-8 h-8 text-primary" />
                                    Safari Packages Including {destination.name}
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    Explore our curated safari packages that include visits to {destination.name}. Each tour is carefully designed to showcase the best of this incredible destination.
                                </p>
                                {relatedToursNode}
                            </div>
                        </div>
                    )}

                    {/* Tab 7: Travel Info */}
                    {activeTab === "travel-info" && (
                        <div
                            id="panel-travel-info"
                            role="tabpanel"
                            aria-labelledby="tab-travel-info"
                            className="space-y-12 animate-in fade-in-50 duration-200"
                        >
                            <div>
                                <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <Plane className="w-8 h-8 text-primary" />
                                    Getting There & Access
                                </h2>
                                <div className="grid md:grid-cols-3 gap-6 mb-8">
                                    <div className="bg-card border border-border/50 rounded-xl p-6">
                                        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                            <Plane className="w-5 h-5 text-primary" />
                                            By Air
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{destination.gettingThere.byAir}</p>
                                    </div>
                                    <div className="bg-card border border-border/50 rounded-xl p-6">
                                        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                            <Map className="w-5 h-5 text-primary" />
                                            By Road
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{destination.gettingThere.byRoad}</p>
                                    </div>
                                    <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
                                        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-primary" />
                                            Transfer Time
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{destination.gettingThere.transferTime}</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-card border border-border/50 rounded-xl p-6">
                                        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                            <Leaf className="w-5 h-5 text-primary" />
                                            Conservation Efforts
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{destination.conservation}</p>
                                    </div>
                                    {destination.communityInitiatives && (
                                        <div className="bg-card border border-border/50 rounded-xl p-6">
                                            <h3 className="font-semibold text-foreground mb-3">Community Initiatives</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{destination.communityInitiatives}</p>
                                        </div>
                                    )}
                                </div>

                                {destination.culturalContext && (
                                    <div className="rounded-xl border border-featured/25 bg-featured/10 p-6 mb-8">
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

                                {destination.travelTips && destination.travelTips.length > 0 && (
                                    <div className="mb-12">
                                        <h3 className="text-2xl font-bold text-foreground mb-4">Travel Tips</h3>
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
                                    </div>
                                )}
                            </div>

                            {destination.faqs && destination.faqs.length > 0 && (
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground mb-4">Frequently Asked Questions</h3>
                                    <FAQAccordion faqs={destination.faqs} />
                                </div>
                            )}

                            {destination.gallery && destination.gallery.length > 0 && (
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground mb-4">Photo Gallery</h3>
                                    <PhotoGallery images={destination.gallery} destinationName={destination.name} />
                                </div>
                            )}

                            {relatedDestinationsNode && (
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground mb-4">Explore Related Destinations</h3>
                                    {relatedDestinationsNode}
                                </div>
                            )}
                        </div>
                    )}

                    {/* CTA Section */}
                    <section className="site-floating-panel rounded-2xl p-8 text-center md:p-12 mt-16">
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
    );
}
