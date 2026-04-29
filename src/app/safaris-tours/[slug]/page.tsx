import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTourBySlug, getToursByCategory, getAllTourSlugs } from "@/lib/db";
import { Breadcrumb } from "@/components/ui/breadcrumb-nav";
import { JsonLd } from "@/components/seo/JsonLd";
import { TourHero } from "@/components/tours";
import MobileTableOfContents from "@/components/ui/mobile-toc";
import LegalTableOfContents from "@/components/ui/legal-toc";
import { ArrowLeft, Star } from "lucide-react";
import { BookNowCTA } from "./book-now-cta";
import { TourDetailTabs } from "./tour-detail-tabs";

// Revalidate tour detail data every hour (or immediately when admin triggers revalidatePath)
export const revalidate = 3600;

// Simple translation fallback with default English values
const getTranslations = async () => {
    const translations: Record<string, string> = {
        'tourDetail.backToTours': 'Back to Tours',
        'tourDetail.quickNavigation': 'Quick Navigation',
        'tourDetail.from': 'From',
        'tourDetail.perPerson': 'per person',
        'tourDetail.overview': 'Overview',
        'tourDetail.itinerary': 'Itinerary',
        'tourDetail.pricing': 'Pricing',
        'tourDetail.reviews': 'Reviews',
        'tourDetail.gallery': 'Gallery',
        'tourDetail.related': 'Related',
        'tourDetail.highlights': 'Highlights',
        'tourDetail.bestFor': 'Best For',
        'tourDetail.dayByDayItinerary': 'Day-by-Day Itinerary',
        'tourDetail.pricingAndPackages': 'Pricing & Packages',
        'tourDetail.whatsIncluded': "What's Included",
        'tourDetail.whatsExcluded': "What's Excluded",
        'tourDetail.reviewsAndRatings': 'Reviews & Ratings',
        'tourDetail.photoGallery': 'Photo Gallery',
        'tourDetail.relatedTours': 'Related Tours',
        'tourCard.viewDetails': 'View Details',
    };

    return (key: string) => translations[key] || key;
};

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    const slugs = await getAllTourSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const tour = await getTourBySlug(slug);

    if (!tour) {
        return {
            title: "Tour Not Found",
        };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    return {
        title: `${tour.name} - Senza Luce Safaris`,
        description: tour.shortDescription,
        openGraph: {
            title: `${tour.name} - Senza Luce Safaris`,
            description: tour.shortDescription,
            type: 'article',
            url: `${siteUrl}/safaris-tours/${slug}`,
            images: [
                {
                    url: tour.imageUrl || `${siteUrl}/images/og/home.jpg`,
                    width: 1200,
                    height: 630,
                    alt: tour.name,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${tour.name} - Senza Luce Safaris`,
            description: tour.shortDescription,
            images: [tour.imageUrl || `${siteUrl}/images/og/home.jpg`],
        },
        alternates: {
            canonical: `${siteUrl}/safaris-tours/${slug}`,
        },
    };
}

export default async function TourDetailPage({ params }: Props) {
    const { slug } = await params;
    const t = await getTranslations();
    const tour = await getTourBySlug(slug);
    const siteUrl = `https://${process.env.NEXT_PUBLIC_BASE_URL ?? 'example.com'}`;

    if (!tour) {
        notFound();
    }

    // Get related tours
    const relatedTours = (await getToursByCategory(tour.category)).filter(t => t.id !== tour.id).slice(0, 3);

    const sections = [
        { id: "overview", title: "Overview" },
        { id: "itinerary", title: "Itinerary" },
        { id: "pricing", title: "Pricing" },
        { id: "reviews", title: "Reviews" },
        { id: "gallery", title: "Gallery" },
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
                            <TourDetailTabs
                                tour={tour}
                                relatedTours={relatedTours}
                                t={t}
                            />
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
            {/* JSON-LD for this tour detail */}
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "TouristTrip",
                "name": tour.name,
                "description": tour.shortDescription,
                "image": tour.imageUrl,
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": tour.rating,
                    "reviewCount": tour.reviewCount
                },
                "offers": {
                    "@type": "Offer",
                    "priceCurrency": "USD",
                    "price": tour.priceFrom
                },
                "url": `${siteUrl}/safaris-tours/${slug}`
            }} />
        </main>
    );
}
