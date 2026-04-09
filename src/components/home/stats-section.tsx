"use client";

import { Users, Award, MapPin, Calendar } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/scroll-animation";
import { motion } from "framer-motion";
import { cardHover } from "@/lib/motion-variants";
import { useTranslations } from 'next-intl';

export function StatsSection() {
    const t = useTranslations();
    const stats = [
        {
            icon: Users,
            value: 500,
            suffix: "+",
            label: t('home.stats.happyTravelers'),
            color: "text-primary"
        },
        {
            icon: Award,
            value: 50,
            suffix: "+",
            label: t('home.stats.safariPackages'),
            color: "text-accent"
        },
        {
            icon: MapPin,
            value: 15,
            suffix: "+",
            label: t('home.stats.destinations'),
            color: "text-primary"
        },
        {
            icon: Calendar,
            value: 10,
            suffix: "+",
            label: t('home.stats.yearsExperience'),
            color: "text-accent"
        }
    ];

    function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
        const [count, setCount] = useState(0);
        const ref = useRef<HTMLDivElement>(null);
        const [isVisible, setIsVisible] = useState(false);

        useEffect(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                },
                { threshold: 0.5 }
            );

            if (ref.current) {
                observer.observe(ref.current);
            }

            return () => observer.disconnect();
        }, []);

        useEffect(() => {
            if (!isVisible) return;

            let start = 0;
            const duration = 2000;
            const increment = target / (duration / 16);

            const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                    setCount(target);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);

            return () => clearInterval(timer);
        }, [isVisible, target]);

        return (
            <div ref={ref} className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">
                {count}{suffix}
            </div>
        );
    }

    return (
        <section className="py-16 md:py-24 bg-gradient-to-br from-secondary/30 via-background to-secondary/20">
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
                                        <stat.icon className={`w-10 h-10 md:w-12 md:h-12 mx-auto ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
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
