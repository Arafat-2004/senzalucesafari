"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { AnimatedGradient } from "@/components/ui/animated-gradient";

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
                console.log("Autoplay prevented:", err);
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
                {/* Enhanced Overlay - Dark overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 pointer-events-none" />
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
                    className="mb-3 md:mb-6 text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight max-w-full drop-shadow-2xl"
                >
                    Experience the Wild Beauty of Tanzania
                </motion.h1>

                {/* Lead paragraph with staggered reveal */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                    className="mx-auto max-w-3xl text-sm sm:text-base md:text-lg lg:text-xl mb-4 md:mb-8 text-white font-light leading-relaxed px-2 drop-shadow-lg"
                >
                    Discover unforgettable safari adventures across Serengeti, Ngorongoro, Tarangire, and beyond with our expert local guides.
                </motion.p>

                {/* CTA Button with fade in */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
                >
                    <Button size="lg" className="btn-safari shadow-xl hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105 rounded-full">
                        <Link href="/enquiry" prefetch={true} className="inline-flex items-center font-semibold uppercase tracking-wide">
                            Start Your Journey
                            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
