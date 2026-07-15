"use client";

import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { AnimatedGradient } from "@/components/ui/animated-gradient";
import { logger } from "@/lib/reliability/logger";

export function HeroSection() {
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
                logger.info("Autoplay prevented", { error: err instanceof Error ? err.message : String(err) });
            });
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional hydration mount pattern
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
                    poster="/images/home/hero/experience-hero.jpg"
                    className="absolute inset-0 w-full h-full object-cover flex-shrink-0"
                    onLoadedData={() => setIsLoaded(true)}
                    suppressHydrationWarning
                >
                    {/* Use same video for both mobile and desktop */}
                    <source src="/videos/hero-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                {/* Gradient overlay — transparent at top, dark at bottom */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60 pointer-events-none" />
                {/* Animated Gradient Overlay for Living Effect */}
                <AnimatedGradient
                    colors={["#DE7724", "#E8893A", "#DE7724"]}
                    className="opacity-15 pointer-events-none"
                />
            </motion.div>

            {/* Content - Centered with staggered animations */}
            <div className={`container relative z-10 px-4 md:px-6 lg:px-8 text-center text-white transition-all duration-1000 max-h-screen flex flex-col items-center justify-center ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {/* H1 - Hero Title with TextReveal Animation */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="mb-3 md:mb-6 text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight max-w-full"
                >
                    Experience the Wild Beauty of Tanzania
                </motion.h1>

                {/* Lead paragraph with staggered reveal */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                    className="mx-auto max-w-3xl text-sm sm:text-base md:text-lg lg:text-xl mb-4 md:mb-8 text-white font-light leading-relaxed px-2"
                >
                    Discover unforgettable safari adventures across Serengeti, Ngorongoro, Tarangire, and beyond with our expert local guides.
                </motion.p>

                {/* CTA Button with fade in */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
                >
                    <Button size="lg" variant="safari" className="shadow-xl hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105" nativeButton={false} render={<Link href="/enquiry" prefetch={true} />}>
                        <span className="inline-flex items-center font-semibold uppercase tracking-wide">
                            Start Your Journey
                            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                        </span>
                    </Button>
                    <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 transition-all duration-300" nativeButton={false} render={<Link href="/safaris-tours" prefetch={true} />}>
                        <span className="inline-flex items-center font-semibold uppercase tracking-wide">
                            <Compass className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                            Browse Safaris
                        </span>
                    </Button>
                </motion.div>

                {/* Trust Signals */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
                    className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-white/80"
                >
                    <span className="flex items-center gap-1.5">
                        <span className="text-yellow-400">★★★★★</span>
                        <span>4.9/5 Rating</span>
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span>500+ Happy Travelers</span>
                    <span className="hidden sm:inline">•</span>
                    <span>Licensed by Tanzania Tourism Board</span>
                </motion.div>
            </div>
        </section>
    );
}
