"use client";

import React from 'react';
import { Shield, Award, Leaf, Lock, CheckCircle, Globe } from "lucide-react";

export const TrustBadges = React.memo(function TrustBadges({ variant = "full" }: { variant?: "compact" | "full" }) {
    const badges = [
        {
            icon: Shield,
            title: 'Licensed & Certified',
            description: 'Fully licensed by Tanzania Tourism Board',
            color: "text-primary"
        },
        {
            icon: Award,
            title: 'Award-Winning Service',
            description: 'Recognized for excellence in safari tourism',
            color: "text-accent"
        },
        {
            icon: Leaf,
            title: 'Eco-Friendly Practices',
            description: 'Committed to sustainable tourism',
            color: "text-green-600"
        },
        {
            icon: Lock,
            title: 'Secure Booking',
            description: 'Your data and payments are protected',
            color: "text-blue-600"
        },
        {
            icon: CheckCircle,
            title: 'Best Price Guarantee',
            description: 'We match any comparable quote',
            color: "text-primary"
        },
        {
            icon: Globe,
            title: 'Local Experts',
            description: 'Knowledgeable Tanzanian guides',
            color: "text-accent"
        }
    ];
    if (variant === "compact") {
        return (
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 py-6">
                {badges.slice(0, 4).map((badge, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                        <badge.icon className={`w-5 h-5 ${badge.color}`} />
                        <span className="font-medium hidden sm:inline">{badge.title}</span>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <section className="py-12 md:py-16 bg-secondary/20 border-y border-border/50">
            <div className="container px-4">
                <div className="text-center mb-8">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                        Why Travelers Trust Us
                    </h3>
                    <p className="text-muted-foreground text-sm md:text-base">
                        We deliver exceptional safari experiences with integrity and professionalism
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                    {badges.map((badge, index) => (
                        <div
                            key={index}
                            className="text-center p-4 rounded-xl bg-card hover:shadow-md transition-all group"
                        >
                            <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 mb-3 group-hover:scale-110 transition-transform">
                                <badge.icon className={`w-6 h-6 md:w-7 md:h-7 ${badge.color}`} />
                            </div>
                            <h4 className="font-semibold text-foreground text-sm md:text-base mb-1">
                                {badge.title}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                                {badge.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
});
