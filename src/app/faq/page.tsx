import { HeroSection } from "@/components/ui/hero-section";
import { FAQClient } from "./faq-client";
import { getFaqsByCategory } from "@/lib/faq";

export const revalidate = 3600; // ISR caching - revalidate every hour

export const metadata = {
    title: "Frequently Asked Questions - Senza Luce Safaris",
    description: "Find answers to common questions about our Tanzania safaris, booking, health & safety, and travel logistics.",
};

export default async function FAQPage() {
    const faqCategories = await getFaqsByCategory();

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
        </div>
    );
}
