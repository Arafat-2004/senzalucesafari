import { Metadata } from "next";
import dynamic from 'next/dynamic';
import { HeroSection } from "@/components/home/hero-section";
import { TrustBadges } from "@/components/ui/trust-badges";
import { Skeleton } from "@/components/ui/skeleton";
import { JsonLd } from "@/components/seo/JsonLd";
import { getFeaturedTestimonials } from "@/lib/db/reviews";
import { SITE_URL } from '@/config/site';

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

const DestinationsSection = dynamic(
  () => import('@/components/home/destinations-section').then(mod => ({ default: mod.DestinationsSection })),
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
  title: "Senza Luce Safari - Explore Tanzania Like Never Before",
  description: "Comfortable, authentic, and unforgettable safari experiences in Tanzania's most iconic destinations including Serengeti, Ngorongoro, and Zanzibar.",
  keywords: ["safari", "Tanzania", "Serengeti", "Ngorongoro", "Zanzibar", "wildlife", "tent", "luxury", "travel"],
  authors: [{ name: "Senza Luce Safari" }],
  creator: "Senza Luce Safari",
  publisher: "Senza Luce Safari",
  alternates: { canonical: '/' },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Senza Luce Safari",
    title: "Senza Luce Safari - Explore Tanzania Like Never Before",
    description: "Comfortable, authentic, and unforgettable safari experiences in Tanzania's most iconic destinations.",
    images: [
      {
        url: "/images/og/home.jpg",
        width: 1200,
        height: 630,
        alt: "Senza Luce Safari - Tanzania Safari Adventures",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Senza Luce Safari - Explore Tanzania Like Never Before",
    description: "Comfortable, authentic, and unforgettable safari experiences in Tanzania's most iconic destinations.",
    images: ["/images/og/home.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  }
};

const COMPANY_EMAIL = process.env.COMPANY_EMAIL || '';
const COMPANY_PHONE = process.env.COMPANY_PHONE || '';
const TRAVEL_AGENCY_JSON_LD = {
  "@context": "https://schema.org" as const,
  "@type": "TravelAgency" as const,
  "name": "Senza Luce Safari",
  "description": "Comfortable, authentic, and unforgettable safari experiences in Tanzania's most iconic destinations including Serengeti, Ngorongoro, and Zanzibar.",
  "url": SITE_URL,
  "telephone": COMPANY_PHONE,
  "email": COMPANY_EMAIL,
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
    "https://instagram.com/senzalucesafaris",
    "https://www.facebook.com/senzalucesafari"
  ]
};

export default async function HomePage() {
  const allTestimonials = await getFeaturedTestimonials();
  const testimonials = allTestimonials.filter(
    (t) => t.name !== "Test User" && !t.name.toLowerCase().includes("test")
  );

  return (

    <>
      <JsonLd data={TRAVEL_AGENCY_JSON_LD} />
      <HeroSection />
      <QuickInfoCards />
      <SafariCategoriesSection />
      <ExperienceSection />
      <DestinationsSection />
      <FeaturedToursSection />
      <AccommodationsSection />
      <TrustBadges />
      <FAQSection />
      <TestimonialsSection testimonials={testimonials} />

      <FinalCTASection />
    </>
  );
}
