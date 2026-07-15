"use client";

import { useState } from "react";
import { ChevronDown, Search, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface FAQCategory {
    category: string;
    questions: Array<{
        question: string;
        answer: string;
    }>;
}

interface FAQClientProps {
    faqCategories: FAQCategory[];
}

export function FAQClient({ faqCategories }: FAQClientProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [openIndex, setOpenIndex] = useState<number | null>(null);

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
        <>
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative mt-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
                <Input
                    type="text"
                    placeholder="Search for answers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-6 text-lg rounded-full border-2 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 border-white/30 focus:border-white focus:bg-white/20"
                />
            </div>

            {/* Quick Links */}
            {!searchTerm && faqCategories.length > 0 && (
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
                {filteredFAQs.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-lg text-white/80">No FAQs found matching your search.</p>
                    </div>
                ) : (
                    filteredFAQs.map((category, catIdx) => (
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
                    ))
                )}
            </div>

            {/* Still Have Questions */}
            <section className="container mt-20 text-center p-12 bg-secondary/30 rounded-3xl mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Still Have Questions?</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Our safari experts are ready to help you plan your perfect adventure
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/enquiry" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 py-2">
                        Contact Us
                    </Link>
                    <a href="https://wa.me/255629123246" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 py-2">
                        WhatsApp Us
                    </a>
                </div>
            </section>
        </>
    );
}
