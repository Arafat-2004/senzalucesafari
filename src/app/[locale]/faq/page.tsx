"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Metadata } from "next";
import { ChevronDown, Search, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HeroSection } from "@/components/ui/hero-section";

export default function FAQPage() {
    const t = useTranslations();
    const [searchTerm, setSearchTerm] = useState("");
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqCategories = [
        {
            category: t('faq.categories.booking'),
            questions: [
                {
                    question: "How far in advance should I book my safari?",
                    answer: "We recommend booking at least 3-6 months in advance, especially for peak season (June-October). For the Great Migration or special events, booking 9-12 months ahead is ideal. However, we can sometimes accommodate last-minute bookings depending on availability."
                },
                {
                    question: "What's included in the safari package price?",
                    answer: "Our packages typically include: accommodation, all meals during the safari, professional English-speaking guide, 4x4 safari vehicle with pop-up roof, park entrance fees, game drives, and airport transfers. Flights to Tanzania, visas, travel insurance, and personal expenses are not included unless specified."
                },
                {
                    question: "Can I customize my safari itinerary?",
                    answer: "Absolutely! All our safaris can be fully customized to match your interests, budget, and schedule. Whether you want to focus on specific wildlife, add cultural experiences, extend your stay, or upgrade accommodations, we'll craft the perfect itinerary for you."
                },
                {
                    question: "What payment methods do you accept?",
                    answer: "We accept bank transfers, credit cards (Visa, MasterCard), PayPal, and Wise. A 30% deposit is required to confirm your booking, with the balance due 60 days before departure. We also offer flexible payment plans for bookings made well in advance."
                }
            ]
        },
        {
            category: t('faq.categories.experience'),
            questions: [
                {
                    question: "What is the best time to visit Tanzania for a safari?",
                    answer: "The best time depends on what you want to see:\n\n• **Dry Season (June-October):** Best for general wildlife viewing as animals gather around water sources.\n• **Great Migration (July-October):** Witness the dramatic river crossings in the Serengeti.\n• **Calving Season (January-February):** See newborn wildebeest and predators in action.\n• **Green Season (November-May):** Lower prices, fewer tourists, lush landscapes, and excellent bird watching."
                },
                {
                    question: "How likely am I to see the Big Five?",
                    answer: "Tanzania offers excellent Big Five viewing opportunities. The Ngorongoro Crater is one of the best places in Africa to see all five species (lion, leopard, elephant, buffalo, rhino) in a single day. Serengeti and Tarangire also offer great chances. While we can't guarantee sightings, our experienced guides know the best locations and our success rate is over 95%."
                },
                {
                    question: "What should I pack for a safari?",
                    answer: "Essential items include: neutral-colored clothing (khaki, beige, green), comfortable walking shoes, warm layers for early mornings, sun hat, sunglasses, sunscreen, insect repellent, binoculars, camera with extra batteries/memory cards, power adapter, and any personal medications. We provide a detailed packing list upon booking confirmation."
                },
                {
                    question: "Is it safe to go on a safari in Tanzania?",
                    answer: "Yes, Tanzania is one of the safest safari destinations in Africa. Our vehicles are designed for safety with pop-up roofs that allow viewing while remaining protected. Guides are trained in wildlife behavior and safety protocols. Always follow your guide's instructions, stay in the vehicle during game drives, and maintain safe distances from animals."
                }
            ]
        },
        {
            category: t('faq.categories.health'),
            questions: [
                {
                    question: "Do I need vaccinations before traveling to Tanzania?",
                    answer: "Yellow Fever vaccination is required if arriving from a country with risk of transmission. We strongly recommend: Hepatitis A & B, Typhoid, Tetanus, and Rabies. Malaria prophylaxis is highly recommended. Consult your travel doctor 6-8 weeks before departure for personalized advice."
                },
                {
                    question: "Is malaria a concern on safari?",
                    answer: "Malaria risk exists in Tanzania, including safari areas. We recommend taking anti-malarial medication, using insect repellent with DEET, wearing long sleeves/pants in the evenings, and sleeping under mosquito nets (provided at most lodges). The risk is lower in high-altitude areas like Ngorongoro Crater rim."
                },
                {
                    question: "What medical facilities are available during the safari?",
                    answer: "Major national parks have basic first aid stations. For serious medical issues, evacuation services can transport you to hospitals in Arusha or Dar es Salaam. We recommend comprehensive travel insurance that covers medical evacuation. Our guides carry first aid kits and satellite phones for emergencies."
                },
                {
                    question: "Can I participate in safari activities if I have mobility issues?",
                    answer: "We can accommodate many mobility challenges with advance notice. Some lodges have accessible rooms, and we can arrange ground-level game viewing options. However, traditional game drives require climbing into elevated vehicles. Please discuss your specific needs with us so we can recommend suitable options."
                }
            ]
        },
        {
            category: t('faq.categories.accommodation'),
            questions: [
                {
                    question: "What types of accommodation are available?",
                    answer: "We offer three tiers:\n\n• **Budget:** Clean, comfortable tented camps with shared facilities\n• **Mid-range:** Well-appointed lodges and permanent tented camps with en-suite bathrooms\n• **Luxury:** Premium lodges and luxury tented camps with exceptional amenities and service\n\nAll accommodations are carefully selected for location, comfort, and authenticity."
                },
                {
                    question: "Are dietary requirements accommodated?",
                    answer: "Yes! We cater to vegetarian, vegan, gluten-free, halal, kosher, and other dietary needs. Please inform us of any allergies or restrictions when booking. Most lodges and camps can accommodate special diets with advance notice."
                },
                {
                    question: "Is drinking water provided during the safari?",
                    answer: "Yes, unlimited bottled or filtered drinking water is provided in the safari vehicle and at all accommodations. We encourage bringing a reusable water bottle to reduce plastic waste. Tap water is not safe to drink in Tanzania."
                },
                {
                    question: "Can I charge my electronic devices during the safari?",
                    answer: "Most lodges and camps have electricity (220V, UK-style plugs). Many safari vehicles have charging ports. However, power may be limited in remote areas or generated by solar panels. We recommend bringing extra camera batteries, a power bank, and a universal adapter."
                }
            ]
        },
        {
            category: t('faq.categories.photography'),
            questions: [
                {
                    question: "What camera equipment do you recommend?",
                    answer: "For wildlife photography, we recommend:\n• DSLR or mirrorless camera with good low-light performance\n• Telephoto lens (200-400mm minimum, 100-400mm zoom is versatile)\n• Wide-angle lens (24-70mm) for landscapes\n• Extra batteries and memory cards\n• Bean bag or monopod for stability\n• Lens cleaning kit\n\nBinoculars (8x42 or 10x42) are also essential for spotting distant wildlife."
                },
                {
                    question: "Can I use drones for aerial photography?",
                    answer: "Drone use requires special permits from Tanzania National Parks Authority (TANAPA) and is generally restricted in national parks. Commercial drone photography requires additional permissions. We can help arrange permits if needed, but regulations are strict to protect wildlife."
                },
                {
                    question: "What wildlife can I expect to see?",
                    answer: "Tanzania is home to incredible biodiversity:\n• **Big Five:** Lion, leopard, elephant, buffalo, rhino\n• **Great Migration:** 1.5+ million wildebeest, zebras, gazelles\n• **Predators:** Cheetahs, hyenas, wild dogs, jackals\n• **Primates:** Chimpanzees, baboons, colobus monkeys\n• **Birds:** 1,100+ species including flamingos, eagles, hornbills\n• **Others:** Giraffes, hippos, crocodiles, antelopes, and more"
                }
            ]
        },
        {
            category: t('faq.categories.logistics'),
            questions: [
                {
                    question: "Do I need a visa to visit Tanzania?",
                    answer: "Most visitors require a visa. You can obtain an e-Visa online before travel (recommended) or get a visa on arrival at major entry points. The cost is typically $50-100 USD depending on nationality. Passport must be valid for at least 6 months beyond your travel dates with blank pages."
                },
                {
                    question: "What currency should I bring?",
                    answer: "US Dollars (USD) are widely accepted for tourist services. Bring bills printed after 2009 (newer bills preferred). Tanzanian Shillings (TZS) are used for local purchases. Credit cards are accepted at larger lodges and in cities. ATMs are available in Arusha and major towns. We recommend carrying some cash for tips and souvenirs."
                },
                {
                    question: "How do I get to Tanzania?",
                    answer: "International flights arrive at:\n• **Kilimanjaro International Airport (JRO):** Near Arusha, ideal for northern circuit safaris\n• **Julius Nyerere International Airport (DAR):** Dar es Salaam, gateway to southern circuits\n• **Abeid Amani Karume Airport (ZNZ):** Zanzibar for beach extensions\n\nWe provide complimentary airport transfers as part of your safari package."
                },
                {
                    question: "What about travel insurance?",
                    answer: "Comprehensive travel insurance is mandatory for all safaris. Your policy should cover: medical expenses, emergency evacuation, trip cancellation/interruption, lost luggage, and adventure activities. We can recommend reputable insurance providers if needed."
                }
            ]
        }
    ];

    // Filter FAQs based on search term
    const filteredFAQs = searchTerm
        ? faqCategories.map(category => ({
            ...category,
            questions: category.questions.filter(q =>
                q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.answer.toLowerCase().includes(searchTerm.toLowerCase())
            )
        })).filter(category => category.questions.length > 0)
        : faqCategories;

    const toggleQuestion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section with Background Image */}
            <HeroSection
                title={t('faq.hero.title')}
                subtitle={t('faq.hero.subtitle')}
                backgroundImage="/images/destinations/tarangire.jpg"
                ctaText={t('faq.hero.cta')}
                ctaLink="#faq-categories"
            >
                {/* Search Bar */}
                <div className="max-w-2xl mx-auto relative mt-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
                    <Input
                        type="text"
                        placeholder={t('faq.search.placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 pr-4 py-6 text-lg rounded-full border-2 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 border-white/30 focus:border-white focus:bg-white/20"
                    />
                </div>
            </HeroSection>

            {/* Quick Links */}
            {!searchTerm && (
                <section id="faq-categories" className="container py-16 md:py-24 mb-16">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {faqCategories.map((category, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    const element = document.getElementById(`category-${idx}`);
                                    element?.scrollIntoView({ behavior: "smooth" });
                                }}
                                className="bg-card border border-border/50 rounded-xl p-4 text-center hover:border-primary hover:shadow-md transition-all group"
                            >
                                <HelpCircle className="w-8 h-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium">{category.category}</span>
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* FAQ Categories */}
            <div className="container space-y-12 mb-16">
                {filteredFAQs.map((category, catIdx) => (
                    <section key={catIdx} id={`category-${catIdx}`} className="scroll-mt-24">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 pb-4 border-b-2 border-primary/20">
                            {category.category}
                        </h2>

                        <div className="space-y-4">
                            {category.questions.map((faq, faqIdx) => {
                                const globalIndex = faqCategories
                                    .slice(0, catIdx)
                                    .reduce((acc, cat) => acc + cat.questions.length, 0) + faqIdx;

                                return (
                                    <div
                                        key={faqIdx}
                                        className="bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <button
                                            onClick={() => toggleQuestion(globalIndex)}
                                            className="w-full flex items-center justify-between p-6 text-left hover:bg-secondary/20 transition-colors"
                                        >
                                            <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                                            <ChevronDown
                                                className={`w-5 h-5 text-primary flex-shrink-0 transform transition-transform duration-300 ${openIndex === globalIndex ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </button>

                                        {openIndex === globalIndex && (
                                            <div className="px-6 pb-6 pt-0">
                                                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                                                    {faq.answer}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>

            {/* Still Have Questions */}
            <section className="container mt-20 text-center p-12 bg-secondary/30 rounded-3xl mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('faq.cta.title')}</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    {t('faq.cta.description')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="btn-safari">
                        <Link href="/contact">{t('faq.cta.button')}</Link>
                    </Button>
                    <Button variant="outline" className="btn-outline">
                        <a href="https://wa.me/255629123246" target="_blank" rel="noopener noreferrer">
                            WhatsApp Us
                        </a>
                    </Button>
                </div>
            </section>
        </div>
    );
}
