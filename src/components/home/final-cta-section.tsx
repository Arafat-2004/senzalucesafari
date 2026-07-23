"use client";

import { Shield, Users, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export function FinalCTASection() {
    const features = [
        {
            icon: Shield,
            title: 'Best Price Guarantee',
            description: 'We match any comparable safari quote. Book with confidence knowing you\'re getting the best deal.'
        },
        {
            icon: Users,
            title: 'Expert Local Guides',
            description: 'Our knowledgeable guides have decades of experience and deep passion for Tanzanian wildlife.'
        },
        {
            icon: Headphones,
            title: '24/7 Support',
            description: 'From planning to return, our dedicated team is always available to assist you.'
        }
    ];

    return (
        <section className="bg-muted/20 py-12 sm:py-16 md:py-20 lg:py-24">
            <div className="container px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
                <motion.div
                    className="text-center mb-10 sm:mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                        Ready for Your Dream Safari?
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Let us help you create an unforgettable Tanzanian adventure tailored to your wishes.
                    </p>
                </motion.div>

                {/* Feature Icons */}
                <motion.div
                    className="mb-10 grid grid-cols-1 gap-4 sm:mb-12 md:grid-cols-3 md:gap-5"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {features.map((feature, index) => (
                        <div key={index} className="flex h-full flex-col items-center rounded-2xl border border-border/50 bg-card p-6 text-center shadow-sm">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                                <feature.icon className="h-7 w-7 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* CTA Button */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Button variant="safari" className="font-semibold">
                        <Link href="/enquiry" className="inline-flex items-center">
                            Get a Free Quote
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
