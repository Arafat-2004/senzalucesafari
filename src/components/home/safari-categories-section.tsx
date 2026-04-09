"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { Link as I18nLink } from '@/i18n/navigation';

const categories = [
    {
        key: 'wildlifeSafari',
        image: "/images/placeholders/serengeti.jpg",
        link: "/safaris-tours"
    },
    {
        key: 'kilimanjaro',
        image: "/images/placeholders/kilimanjaro.jpg",
        link: "/safaris-tours#kilimanjaro"
    },
    {
        key: 'beachHolidays',
        image: "/images/placeholders/zanzibar-beach.jpg",
        link: "/destinations#zanzibar"
    },
    {
        key: 'culturalExperiences',
        image: "/images/placeholders/stone-town.jpg",
        link: "/about"
    }
];

export function SafariCategoriesSection() {
    const t = useTranslations();
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
                        {t('home.safariCategories.title')}
                    </h2>
                </motion.div>

                {/* Category Cards Grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-7 lg:gap-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {categories.map((category, index) => (
                        <I18nLink
                            key={index}
                            href={category.link}
                            className="group block"
                        >
                            <div className="relative h-[260px] sm:h-[280px] md:h-[300px] lg:h-[320px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-muted">
                                {/* Background Image */}
                                <Image
                                    src={category.image}
                                    alt={t(`home.safariCategories.${category.key}`)}
                                    fill
                                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                />

                                {/* Dark Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-primary-light transition-colors">
                                        {t(`home.safariCategories.${category.key}`)}
                                    </h3>
                                    <div className="w-12 h-1 bg-primary rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                                </div>
                            </div>
                        </I18nLink>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
