"use client";

import { companyInfo } from "@/data/company";
import { Mail, Phone, MapPin } from "lucide-react";
import { EnhancedSpotlightCard, PulseIcon } from "@/components/ui/contact-card";
import { FloatingParticles } from "@/components/ui/animated-background";

export function ContactContent() {
    return (
        <div className="relative container mb-8 sm:mb-12 md:mb-16 overflow-hidden">
            {/* Floating particles background */}
            <FloatingParticles className="opacity-30" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Email Card */}
                <EnhancedSpotlightCard
                    spotlightColor="rgba(222, 119, 36, 0.2)"
                    icon={
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center">
                            <PulseIcon>
                                <Mail className="w-8 h-8 text-primary" />
                            </PulseIcon>
                        </div>
                    }
                    title="Email"
                    description="We typically respond within 24 hours"
                >
                    <a href={`mailto:${companyInfo.email}`} className="text-primary hover:underline block mb-3 text-center font-semibold text-lg">
                        {companyInfo.email}
                    </a>
                </EnhancedSpotlightCard>

                {/* Phone & WhatsApp Card */}
                <EnhancedSpotlightCard
                    spotlightColor="rgba(232, 137, 58, 0.2)"
                    icon={
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center">
                            <PulseIcon>
                                <Phone className="w-8 h-8 text-primary" />
                            </PulseIcon>
                        </div>
                    }
                    title="Phone & WhatsApp"
                    description="Available Mon-Fri, 8am-6pm EAT"
                >
                    <a href={`tel:${companyInfo.phone}`} className="text-primary hover:underline block mb-2 text-center font-semibold text-lg">
                        {companyInfo.phone}
                    </a>
                    <a href={`https://wa.me/${companyInfo.whatsapp}`} className="text-primary/80 hover:text-primary hover:underline block mb-3 text-center text-sm font-semibold">
                        💬 WhatsApp Available
                    </a>
                </EnhancedSpotlightCard>

                {/* Visit Us Card */}
                <EnhancedSpotlightCard
                    spotlightColor="rgba(200, 106, 30, 0.2)"
                    icon={
                        <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center">
                            <PulseIcon>
                                <MapPin className="w-8 h-8 text-accent" />
                            </PulseIcon>
                        </div>
                    }
                    title="Visit Us"
                    description="Our office is in the heart of safari country"
                >
                    <p className="text-foreground mb-3 text-center font-semibold text-lg">{companyInfo.location}</p>
                </EnhancedSpotlightCard>
            </div>
        </div>
    );
}
