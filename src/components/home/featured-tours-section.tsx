import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tourPackages } from "@/data/tours";
import { TourCard } from "@/components/ui/tour-card";
import { StaggerContainer, StaggerItem, FadeIn } from "@/components/ui/scroll-animation";
import { useTranslations } from 'next-intl';
import { Link as I18nLink } from '@/i18n/navigation';

export function FeaturedToursSection() {
    const t = useTranslations();
    // Show first 3 tours
    const featuredTours = tourPackages.slice(0, 3);

    return (
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-background to-muted/30">
            <div className="container px-3 sm:px-4 md:px-6 lg:px-8">
                <FadeIn direction="up">
                    <div className="text-center mb-10 sm:mb-12">
                        <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
                            {t('home.featuredSafaris.badge')}
                        </span>
                        <h2 className="mb-3">{t('home.featuredSafaris.title')}</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            {t('home.featuredSafaris.description')}
                        </p>
                    </div>
                </FadeIn>

                <StaggerContainer staggerDelay={0.12}>
                    <div className="grid gap-5 sm:gap-6 md:gap-7 lg:gap-8 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {featuredTours.map((tour) => (
                            <StaggerItem key={tour.id}>
                                <TourCard tour={tour} />
                            </StaggerItem>
                        ))}
                    </div>
                </StaggerContainer>

                <FadeIn delay={0.3} direction="up">
                    <div className="text-center mt-12">
                        <Button variant="outline" size="lg" className="btn-outline">
                            <I18nLink href="/safaris-tours" className="inline-flex items-center">
                                {t('home.featuredSafaris.viewAll')}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </I18nLink>
                        </Button>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
