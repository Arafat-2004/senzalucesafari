"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { heroText } from "@/lib/motion-variants";
import { useTranslations } from 'next-intl';
import { Link as I18nLink } from '@/i18n/navigation';

export function HeroSection() {
    const t = useTranslations();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const { scrollY } = useScroll();
    const isMobile = useIsMobile();
    const isReduced = useReducedMotion();

    // Parallax effect for video background (desktop only)
    const y = useTransform(scrollY, [0, 500], [0, isMobile || isReduced ? 0 : -100]);

    useEffect(() => {
        // Auto-play video when component mounts
        if (videoRef.current) {
            videoRef.current.play().catch(err => {
                console.log("Autoplay prevented:", err);
            });
        }
        setIsLoaded(true);
    }, []);

    return (
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Video Background with Parallax */}
            <motion.div
                style={{ y }}
                className="absolute inset-0 w-full h-full overflow-hidden"
            >
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="/images/placeholders/hero-safari.jpg"
                    className="absolute inset-0 w-full h-full object-cover flex-shrink-0"
                    onLoadedData={() => setIsLoaded(true)}
                    suppressHydrationWarning
                >
                    {/* Use same video for both mobile and desktop */}
                    <source src="/videos/hero-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                {/* Enhanced Overlay - Matches video exactly using absolute positioning within same container */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 dark:from-[#431F07]/80 dark:via-[#431F07]/60 dark:to-[#431F07]/85 pointer-events-none" />
            </motion.div>

            {/* Content - Centered with staggered animations */}
            <div className={`container relative z-10 px-4 md:px-6 lg:px-8 text-center text-white transition-all duration-1000 max-h-screen flex flex-col items-center justify-center ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {/* H1 - Hero Title with staggered reveal */}
                <motion.h1
                    initial="hidden"
                    animate="visible"
                    custom={0}
                    variants={heroText}
                    className="mb-3 md:mb-6 text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight max-w-full"
                >
                    {t('home.hero.title')}
                </motion.h1>

                {/* Lead paragraph with staggered reveal */}
                <motion.p
                    initial="hidden"
                    animate="visible"
                    custom={1}
                    variants={heroText}
                    className="mx-auto max-w-3xl text-sm sm:text-base md:text-lg lg:text-xl mb-4 md:mb-8 text-white/95 font-light leading-relaxed px-2"
                >
                    {t('home.hero.subtitle')}
                </motion.p>

                {/* CTA Button with fade in */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    custom={2}
                    variants={heroText}
                >
                    <Button size="lg" className="btn-safari text-xs sm:text-sm md:text-base px-5 sm:px-8 py-3 sm:py-5 h-auto shadow-2xl hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105 rounded-full max-w-full">
                        <I18nLink href="/enquiry" prefetch={true} className="inline-flex items-center font-semibold uppercase tracking-wide">
                            {t('home.hero.cta')}
                            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                        </I18nLink>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
