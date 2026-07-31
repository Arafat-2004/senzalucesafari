import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDestinationBySlug, getAllDestinationSlugs } from "@/lib/db";
import { Breadcrumb } from "@/components/ui/breadcrumb-nav";
import {
    DestinationHero,
    DestinationTabsClient,
    RelatedDestinations,
    RelatedTours
} from "@/components/destinations";
import { SITE_URL } from '@/config/site';

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

    return {
        title: `${destination.name} - Senza Luce Safari`,
        description: destination.fullDescription.substring(0, 160),
        openGraph: {
            title: `${destination.name} - Senza Luce Safari`,
            description: destination.fullDescription.substring(0, 160),
            type: 'article',
            url: `${SITE_URL}/destinations/${slug}`,
            images: [
                {
                    url: destination.imageUrl || `${SITE_URL}/images/og/home.jpg`,
                    width: 1200,
                    height: 630,
                    alt: destination.name,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${destination.name} - Senza Luce Safari`,
            description: destination.fullDescription.substring(0, 160),
            images: [destination.imageUrl || `${SITE_URL}/images/og/home.jpg`],
        },
        alternates: {
            canonical: `${SITE_URL}/destinations/${slug}`,
        },
    };
}

export default async function DestinationDetailPage({ params }: Props) {
    const { slug } = await params;
    const destination = await getDestinationBySlug(slug);

    if (!destination) {
        notFound();
    }

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

            {/* Interactive Tab Panels */}
            <Suspense fallback={
                <div className="container py-12 px-4 text-center">
                    <div className="animate-pulse space-y-4">
                        <div className="h-12 bg-muted rounded-xl max-w-4xl mx-auto"></div>
                        <div className="h-64 bg-muted/40 rounded-2xl max-w-4xl mx-auto"></div>
                    </div>
                </div>
            }>
                <DestinationTabsClient
                    destination={destination}
                    relatedToursNode={<RelatedTours destinationSlug={destination.slug} />}
                    relatedDestinationsNode={<RelatedDestinations destinationSlugs={destination.relatedDestinations ?? []} />}
                />
            </Suspense>
        </main>
    );
}
