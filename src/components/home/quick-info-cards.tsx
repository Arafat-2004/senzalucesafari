"use client";

import { DollarSign, Camera, Clock, Leaf } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/ui/scroll-animation";
import { motion } from "framer-motion";
import { cardHover } from "@/lib/motion-variants";
import { useTranslations } from 'next-intl';

export function QuickInfoCards() {
    const t = useTranslations();
    const cards = [
        {
            icon: DollarSign,
            title: t('home.quickInfo.greatValue.title'),
            description: t('home.quickInfo.greatValue.description')
        },
        {
            icon: Camera,
            title: t('home.quickInfo.wildlife.title'),
            description: t('home.quickInfo.wildlife.description')
        },
        {
            icon: Clock,
            title: t('home.quickInfo.flexible.title'),
            description: t('home.quickInfo.flexible.description')
        },
        {
            icon: Leaf,
            title: t('home.quickInfo.eco.title'),
            description: t('home.quickInfo.eco.description')
        }
    ];

    return (
        <section className="relative -mt-12 sm:-mt-16 md:-mt-20 z-20 px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="container max-w-7xl mx-auto">
                <StaggerContainer staggerDelay={0.1}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                        {cards.map((card, index) => (
                            <StaggerItem key={index}>
                                <motion.div
                                    variants={cardHover}
                                    initial="rest"
                                    whileHover="hover"
                                    className="bg-card rounded-xl shadow-lg p-4 sm:p-5 md:p-6 hover:shadow-xl transition-shadow duration-300 border border-border touch-manipulation"
                                >
                                    <div className="flex items-start space-x-3 sm:space-x-4">
                                        <div className="p-2.5 sm:p-3 bg-primary/10 rounded-lg flex-shrink-0">
                                            <card.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-bold text-sm sm:text-base text-foreground mb-1 leading-tight">{card.title}</h3>
                                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </StaggerItem>
                        ))}
                    </div>
                </StaggerContainer>
            </div>
        </section>
    );
}
