"use client";

import { useTranslations } from 'next-intl';
import { Link as I18nLink } from '@/i18n/navigation';
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
    const t = useTranslations();

    return (
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
            {/* Background image - LCP element optimized */}
            <div className="absolute inset-0">
                <Image
                    src="/images/vehicles/land-cruiser-vx.jpg"
                    alt="Safari Vehicles Fleet"
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                    fetchPriority="high"
                    quality={85}
                    // Disable blur to reduce layerize time
                    placeholder="empty"
                />
                {/* Simplified overlay - reduced CSS complexity */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
            </div>

            <div className="relative z-10 container px-4 text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                    {t('vehicles.hero.title')}
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
                    {t('vehicles.hero.subtitle')}
                </p>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg" nativeButton={false} render={<I18nLink href="#fleet-details" className="inline-flex items-center" />}>
                    {t('vehicles.hero.cta')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </div>
        </section>
    );
}
