"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from 'next-intl';

export function FAQSection() {
    const t = useTranslations();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: t('home.faq.questions.q1'),
            answer: t('home.faq.answers.a1')
        },
        {
            question: t('home.faq.questions.q2'),
            answer: t('home.faq.answers.a2')
        },
        {
            question: t('home.faq.questions.q3'),
            answer: t('home.faq.answers.a3')
        },
        {
            question: t('home.faq.questions.q4'),
            answer: t('home.faq.answers.a4')
        },
        {
            question: t('home.faq.questions.q5'),
            answer: t('home.faq.answers.a5')
        }
    ];

    return (
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
            <div className="container px-3 sm:px-4 md:px-6 lg:px-8 max-w-4xl mx-auto">
                <motion.div
                    className="text-center mb-10 sm:mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="mb-3 text-3xl md:text-4xl font-bold text-foreground uppercase tracking-wide">
                        {t('home.faq.title')}
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        {t('home.faq.description')}
                    </p>
                </motion.div>

                <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border border-border rounded-lg overflow-hidden bg-gradient-to-b from-card to-muted/20"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
                            >
                                <span className="font-medium pr-8">{faq.question}</span>
                                <ChevronDown
                                    className={`w-5 h-5 text-primary transition-transform duration-300 flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-5 pt-0 text-muted-foreground leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
