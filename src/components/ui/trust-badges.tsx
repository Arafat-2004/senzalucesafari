"use client";

import React from 'react';
import { Shield, Award, Leaf, Lock, CheckCircle, Globe } from "lucide-react";

export const TrustBadges = React.memo(function TrustBadges({ variant = "full" }: { variant?: "compact" | "full" }) {
    const badges = [
        {
            icon: Shield,
            title: 'Licensed & Certified',
            description: 'Registered and compliant for Tanzania safari operations',
            color: "text-primary"
        },
        {
            icon: Award,
            title: 'Award-Winning Service',
            description: 'Trusted for thoughtful planning and attentive guest care',
            color: "text-featured"
        },
        {
            icon: Leaf,
            title: 'Eco-Friendly Practices',
            description: 'Responsible trips that support nature and local communities',
            color: "text-success"
        },
        {
            icon: Lock,
            title: 'Secure Booking',
            description: 'Your personal details and travel plans are handled carefully',
            color: "text-info"
        },
        {
            icon: CheckCircle,
            title: 'Best Price Guarantee',
            description: 'Fair, transparent quotes with no confusing hidden extras',
            color: "text-primary"
        },
        {
            icon: Globe,
            title: 'Local Experts',
            description: 'Tanzanian guides who understand the land, seasons, and wildlife',
            color: "text-info"
        }
    ];
    if (variant === "compact") {
        return (
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 py-6">
                {badges.slice(0, 4).map((badge, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs md:text-sm text-white/75">
                        {/* Always use white for footer icons — the compact variant is rendered on
                            the dark footer background, so the brand primary colour (which can be
                            set to any hue by the admin) may have very poor contrast there. */}
                        <badge.icon className="w-5 h-5 text-white/90 flex-shrink-0" />
                        <span className="font-medium hidden sm:inline">{badge.title}</span>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <section className="site-section-card border-y border-border/50 py-12 md:py-16">
            <div className="container px-4">
                <div className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
                    <span className="mb-3 inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        Travel With Confidence
                    </span>
                    <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                        Why Travelers Book With Senza Luce
                    </h2>
                    <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                        Clear planning, trusted local guidance, and careful service from your first inquiry to your final airport transfer.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                    {badges.map((badge, index) => (
                        <div
                            key={index}
                            className="group flex h-full flex-col items-center rounded-2xl border border-border/60 bg-card p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md md:p-5"
                        >
                            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-muted ring-1 ring-border/60 transition-transform group-hover:scale-105 md:h-14 md:w-14">
                                <badge.icon className={`w-6 h-6 md:w-7 md:h-7 ${badge.color}`} />
                            </div>
                            <h3 className="mb-1 text-sm font-semibold leading-tight text-foreground md:text-base">
                                {badge.title}
                            </h3>
                            <p className="text-xs leading-relaxed text-muted-foreground">
                                {badge.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
});
