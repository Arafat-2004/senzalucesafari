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
        <section className="relative z-20 -mt-12 px-3 sm:-mt-16 sm:px-4 md:-mt-20 md:px-6 lg:px-8">
            <div className="container max-w-7xl mx-auto">
                <StaggerContainer staggerDelay={0.1} className="rounded-[1.25rem] bg-background/70 p-2 shadow-sm backdrop-blur-sm sm:p-3">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
                        {cards.map((card, index) => (
                            <StaggerItem key={index} className="h-full">
                                <SpotlightCard spotlightColor="rgba(85, 199, 134, 0.16)" className="h-full rounded-2xl shadow-sm">
                                    <motion.div
                                        variants={cardHover}
                                        initial="rest"
                                        whileHover="hover"
                                        className="flex h-full flex-col p-4 sm:p-5"
                                    >
                                        <div className="flex h-full items-start gap-3 sm:gap-4">
                                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10" title={card.title}>
                                                <card.icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="mb-1.5 text-sm font-bold leading-tight text-foreground sm:text-base">{card.title}</h3>
                                                <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">{card.description}</p>
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
