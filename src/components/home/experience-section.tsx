"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SlideInLeft, SlideInRight } from "@/components/ui/scroll-animation";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Users, Award, MapPin, Calendar, Compass, Car, Leaf } from "lucide-react";

export function ExperienceSection() {
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

    const highlights = [
        {
            icon: Compass,
            title: "Expert Local Guides",
            desc: "Native Tanzanian guides with deep tracking experience, bringing you closer to the Big Five and the Great Migration."
        },
        {
            icon: Car,
            title: "Custom Safari Fleet",
            desc: "Travel in comfort with our custom 4x4 land cruisers, fully equipped with pop-up roofs, charging outlets, and coolers."
        },
        {
            icon: Leaf,
            title: "Eco-Friendly Travel",
            desc: "Committed to sustainable tourism that respects local communities and protects pristine Tanzanian wilderness."
        }
    ];

    return (
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
            <div className="container px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
                    {/* Left Column - Story and Stats */}
                    <SlideInLeft>
                        <div className="space-y-8">
                            <div>
                                <p className="text-primary font-semibold text-sm uppercase tracking-wide mb-3">
                                    Why Choose Us
                                </p>
                                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                                    Authentic Tanzanian Safari Experiences
                                </h2>
                                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-xl">
                                    With over a decade of experience, we specialize in creating unforgettable safari adventures that connect you with Tanzania&apos;s incredible wildlife and rich cultural heritage. We design custom itineraries tailored entirely to your desires, ensuring every detail is perfectly managed.
                                </p>
                            </div>

                            {/* Woven Stats Grid */}
                            <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-4 border-t border-border/40">
                                {stats.map((stat, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-primary/10 flex-shrink-0">
                                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                        </div>
                                        <div>
                                            <div className="flex items-baseline">
                                                <NumberTicker
                                                    value={stat.value}
                                                    suffix={stat.suffix}
                                                    duration={2.0}
                                                    delay={index * 0.15}
                                                    className="text-xl sm:text-2xl font-bold text-foreground"
                                                />
                                            </div>
                                            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                                                {stat.label}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </SlideInLeft>

                    {/* Right Column - Bullet Points with Bold Lead-Ins */}
                    <SlideInRight delay={0.2}>
                        <div className="space-y-6 bg-muted/30 p-6 sm:p-8 rounded-2xl border border-border/50">
                            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                                Crafted for the Discerning Traveler
                            </h3>
                            <div className="space-y-6">
                                {highlights.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm sm:text-base font-bold text-foreground mb-1">
                                                {item.title}
                                            </h4>
                                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-border/40">
                                <Button variant="safari" className="w-full sm:w-auto" nativeButton={false} render={<Link href="/about" />}>
                                    <span className="font-semibold uppercase tracking-wide">
                                        Discover Our Story
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </SlideInRight>
                </div>
            </div>
        </section>
    );
}
