import { Metadata } from "next";
import { Link as I18nLink } from '@/i18n/navigation';
import Image from "next/image";
import { destinations } from "@/data/destinations";
import { DestinationCard } from "@/components/ui/destination-card";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Mountain, PawPrint } from "lucide-react";
import { HeroSection } from "@/components/ui/hero-section";
import { StaggerContainer, StaggerItem, FadeIn, SlideInLeft, SlideInRight } from "@/components/ui/scroll-animation";
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
    title: "Destinations - Senza Luce Safaris",
    description: "Explore Tanzania's most iconic safari destinations including Serengeti, Ngorongoro, Tarangire, and Zanzibar.",
};

export default function DestinationsPage() {
    const t = useTranslations();
    // Define badges for each destination based on Tanview style
    const getDestinationBadge = (slug: string) => {
        const badges: Record<string, string> = {
            'serengeti': t('destinations.badges.greatMigration'),
            'ngorongoro': t('destinations.badges.worldHeritage'),
            'tarangire': t('destinations.badges.elephantHaven'),
            'lake-manyara': t('destinations.badges.treeClimbingLions'),
            'zanzibar': t('destinations.badges.spiceIsland')
        };
        return badges[slug];
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section with Background Image */}
            <HeroSection
                title={t('destinations.hero.title')}
                subtitle={t('destinations.hero.subtitle')}
                backgroundImage="/images/placeholders/serengeti.jpg"
                ctaText={t('destinations.hero.cta')}
                ctaLink="#destinations-grid"
            />

            {/* The Northern Circuit Section */}
            <section id="destinations-grid" className="container py-16 md:py-24">
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
                        {t('destinations.northernCircuit.badge')}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('destinations.northernCircuit.title')}</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {t('destinations.northernCircuit.description')}
                    </p>
                </div>

                {/* Destinations Grid */}
                <StaggerContainer staggerDelay={0.1}>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {destinations.map((destination) => (
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

            {/* Featured Destination - Ngorongoro Crater */}
            <section className="container py-16 md:py-24">
                <div className="bg-secondary/30 rounded-3xl p-8 md:p-12">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        <SlideInLeft>
                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted">
                                <Image
                                    src="/images/destinations/ngorongoro.jpg"
                                    alt="Ngorongoro Crater"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </SlideInLeft>
                        <SlideInRight delay={0.2}>
                            <div className="space-y-6">
                                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                                    {t('destinations.featured.badge')}
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold">{t('destinations.featured.title')}</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    {t('destinations.featured.description')}
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <span className="px-3 py-1.5 bg-card rounded-full text-sm font-medium shadow-sm flex items-center gap-1.5">
                                        <Mountain className="w-4 h-4 text-primary" />
                                        {t('destinations.featured.depth')}
                                    </span>
                                    <span className="px-3 py-1.5 bg-card rounded-full text-sm font-medium shadow-sm flex items-center gap-1.5">
                                        <PawPrint className="w-4 h-4 text-primary" />
                                        {t('destinations.featured.animals')}
                                    </span>
                                    <span className="px-3 py-1.5 bg-card rounded-full text-sm font-medium shadow-sm flex items-center gap-1.5">
                                        <PawPrint className="w-4 h-4 text-primary" />
                                        {t('destinations.featured.rhinos')}
                                    </span>
                                </div>
                                <Button className="btn-safari mt-4">
                                    <I18nLink href="/destinations/ngorongoro">
                                        {t('destinations.featured.cta')}
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </I18nLink>
                                </Button>
                            </div>
                        </SlideInRight>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="container py-16 md:py-24">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {[
                        { value: '6+', label: t('destinations.stats.parks') },
                        { value: '1.5M+', label: t('destinations.stats.wildebeest') },
                        { value: '550+', label: t('destinations.stats.birds') },
                        { value: '25K+', label: t('destinations.stats.craterAnimals') },
                        { value: '99%', label: t('destinations.stats.satisfaction') }
                    ].map((stat, index) => (
                        <div key={index} className="text-center p-6 bg-secondary/20 rounded-2xl">
                            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="container py-16 md:py-24 text-center p-12 bg-primary rounded-3xl text-white mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('destinations.cta.title')}</h2>
                <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                    {t('destinations.cta.description')}
                </p>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 btn-safari">
                    <I18nLink href="/contact">{t('destinations.cta.button')}</I18nLink>
                </Button>
            </section>
        </div>
    );
}
