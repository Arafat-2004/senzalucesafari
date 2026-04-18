"use client";

import { Users, Award, MapPin, Calendar } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/ui/scroll-animation";
import { motion } from "framer-motion";
import { cardHover } from "@/lib/motion-variants";
import { NumberTicker } from "@/components/ui/number-ticker";

export function StatsSection() {
    const stats = [
        {
            icon: Users,
            value: 500,
            suffix: "+",
            label: 'Happy Travelers',
            color: "text-primary"
        },
        {
            icon: Award,
            value: 50,
            suffix: "+",
            label: 'Safari Packages',
            color: "text-accent"
        },
        {
            icon: MapPin,
            value: 15,
            suffix: "+",
            label: 'Destinations',
            color: "text-primary"
        },
        {
            icon: Calendar,
            value: 10,
            suffix: "+",
            label: 'Years Experience',
            color: "text-accent"
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-muted/30">
            <div className="container px-4">
                <StaggerContainer staggerDelay={0.12}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
                        {stats.map((stat, index) => (
                            <StaggerItem key={index}>
                                <motion.div
                                    variants={cardHover}
                                    initial="rest"
                                    whileHover="hover"
                                    className="text-center group p-4 rounded-2xl hover:bg-card hover:shadow-lg transition-shadow duration-300"
                                >
                                    <div className="relative inline-block mb-4">
                                        <stat.icon className={`w-10 h-10 md:w-12 md:h-12 mx-auto ${stat.color}`} />
                                    </div>
                                    <NumberTicker
                                        value={stat.value}
                                        suffix={stat.suffix}
                                        duration={2.5}
                                        delay={index * 0.2}
                                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2"
                                    />
                                    <div className="text-sm md:text-base text-muted-foreground font-medium">
                                        {stat.label}
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
