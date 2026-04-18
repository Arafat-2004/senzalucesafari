"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SpotlightCard } from "@/components/ui/spotlight-card";

const categories = [
    {
        title: 'Wildlife Safaris',
        image: "/images/destinations/serengeti/serengeti.jpg",
        link: "/safaris-tours"
    },
    {
        title: 'Kilimanjaro Trekking',
        image: "/images/about/kilimanjaro.jpg",
        link: "/safaris-tours#kilimanjaro"
    },
    {
        title: 'Beach Holidays',
        image: "/images/destinations/zanzibar/zanzibar-beach.jpg",
        link: "/destinations#zanzibar"
    },
    {
        title: 'Cultural Experiences',
        image: "/images/blog/stone-town.jpg",
        link: "/about"
    }
];

export function SafariCategoriesSection() {
    return (
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
            <div className="container px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-10 sm:mb-12 md:mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Choose Your Adventure
                    </h2>
                </motion.div>

                {/* Category Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-7 lg:gap-8">
                    {categories.map((category, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Link href={category.link} className="group block">
                                <SpotlightCard spotlightColor="rgba(249, 115, 22, 0.2)" className="h-[260px] sm:h-[280px] md:h-[300px] lg:h-[320px]">
                                    <div className="relative h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-muted">
                                        {/* Background Image */}
                                        <Image
                                            src={category.image}
                                            alt={category.title}
                                            fill
                                            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        />

                                        {/* Dark Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6">
                                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-primary-light transition-colors">
                                                {category.title}
                                            </h3>
                                            <div className="w-12 h-1 bg-primary rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                                        </div>
                                    </div>
                                </SpotlightCard>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
