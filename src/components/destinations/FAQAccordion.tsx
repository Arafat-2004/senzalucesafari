"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQ {
    question: string;
    answer: string;
}

interface FAQAccordionProps {
    faqs: FAQ[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    if (!faqs || faqs.length === 0) return null;

    return (
        <div className="space-y-4">
            {faqs.map((faq, index) => (
                <div
                    key={index}
                    className="border border-border/50 rounded-xl overflow-hidden bg-card hover:shadow-md transition-shadow duration-300"
                >
                    <button
                        className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
                        onClick={() => toggleFAQ(index)}
                    >
                        <h3 className="font-semibold text-foreground pr-4">{faq.question}</h3>
                        {openIndex === index ? (
                            <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        )}
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'
                            }`}
                    >
                        <div className="px-6 pb-4 text-muted-foreground leading-relaxed">
                            {faq.answer}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
