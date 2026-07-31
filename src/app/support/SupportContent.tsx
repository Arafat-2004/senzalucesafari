"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Mail,
    Phone,
    MessageCircle,
    HelpCircle,
    Clock,
    ArrowRight,
    LifeBuoy,
    Search,
    ChevronDown
} from "lucide-react";

export default function SupportContent() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

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
                    a: "We'd love to see your photos! Tag us on social media @senzalucesafari or email them to us. We may feature them on our website (with your permission)."
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

    const categoryFilters = [
        { label: "All", value: "All" },
        { label: "Booking", value: "Booking & Reservations" },
        { label: "Travel & Visas", value: "Travel Preparation" },
        { label: "Safaris & Tours", value: "During Your Safari" },
        { label: "After Safari", value: "After Your Safari" },
    ];

    const filteredFaqs = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return faqs.map((cat) => {
            if (activeCategory !== "All" && cat.category !== activeCategory) {
                return null;
            }

            if (!query) {
                return cat;
            }

            const matchingQuestions = cat.questions.filter(
                (q) =>
                    q.q.toLowerCase().includes(query) ||
                    q.a.toLowerCase().includes(query) ||
                    cat.category.toLowerCase().includes(query)
            );

            if (matchingQuestions.length === 0) {
                return null;
            }

            return {
                ...cat,
                questions: matchingQuestions,
            };
        }).filter(Boolean) as typeof faqs;
    }, [searchQuery, activeCategory]);

    const toggleItem = (id: string) => {
        setOpenItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <main className="min-h-screen bg-background pb-28 sm:pb-32">
            {/* Hero Section */}
            <section className="site-section-card py-16 md:py-24">
                <div className="container px-4 text-center">
                    <LifeBuoy className="w-16 h-16 text-primary mx-auto mb-6" />
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        How Can We Help?
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Get the support you need for your safari adventure
                    </p>

                    {/* Hero Search Bar */}
                    <div className="mt-8 max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search topics, booking info, FAQs..."
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border/70 bg-card text-foreground placeholder:text-muted-foreground/75 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm md:text-base shadow-sm transition-all"
                        />
                    </div>
                </div>
            </section>

            {/* Quick Contact Cards */}
            <section className="py-12 md:py-16">
                <div className="container px-4">
                    <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-3 md:pb-0 scrollbar-hide max-w-5xl mx-auto">
                        <a
                            href="mailto:info@senzalucesafari.com"
                            className="snap-center shrink-0 w-[85vw] sm:w-[320px] md:w-auto border border-border/70 hover:border-primary/50 hover:shadow-lg transition-all rounded-2xl p-6 bg-card flex flex-col justify-between h-full group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary font-bold mb-4 shrink-0">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-foreground mb-2 text-lg">Email Us</h3>
                                <p className="text-sm text-muted-foreground mb-4">We typically respond within 24 hours</p>
                                <span className="text-primary font-semibold text-sm flex items-center gap-1.5 mb-4 truncate">
                                    info@senzalucesafari.com
                                </span>
                            </div>
                            <Button variant="outline" size="sm" className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                Send Email
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </a>

                        <a
                            href="tel:+255699209980"
                            className="snap-center shrink-0 w-[85vw] sm:w-[320px] md:w-auto border border-border/70 hover:border-primary/50 hover:shadow-lg transition-all rounded-2xl p-6 bg-card flex flex-col justify-between h-full group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary font-bold mb-4 shrink-0">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-foreground mb-2 text-lg">Call Us</h3>
                                <p className="text-sm text-muted-foreground mb-4">Available Mon-Fri, 8am-6pm EAT</p>
                                <span className="text-primary font-semibold text-sm flex items-center gap-1.5 mb-4 truncate">
                                    +255 699 209 980
                                </span>
                            </div>
                            <Button variant="outline" size="sm" className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                Call Now
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </a>

                        <Link
                            href="/contact"
                            className="snap-center shrink-0 w-[85vw] sm:w-[320px] md:w-auto border border-border/70 hover:border-primary/50 hover:shadow-lg transition-all rounded-2xl p-6 bg-card flex flex-col justify-between h-full group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary font-bold mb-4 shrink-0">
                                    <MessageCircle className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-foreground mb-2 text-lg">Message Us</h3>
                                <p className="text-sm text-muted-foreground mb-4">Fill out our contact form</p>
                                <span className="text-primary font-semibold text-sm flex items-center gap-1.5 mb-4 truncate">
                                    Go to Contact Page
                                </span>
                            </div>
                            <Button variant="outline" size="sm" className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                Open Form
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQ Sections */}
            <section className="site-section-muted py-12 md:py-16">
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

                    {/* Sticky Category Filter Pills */}
                    <div className="sticky top-16 sm:top-20 z-30 bg-background/95 backdrop-blur-md border-y border-border/60 py-3 mb-8 flex overflow-x-auto snap-x gap-2 scrollbar-hide">
                        {categoryFilters.map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => setActiveCategory(filter.value)}
                                className={`snap-start shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                                    activeCategory === filter.value
                                        ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-4xl mx-auto space-y-8">
                        {filteredFaqs.map((cat) => (
                            <div key={cat.category} className="space-y-4">
                                <h3 className="text-2xl font-bold text-foreground mb-4 pb-2 border-b-2 border-primary/20">
                                    {cat.category}
                                </h3>
                                <div className="space-y-3">
                                    {cat.questions.map((faq, faqIdx) => {
                                        const faqKey = `${cat.category}-${faqIdx}`;
                                        const isOpen = searchQuery.trim() !== "" ? true : !!openItems[faqKey];
                                        return (
                                            <div
                                                key={faqKey}
                                                className="border border-border/70 rounded-2xl bg-card transition-all overflow-hidden"
                                            >
                                                <button
                                                    onClick={() => toggleItem(faqKey)}
                                                    className="w-full p-5 text-left font-semibold text-foreground flex items-center justify-between gap-4 hover:bg-accent/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                >
                                                    <span className="flex items-start gap-3 text-base sm:text-lg">
                                                        <span className="text-primary font-bold">{faqIdx + 1}.</span>
                                                        {faq.q}
                                                    </span>
                                                    <ChevronDown
                                                        className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                                                            isOpen ? "rotate-180 text-primary" : ""
                                                        }`}
                                                    />
                                                </button>
                                                {isOpen && (
                                                    <div className="px-5 pb-5 text-muted-foreground leading-relaxed text-sm sm:text-base border-t border-border/40 pt-4">
                                                        <p className="pl-7">{faq.a}</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {filteredFaqs.length === 0 && (
                            <div className="text-center py-12 bg-card rounded-2xl border border-border/50">
                                <HelpCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-foreground mb-1">No matching questions found</h3>
                                <p className="text-sm text-muted-foreground mb-4">Try searching with a different term or clear your filters.</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setSearchQuery("");
                                        setActiveCategory("All");
                                    }}
                                >
                                    Reset Search
                                </Button>
                            </div>
                        )}
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
                            <Link href="/enquiry">
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
