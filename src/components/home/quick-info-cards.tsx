"use client";

import { DollarSign, Camera, Clock, Leaf } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/ui/scroll-animation";
import { motion } from "framer-motion";
import { cardHover } from "@/lib/motion-variants";
import { SpotlightCard } from "@/components/ui/spotlight-card";

export function QuickInfoCards() {
    const cards = [
        {
            icon: DollarSign,
            title: 'Great Value',
            description: 'Competitive pricing with no hidden fees. Best price guarantee on all safari packages.'
        },
        {
            icon: Camera,
            title: 'Incredible Wildlife',
            description: 'Home to the Big Five and the Great Migration. Unparalleled wildlife viewing opportunities.'
        },
        {
            icon: Clock,
            title: 'Flexible Booking',
            description: 'Free cancellation up to 30 days before your trip. Easy rescheduling options available.'
        },
        {
            icon: Leaf,
            title: 'Eco-Friendly',
            description: 'Committed to sustainable tourism that supports local communities and conservation efforts.'
        }
    ];

    return (
        <section className="relative -mt-12 sm:-mt-16 md:-mt-20 z-20 px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="container max-w-7xl mx-auto">
                <StaggerContainer staggerDelay={0.1}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                        {cards.map((card, index) => (
                            <StaggerItem key={index}>
                                <SpotlightCard spotlightColor="rgba(34, 197, 94, 0.15)">
                                    <motion.div
                                        variants={cardHover}
                                        initial="rest"
                                        whileHover="hover"
                                        className="p-4 sm:p-5 md:p-6"
                                    >
                                        <div className="flex items-start space-x-3 sm:space-x-4">
                                            <div className="p-2.5 sm:p-3 bg-primary/10 rounded-lg flex-shrink-0" title={card.title}>
                                                <card.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-bold text-sm sm:text-base text-foreground mb-1 leading-tight">{card.title}</h3>
                                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </SpotlightCard>
                            </StaggerItem>
                        ))}
                    </div>
                </StaggerContainer>
            </div>
        </section>
    );
}
