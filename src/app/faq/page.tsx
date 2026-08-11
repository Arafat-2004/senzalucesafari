import { HeroSection } from "@/components/ui/hero-section";
import { FAQClient } from "./faq-client";
import { getFaqsByCategory } from "@/lib/faq";
import { JsonLd } from "@/components/seo/JsonLd";

export const revalidate = 3600; // ISR caching - revalidate every hour

export const metadata = {
    title: "Frequently Asked Questions - Senza Luce Safari",
    description: "Find answers to common questions about our Tanzania safaris, booking, health & safety, and travel logistics.",
    alternates: { canonical: '/faq' },
    openGraph: { url: '/faq' },
};

export default async function FAQPage() {
    const faqCategories = await getFaqsByCategory();

    // Map categories and questions to standard FAQPage structured schema
    const faqQuestions = faqCategories.flatMap((cat) =>
        cat.questions.map((q) => ({
            "@type": "Question",
            "name": q.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": q.answer,
            },
        }))
    );

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqQuestions,
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section with Background Image */}
            <HeroSection
                title="Frequently Asked Questions"
                subtitle="Find answers to common questions about our safaris"
                backgroundImage="/images/destinations/tarangire/tarangire.jpg"
                ctaText="Browse Questions"
                ctaLink="#faq-categories"
            />

            {/* FAQ content rendered separately to avoid HeroSection overflow clipping */}
            <div id="faq-categories">
                <FAQClient faqCategories={faqCategories} />
            </div>

            {/* FAQ schema for rich search results listing */}
            <JsonLd data={faqSchema} />
        </div>
    );
}
