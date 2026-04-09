import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTourBySlug, tourPackages, getToursByCategory } from "@/data/tours";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb-nav";
import { TourHero, ItineraryTimeline } from "@/components/tours";
import MobileTableOfContents from "@/components/ui/mobile-toc";
import LegalTableOfContents from "@/components/ui/legal-toc";
import { ArrowLeft, CheckCircle, XCircle, Star, Tag, CalendarDays } from "lucide-react";
import { getTranslations } from 'next-intl/server';
import { BookNowCTA } from "./book-now-cta";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    return tourPackages.map((tour) => ({
        slug: tour.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const tour = getTourBySlug(slug);

    if (!tour) {
        return {
            title: "Tour Not Found",
        };
    }

    return {
        title: `${tour.name} - Senza Luce Safaris`,
        description: tour.shortDescription,
    };
}

export default async function TourDetailPage({ params }: Props) {
    const { slug } = await params;
    const t = await getTranslations();
    const tour = getTourBySlug(slug);

    if (!tour) {
        notFound();
    }

    // Get related tours
    const relatedTours = getToursByCategory(tour.category)
        .filter(t => t.id !== tour.id)
        .slice(0, 3);

    const sections = [
        { id: "overview", title: "Overview" },
        { id: "highlights", title: "Highlights" },
        { id: "itinerary", title: "Day-by-Day Itinerary" },
        { id: "included", title: "What's Included" },
        { id: "excluded", title: "What's Excluded" },
        { id: "best-for", title: "Best For" },
        { id: "related", title: "Related Tours" }
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
            <TourHero tour={tour} />

            {/* Content Section */}
            <section className="py-12 md:py-16">
                <div className="container px-4">
                    {/* Back Button */}
                    <Link
                        href="/safaris-tours"
                        className="inline-flex items-center text-primary hover:underline mb-8"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t('tourDetail.backToTours')}
                    </Link>

                    {/* Mobile Table of Contents */}
                    <MobileTableOfContents sections={sections} title={t('tourDetail.quickNavigation')} />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-9">
                            {/* Overview */}
                            <section id="overview" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6">{t('tourDetail.overview')}</h2>
                                <div className="prose prose-lg max-w-none text-muted-foreground">
                                    <p className="leading-relaxed">{tour.overview}</p>
                                </div>
                            </section>

                            {/* Highlights */}
                            <section id="highlights" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <Star className="w-8 h-8 text-primary" />
                                    {t('tourDetail.highlights')}
                                </h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {tour.highlights.map((highlight, index) => (
                                        <div key={index} className="flex items-start space-x-3 p-4 bg-card border border-border/50 rounded-xl hover:shadow-md transition-shadow">
                                            <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                            <span className="text-foreground">{highlight}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Itinerary */}
                            <section id="itinerary" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <CalendarDays className="w-8 h-8 text-primary" />
                                    {t('tourDetail.itinerary')}
                                </h2>
                                <ItineraryTimeline itinerary={tour.itinerary} />
                            </section>

                            {/* Inclusions & Exclusions */}
                            <div className="grid md:grid-cols-2 gap-8 mb-12">
                                <section id="included" className="scroll-mt-24">
                                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                        {t('tourDetail.included')}
                                    </h2>
                                    <ul className="space-y-3">
                                        {tour.included.map((item, index) => (
                                            <li key={index} className="flex items-start space-x-3 p-3 bg-green-500/5 rounded-lg">
                                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span className="text-foreground">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                <section id="excluded" className="scroll-mt-24">
                                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                                        <XCircle className="w-6 h-6 text-red-600" />
                                        {t('tourDetail.excluded')}
                                    </h2>
                                    <ul className="space-y-3">
                                        {tour.excluded.map((item, index) => (
                                            <li key={index} className="flex items-start space-x-3 p-3 bg-red-500/5 rounded-lg">
                                                <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                                <span className="text-foreground">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            </div>

                            {/* Best For */}
                            <section id="best-for" className="scroll-mt-24 mb-12">
                                <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <Tag className="w-8 h-8 text-primary" />
                                    {t('tourDetail.bestFor')}
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {tour.bestFor.map((item, index) => (
                                        <span
                                            key={index}
                                            className="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium text-sm border border-primary/20"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            {/* Related Tours */}
                            {relatedTours.length > 0 && (
                                <section id="related" className="scroll-mt-24 mb-12">
                                    <h2 className="text-3xl font-bold text-foreground mb-6">{t('tourDetail.relatedTours')}</h2>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {relatedTours.map((relatedTour) => (
                                            <Link
                                                key={relatedTour.id}
                                                href={`/safaris-tours/${relatedTour.slug}`}
                                                className="group bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                            >
                                                <div className="relative aspect-[16/9] overflow-hidden">
                                                    <img
                                                        src={relatedTour.imageUrl}
                                                        alt={relatedTour.name}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                    <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                                                        From ${relatedTour.priceFrom.toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className="p-5">
                                                    <h3 className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                                        {relatedTour.name}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                                        {relatedTour.shortDescription}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">{relatedTour.duration}</span>
                                                        <span className="text-primary font-semibold text-sm group-hover:underline">{t('tourCard.viewDetails')} →</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="hidden lg:block lg:col-span-3">
                            <LegalTableOfContents sections={sections} title={t('tourDetail.quickNavigation')} />
                        </aside>
                    </div>
                </div>
            </section>

            {/* Sticky CTA Bar */}
            <section className="sticky bottom-0 bg-card border-t border-border/50 shadow-lg z-40">
                <div className="container px-4 py-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">{t('tourDetail.from')}</p>
                                <p className="text-2xl font-bold text-primary">${tour.priceFrom.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">{t('tourDetail.perPerson')}</p>
                            </div>
                            <div className="hidden sm:block h-12 w-px bg-border" />
                            <div className="hidden sm:block">
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                                    <span className="font-semibold">{tour.rating}/10</span>
                                    <span className="text-muted-foreground text-sm">({tour.reviewCount} reviews)</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <BookNowCTA tour={tour} />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
