import { Metadata } from "next";
import dynamic from 'next/dynamic';
import { HeroSection } from "@/components/home/hero-section";
import { TrustBadges } from "@/components/ui/trust-badges";
import { Skeleton } from "@/components/ui/skeleton";

// Critical above-the-fold components (loaded immediately)
// HeroSection is already imported directly

// Below-the-fold components (lazy loaded)
const QuickInfoCards = dynamic(
  () => import('@/components/home/quick-info-cards').then(mod => ({ default: mod.QuickInfoCards })),
  {
    loading: () => <Skeleton className="h-64 w-full" />,
    ssr: true
  }
);

const StatsSection = dynamic(
  () => import('@/components/home/stats-section').then(mod => ({ default: mod.StatsSection })),
  {
    loading: () => <Skeleton className="h-48 w-full" />,
    ssr: true
  }
);

const SafariCategoriesSection = dynamic(
  () => import('@/components/home/safari-categories-section').then(mod => ({ default: mod.SafariCategoriesSection })),
  {
    loading: () => <Skeleton className="h-96 w-full" />,
    ssr: true
  }
);

const ExperienceSection = dynamic(
  () => import('@/components/home/experience-section').then(mod => ({ default: mod.ExperienceSection })),
  {
    loading: () => <Skeleton className="h-80 w-full" />,
    ssr: true
  }
);

const FeaturedToursSection = dynamic(
  () => import('@/components/home/featured-tours-section').then(mod => ({ default: mod.FeaturedToursSection })),
  {
    loading: () => <Skeleton className="h-96 w-full" />,
    ssr: true
  }
);

const AccommodationsSection = dynamic(
  () => import('@/components/home/accommodations-section').then(mod => ({ default: mod.AccommodationsSection })),
  {
    loading: () => <Skeleton className="h-72 w-full" />,
    ssr: true
  }
);

const FAQSection = dynamic(
  () => import('@/components/home/faq-section').then(mod => ({ default: mod.FAQSection })),
  {
    loading: () => <Skeleton className="h-64 w-full" />,
    ssr: true
  }
);

const TestimonialsSection = dynamic(
  () => import('@/components/home/testimonials-section').then(mod => ({ default: mod.TestimonialsSection })),
  {
    loading: () => <Skeleton className="h-80 w-full" />,
    ssr: true
  }
);

const FinalCTASection = dynamic(
  () => import('@/components/home/final-cta-section').then(mod => ({ default: mod.FinalCTASection })),
  {
    loading: () => <Skeleton className="h-56 w-full" />,
    ssr: true
  }
);

export const metadata: Metadata = {
  title: "Senza Luce Safaris - Explore Tanzania Like Never Before",
  description: "Comfortable, authentic, and unforgettable safari experiences in Tanzania's most iconic destinations.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <QuickInfoCards />
      <StatsSection />
      <SafariCategoriesSection />
      <ExperienceSection />
      <FeaturedToursSection />
      <AccommodationsSection />
      <TrustBadges />
      <FAQSection />
      <TestimonialsSection />
      <FinalCTASection />
    </>
  );
}
