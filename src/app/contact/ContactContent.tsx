"use client";

import { companyInfo } from "@/data/company";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { EnhancedSpotlightCard, PulseIcon } from "@/components/ui/contact-card";
import { FloatingParticles } from "@/components/ui/animated-background";

export function ContactContent() {
    return (
        /* Negative margin pulls the card strip UP to overlap the hero bottom edge,
           creating intentional layered depth instead of an awkward hard gap */
        <div className="relative container -mt-12 mb-8 sm:mb-12 md:mb-16 overflow-hidden z-10">
            {/* Floating particles background */}
            <FloatingParticles className="opacity-30" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Email Card */}
                <EnhancedSpotlightCard
                    className="border border-border/60"
                    spotlightColor="rgba(34, 120, 80, 0.15)"
                    icon={
                        /* Solid mint fill — gives the eye a stronger anchor point */
                        <div className="w-16 h-16 bg-primary/15 rounded-2xl flex items-center justify-center">
                            <PulseIcon>
                                <Mail className="w-8 h-8 text-primary" />
                            </PulseIcon>
                        </div>
                    }
                    title="Email"
                    description="We typically respond within 24 hours"
                >
                    <div className="mt-auto pt-4 border-t border-border/30">
                        <a href={`mailto:${companyInfo.email}`} className="text-primary hover:underline block text-center font-semibold text-base">
                            {companyInfo.email}
                        </a>
                    </div>
                </EnhancedSpotlightCard>

                {/* Phone & WhatsApp Card */}
                <EnhancedSpotlightCard
                    className="border border-border/60"
                    spotlightColor="rgba(34, 120, 80, 0.15)"
                    icon={
                        <div className="w-16 h-16 bg-primary/15 rounded-2xl flex items-center justify-center">
                            <PulseIcon>
                                <Phone className="w-8 h-8 text-primary" />
                            </PulseIcon>
                        </div>
                    }
                    title="Phone & WhatsApp"
                    description="Available Mon-Fri, 8am-6pm EAT"
                >
                    <div className="mt-auto pt-4 border-t border-border/30 space-y-2">
                        <a href={`tel:${companyInfo.phone}`} className="text-primary hover:underline block text-center font-semibold text-base">
                            {companyInfo.phone}
                        </a>
                        <a href={`https://wa.me/${companyInfo.whatsapp}`} className="text-primary/70 hover:text-primary hover:underline flex items-center justify-center gap-1.5 text-sm font-medium">
                            <MessageCircle className="w-4 h-4" /> WhatsApp Available
                        </a>
                    </div>
                </EnhancedSpotlightCard>

                {/* Visit Us Card */}
                <EnhancedSpotlightCard
                    className="border border-border/60"
                    spotlightColor="rgba(34, 120, 80, 0.15)"
                    icon={
                        <div className="w-16 h-16 bg-primary/15 rounded-2xl flex items-center justify-center">
                            <PulseIcon>
                                <MapPin className="w-8 h-8 text-primary" />
                            </PulseIcon>
                        </div>
                    }
                    title="Visit Us"
                    description="Our office is in the heart of safari country"
                >
                    <div className="mt-auto pt-4 border-t border-border/30">
                        <p className="text-foreground text-center font-semibold text-base">{companyInfo.location}</p>
                    </div>
                </EnhancedSpotlightCard>
            </div>
        </div>
    );
}
