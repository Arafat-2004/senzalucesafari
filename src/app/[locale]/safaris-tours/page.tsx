import { Metadata } from "next";
import { HeroSection } from "@/components/ui/hero-section";
import { ToursContent } from "./tours-content";
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
    title: "Safari & Tours - Senza Luce Safaris",
    description: "Discover our curated Tanzania safari packages including wildlife safaris, beach holidays, and Kilimanjaro treks.",
};

export default function ToursPage() {
    const t = useTranslations();
    return (
        <div className="min-h-screen">
            {/* Hero Section with Background Image */}
            <HeroSection
                title={t('safarisTours.hero.title')}
                subtitle={t('safarisTours.hero.subtitle')}
                backgroundImage="/images/placeholders/serengeti-migration.jpg"
                ctaText={t('safarisTours.hero.cta')}
                ctaLink="#tours-section"
            />

            {/* Client Component with Interactive Features */}
            <ToursContent />
        </div>
    );
}
