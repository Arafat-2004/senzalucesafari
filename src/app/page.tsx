import { Metadata } from "next";
import dynamic from 'next/dynamic';
import { HeroSection } from "@/components/home/hero-section";
import { TrustBadges } from "@/components/ui/trust-badges";
import { Skeleton } from "@/components/ui/skeleton";
import { JsonLd } from "@/components/seo/JsonLd";

// Revalidate homepage data every hour (or immediately when admin triggers revalidatePath)
export const revalidate = 3600;

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
  description: "Comfortable, authentic, and unforgettable safari experiences in Tanzania's most iconic destinations including Serengeti, Ngorongoro, and Zanzibar.",
  keywords: ["safari", "Tanzania", "Serengeti", "Ngorongoro", "Zanzibar", "wildlife", "tent", "luxury", "travel"],
  authors: [{ name: "Senza Luce Safaris" }],
  creator: "Senza Luce Safaris",
  publisher: "Senza Luce Safaris",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://senzalucesafaris.com",
    siteName: "Senza Luce Safaris",
    title: "Senza Luce Safaris - Explore Tanzania Like Never Before",
    description: "Comfortable, authentic, and unforgettable safari experiences in Tanzania's most iconic destinations.",
    images: [
      {
        url: "/images/og/home.jpg",
        width: 1200,
        height: 630,
        alt: "Senza Luce Safaris - Tanzania Safari Adventures",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Senza Luce Safaris - Explore Tanzania Like Never Before",
    description: "Comfortable, authentic, and unforgettable safari experiences in Tanzania's most iconic destinations.",
    images: ["/images/og/home.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function HomePage() {
  const companyEmail = process.env.COMPANY_EMAIL || '';
  const companyPhone = process.env.COMPANY_PHONE || '';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const travelAgencyJsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Senza Luce Safaris",
    "description": "Comfortable, authentic, and unforgettable safari experiences in Tanzania's most iconic destinations including Serengeti, Ngorongoro, and Zanzibar.",
    "url": siteUrl,
    "telephone": companyPhone,
    "email": companyEmail,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "TZ",
      "addressRegion": "Tanzania"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Tanzania"
    },
    "sameAs": [
      "https://www.instagram.com/senzaluce_safaris",
      "https://www.facebook.com/senzalucesafaris"
    ]
  };

  return (
    <>
      <JsonLd data={travelAgencyJsonLd} />
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
