import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MessageCircle, HelpCircle, Clock, ArrowRight, LifeBuoy } from "lucide-react";

export const metadata: Metadata = {
    title: "Support - Senza Luce Safaris",
    description: "Get help with your safari booking, travel questions, and customer support. We're here to assist you 24/7.",
};

export default function SupportPage() {
    const faqs = [
        {
            category: "Booking & Reservations",
            questions: [
                {
                    q: "How do I book a safari?",
                    a: "You can book directly through our website by selecting your preferred safari package and clicking 'Inquire Now', or contact us via email or phone for personalized assistance."
                },
                {
                    q: "What's included in the safari price?",
                    a: "Our safari packages typically include accommodation, meals, park fees, professional guide, safari vehicle, and bottled water. Exclusions vary by package and are clearly listed on each tour page."
                },
                {
                    q: "Can I customize my safari itinerary?",
                    a: "Absolutely! We specialize in custom safaris. Contact us with your preferences, budget, and travel dates, and we'll create a personalized itinerary just for you."
                },
                {
                    q: "What payment methods do you accept?",
                    a: "We accept bank transfers, credit cards (Visa, MasterCard), and PayPal. A deposit is required to confirm your booking, with the balance due before your safari begins."
                }
            ]
        },
        {
            category: "Travel Preparation",
            questions: [
                {
                    q: "Do I need a visa for Tanzania?",
                    a: "Most visitors require a visa for Tanzania. You can obtain an e-Visa online before travel or get one on arrival. We recommend applying for an e-Visa in advance to save time."
                },
                {
                    q: "What vaccinations are required?",
                    a: "Yellow fever vaccination is required if traveling from a yellow fever endemic country. We also recommend hepatitis A, typhoid, and malaria prophylaxis. Consult your travel doctor 6-8 weeks before departure."
                },
                {
                    q: "What should I pack for a safari?",
                    a: "Pack neutral-colored clothing (khaki, beige, green), comfortable walking shoes, sun hat, sunscreen, insect repellent, binoculars, camera, and any personal medications. Avoid bright colors and camouflage patterns."
                },
                {
                    q: "When is the best time to visit?",
                    a: "The dry season (June-October) is best for wildlife viewing. The Great Migration river crossings occur July-October. Green season (November-May) offers lush landscapes and fewer tourists."
                }
            ]
        },
        {
            category: "During Your Safari",
            questions: [
                {
                    q: "Is it safe to go on a safari?",
                    a: "Yes! Tanzania is one of Africa's safest safari destinations. Our experienced guides prioritize your safety, and all vehicles meet strict safety standards. Always follow your guide's instructions."
                },
                {
                    q: "Will I see the Big Five?",
                    a: "While sightings aren't guaranteed, Tanzania offers excellent Big Five viewing opportunities. Serengeti and Ngorongoro Crater have high success rates for lion, leopard, elephant, buffalo, and rhino."
                },
                {
                    q: "Can children join the safari?",
                    a: "Yes! We offer family-friendly safaris with kid-appropriate accommodations and activities. Most lodges welcome children, though some have age restrictions (typically 6+ years)."
                },
                {
                    q: "What if I have dietary requirements?",
                    a: "We accommodate all dietary needs including vegetarian, vegan, gluten-free, halal, and allergies. Please inform us when booking so we can arrange appropriate meals."
                }
            ]
        },
        {
            category: "After Your Safari",
            questions: [
                {
                    q: "How can I share my safari photos?",
                    a: "We'd love to see your photos! Tag us on social media @senzalucesafaris or email them to us. We may feature them on our website (with your permission)."
                },
                {
                    q: "Can I leave a review?",
                    a: "Yes! We appreciate feedback. You can leave reviews on TripAdvisor, Google, or directly on our website. Your experiences help future travelers."
                },
                {
                    q: "Do you offer loyalty discounts for return visits?",
                    a: "Yes! Returning guests receive special discounts. Contact us when planning your next adventure to learn about our loyalty program benefits."
                }
            ]
        }
    ];

    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 py-16 md:py-24">
                <div className="container px-4 text-center">
                    <LifeBuoy className="w-16 h-16 text-primary mx-auto mb-6" />
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        How Can We Help?
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Get the support you need for your safari adventure
                    </p>
                </div>
            </section>

            {/* Quick Contact Cards */}
            <section className="py-12 md:py-16">
                <div className="container px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        <Link
                            href="mailto:info@senzalucesafaris.com"
                            className="bg-card border border-border/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                        >
                            <Mail className="w-10 h-10 text-primary mb-4" />
                            <h3 className="font-bold text-foreground mb-2">Email Us</h3>
                            <p className="text-sm text-muted-foreground mb-3">We typically respond within 24 hours</p>
                            <span className="text-primary font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                                info@senzalucesafaris.com
                                <ArrowRight className="w-4 h-4" />
                            </span>
                        </Link>

                        <Link
                            href="tel:+255629123246"
                            className="bg-card border border-border/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                        >
                            <Phone className="w-10 h-10 text-primary mb-4" />
                            <h3 className="font-bold text-foreground mb-2">Call Us</h3>
                            <p className="text-sm text-muted-foreground mb-3">Available Mon-Fri, 8am-6pm EAT</p>
                            <span className="text-primary font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                                +255 629 123 246
                                <ArrowRight className="w-4 h-4" />
                            </span>
                        </Link>

                        <Link
                            href="/contact"
                            className="bg-card border border-border/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                        >
                            <MessageCircle className="w-10 h-10 text-primary mb-4" />
                            <h3 className="font-bold text-foreground mb-2">Message Us</h3>
                            <p className="text-sm text-muted-foreground mb-3">Fill out our contact form</p>
                            <span className="text-primary font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                                Go to Contact Page
                                <ArrowRight className="w-4 h-4" />
                            </span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQ Sections */}
            <section className="py-12 md:py-16 bg-muted/30">
                <div className="container px-4">
                    <div className="text-center mb-12">
                        <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Quick answers to common questions about our safaris and services
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-12">
                        {faqs.map((category, idx) => (
                            <div key={idx}>
                                <h3 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b-2 border-primary/20">
                                    {category.category}
                                </h3>
                                <div className="space-y-4">
                                    {category.questions.map((faq, faqIdx) => (
                                        <div
                                            key={faqIdx}
                                            className="bg-card border border-border/50 rounded-xl p-6 hover:shadow-md transition-shadow"
                                        >
                                            <h4 className="font-semibold text-foreground mb-3 flex items-start gap-3">
                                                <span className="text-primary font-bold">{faqIdx + 1}.</span>
                                                {faq.q}
                                            </h4>
                                            <p className="text-muted-foreground leading-relaxed pl-7">
                                                {faq.a}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Still Need Help CTA */}
            <section className="py-16 md:py-24">
                <div className="container px-4">
                    <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 rounded-2xl p-8 md:p-12 text-center border border-primary/20 max-w-4xl mx-auto">
                        <Clock className="w-12 h-12 text-primary mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-foreground mb-4">
                            Still Have Questions?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Our safari experts are here to help you plan the perfect adventure. Reach out anytime!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/contact">
                                <Button size="lg">Contact Us Now</Button>
                            </Link>
                            <Link href="/enquiry">
                                <Button size="lg" variant="outline">Request Custom Safari</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
