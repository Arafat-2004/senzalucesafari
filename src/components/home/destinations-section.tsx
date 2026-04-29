import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getMainDestinations } from "@/lib/db";
import { DestinationCard } from "@/components/ui/destination-card";

export async function DestinationsSection() {
    const destinations = await getMainDestinations();

    // Define badges for each destination
    const getDestinationBadge = (slug: string) => {
        const badges: Record<string, string> = {
            'serengeti': 'UNESCO World Heritage',
            'ngorongoro': 'Natural Wonder',
            'tarangire': 'Elephant Paradise',
            'lake-manyara': 'Birdwatcher\'s Haven',
            'zanzibar': 'Spice Island'
        };
        return badges[slug];
    };

    return (
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
            <div className="container px-3 sm:px-4 md:px-6 lg:px-8">
                <div className="text-center mb-10 sm:mb-12">
                    <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
                        Top Destinations
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                        Explore Tanzania&apos;s Iconic Destinations
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        From the vast plains of Serengeti to the pristine beaches of Zanzibar, discover landscapes and wildlife that will take your breath away.
                    </p>
                </div>

                <div className="grid gap-5 md:gap-7 lg:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {destinations.slice(0, 6).map((destination) => (
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
                        />
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Button variant="outline" size="lg" className="btn-outline">
                        <Link href="/destinations">
                            View All Destinations
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
