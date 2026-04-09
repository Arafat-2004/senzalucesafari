import Link from "next/link";
import { Button } from "@/components/ui/button";
import { destinations } from "@/data/destinations";
import { DestinationCard } from "@/components/ui/destination-card";
import { useTranslations } from 'next-intl';
import { Link as I18nLink } from '@/i18n/navigation';

export function DestinationsSection() {
    const t = useTranslations();
    // Define badges for each destination
    const getDestinationBadge = (slug: string) => {
        const badges: Record<string, string> = {
            'serengeti': t('home.destinations.badges.serengeti'),
            'ngorongoro': t('home.destinations.badges.ngorongoro'),
            'tarangire': t('home.destinations.badges.tarangire'),
            'lake-manyara': t('home.destinations.badges.lakeManyara'),
            'zanzibar': t('home.destinations.badges.zanzibar')
        };
        return badges[slug];
    };

    return (
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
            <div className="container px-3 sm:px-4 md:px-6 lg:px-8">
                <div className="text-center mb-10 sm:mb-12">
                    <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
                        {t('home.destinations.badge')}
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                        {t('home.destinations.title')}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t('home.destinations.description')}
                    </p>
                </div>

                <div className="grid gap-5 sm:gap-6 md:gap-7 lg:gap-8 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
                        <I18nLink href="/destinations">
                            {t('home.destinations.viewAll')}
                        </I18nLink>
                    </Button>
                </div>
            </div>
        </section>
    );
}
