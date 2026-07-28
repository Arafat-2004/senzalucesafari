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

const HERO_POSTER = "/images/home/hero/experience-hero.jpg";
const HERO_VIDEO_SRC = "https://lmpvkxnudhyxjigugnzj.supabase.co/storage/v1/object/public/videos/hero-video.mp4";
/** Milliseconds to wait for video to start loading before falling back to poster */
const VIDEO_TIMEOUT_MS = 6000;

export function HeroSection() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [videoFailed, setVideoFailed] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { scrollY } = useScroll();
    const isMobile = useIsMobile();
    const isReduced = useReducedMotion();

    // Parallax effect for video background (desktop only)
    const y = useTransform(scrollY, [0, 500], [0, isMobile || isReduced ? 0 : -100]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) {
            // No video element (e.g. when videoFailed is pre-set) — mark loaded
            setIsLoaded(true);
            return;
        }

        // Start a timeout: if the video hasn't fired loadeddata within VIDEO_TIMEOUT_MS,
        // treat it as a failure and fall back to the static poster image.
        timeoutRef.current = setTimeout(() => {
            if (!video.readyState || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
                logger.info("Hero video timed out — falling back to poster image");
                setVideoFailed(true);
                setIsLoaded(true);
            }
        }, VIDEO_TIMEOUT_MS);

        // Attempt autoplay (browsers may block it on low-power mode; we handle both paths)
        video.play().catch(err => {
            // Autoplay blocked is normal — the video may still stream with user gesture
            logger.info("Autoplay prevented", { error: err instanceof Error ? err.message : String(err) });
        });

         
        setIsLoaded(true);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    // videoFailed is intentionally excluded so this only runs on mount
     
    }, []);

    /** Called when the video has enough data to display the first frame. */
    function handleLoadedData() {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsLoaded(true);
    }

    /** Called when the video element encounters an unrecoverable error. */
    function handleVideoError() {
        logger.info("Hero video failed to load — using poster image fallback");
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setVideoFailed(true);
        setIsLoaded(true);
    }

    return (
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Video Background with Parallax */}
            <motion.div
                style={{ y }}
                className="absolute inset-0 w-full h-full overflow-hidden"
            >
                {videoFailed ? (
                    /* ── Poster-image fallback when video fails / times out ── */
                    <div
                        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${HERO_POSTER})` }}
                        role="img"
                        aria-label="Scenic safari landscape — Tanzania"
                    />
                ) : (
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        crossOrigin="anonymous"
                        poster={HERO_POSTER}
                        className="absolute inset-0 w-full h-full object-cover flex-shrink-0"
                        onLoadedData={handleLoadedData}
                        onError={handleVideoError}
                        suppressHydrationWarning
                    >
                        {/* Primary source — Supabase CDN */}
                        <source src={HERO_VIDEO_SRC} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                )}

                {/* Brand-Tinted Dark Overlay Shield for Premium Text Legibility */}
                <div
                    className="absolute inset-0 pointer-events-none z-0"
                    style={{
                        background: "linear-gradient(to bottom, rgba(15, 32, 23, 0.45) 0%, rgba(15, 32, 23, 0.7) 50%, rgba(15, 32, 23, 0.95) 100%)"
                    }}
                />
                {/* Animated Gradient Overlay for Living Effect */}
                <AnimatedGradient
                    colors={["var(--brand-green-ui)", "var(--brand-gold-ui)", "var(--brand-green-light-ui)"]}
                    className="opacity-15 pointer-events-none"
                />
            </motion.div>

            {/* Content - Centered with staggered animations */}
            <div className={`container relative z-10 px-4 md:px-6 lg:px-8 text-center text-white transition-all duration-1000 max-h-screen flex flex-col items-center justify-center ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {/* H1 - Hero Title with TextReveal Animation and Text Shadow */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="mb-3 md:mb-6 text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight max-w-full"
                    style={{ textShadow: "0 2px 10px rgba(0, 0, 0, 0.8), 0 1px 3px rgba(0, 0, 0, 0.6)" }}
                >
                    Private Tanzania Safaris, Designed Around You
                </motion.h1>

                {/* Lead paragraph with staggered reveal and Text Shadow */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                    className="mx-auto max-w-3xl text-sm sm:text-base md:text-lg lg:text-xl mb-4 md:mb-8 text-white font-light leading-relaxed px-2"
                    style={{ textShadow: "0 2px 8px rgba(0, 0, 0, 0.7), 0 1px 2px rgba(0, 0, 0, 0.5)" }}
                >
                    Plan a comfortable, authentic safari across Serengeti, Ngorongoro, Tarangire, Zanzibar, and beyond with trusted local experts.
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
                    style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.8)" }}
                >
                    <span className="flex items-center gap-1.5">
                        <span className="text-brand-gold">★★★★★</span>
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
