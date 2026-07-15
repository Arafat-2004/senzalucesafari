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
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-primary/5">
            <div className="container px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
                <motion.div
                    className="text-center mb-10 sm:mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Ready for Your Dream Safari?
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Let us help you create an unforgettable Tanzanian adventure tailored to your wishes.
                    </p>
                </motion.div>

                {/* Feature Icons */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8 mb-10 sm:mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <feature.icon className="w-8 h-8 text-primary" />
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
