import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
    title: string;
    subtitle?: string;
    backgroundImage: string;
    ctaText?: string;
    ctaLink?: string;
    overlayOpacity?: number;
    height?: string;
    children?: ReactNode;
}

export function HeroSection({
    title,
    subtitle,
    backgroundImage,
    ctaText,
    ctaLink,
    overlayOpacity = 0.6,
    height = "h-[500px] md:h-[600px]",
    children
}: HeroSectionProps) {
    return (
        <section className={`relative ${height} flex items-center justify-center overflow-hidden`}>
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src={backgroundImage}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                />
                {/* Gradient Overlay */}
                <div
                    className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"
                    style={{ opacity: overlayOpacity }}
                />
            </div>

            {/* Content */}
            <div className="container relative z-10 px-4 text-center text-white">
                <h1 className="mb-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight drop-shadow-2xl leading-tight">
                    {title}
                </h1>

                {subtitle && (
                    <p className="mx-auto max-w-2xl text-lg sm:text-xl mb-8 text-gray-100 drop-shadow-lg font-light">
                        {subtitle}
                    </p>
                )}

                {children}

                {ctaText && ctaLink && (
                    <Button size="lg" className="btn-safari text-base sm:text-lg px-8 py-6 h-auto shadow-2xl hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105 border-2 border-white/20">
                        <Link href={ctaLink} className="inline-flex items-center font-semibold">
                            {ctaText}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                )}
            </div>
        </section>
    );
}
