"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FAQSection() {
    const faqs = [
        {
            question: 'What is the best time to go on a safari in Tanzania?',
            answer: 'The best time for safaris in Tanzania is during the dry season from June to October. This is when wildlife viewing is at its peak, especially for witnessing the Great Migration in the Serengeti. However, Tanzania offers year-round safari experiences with each season having its unique advantages.'
        },
        {
            question: 'How many days do I need for a safari?',
            answer: 'We recommend a minimum of 3-4 days for a basic safari experience, but 7-10 days allows you to explore multiple parks and fully immerse yourself in the Tanzanian wilderness. Longer safaris provide better wildlife viewing opportunities and a more comprehensive experience.'
        },
        {
            question: 'Is Tanzania safe for tourists?',
            answer: 'Yes, Tanzania is one of the safest safari destinations in Africa. Our experienced guides ensure your safety throughout the journey. We maintain high safety standards, provide comprehensive briefings, and have emergency protocols in place for all our safari tours.'
        },
        {
            question: 'What should I pack for a safari?',
            answer: 'Essential items include neutral-colored clothing, comfortable walking shoes, sunscreen, hat, sunglasses, binoculars, camera with extra batteries, and any personal medications. We provide a detailed packing list upon booking to ensure you\'re well-prepared.'
        },
        {
            question: 'Can I customize my safari package?',
            answer: 'Absolutely! All our safari packages can be customized to fit your preferences, budget, and schedule. Whether you want to add specific parks, upgrade accommodations, or extend your stay, we\'ll work with you to create your perfect safari experience.'
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
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Everything you need to know before booking your Tanzanian safari adventure.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Accordion type="single" collapsible className="space-y-3">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="border border-border rounded-lg overflow-hidden bg-card px-5"
                            >
                                <AccordionTrigger className="text-left font-medium py-5 hover:no-underline">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>
            </div>
        </section>
    );
}
