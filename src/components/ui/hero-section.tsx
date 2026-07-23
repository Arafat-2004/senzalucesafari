import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
    title: string;
    subtitle?: string;
    backgroundImage: string;
    ctaText?: string;
    ctaLink?: string;
    overlayOpacity?: number;
    height?: string;
    children?: ReactNode;
    overlayClassName?: string;
    overlayStyle?: React.CSSProperties;
}

export function HeroSection({
    title,
    subtitle,
    backgroundImage,
    ctaText,
    ctaLink,
    overlayOpacity = 1,
    height = "h-[500px] md:h-[600px]",
    children,
    overlayClassName,
    overlayStyle
}: HeroSectionProps) {
    return (
        <section className={`relative ${height} flex items-center justify-center overflow-hidden`}>
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src={backgroundImage}
                    alt={title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                />
                {/* Brand-Tinted Sophisticated Contrast Shield Layer */}
                <div
                    className={cn(
                        "absolute inset-0 pointer-events-none",
                        overlayClassName
                    )}
                    style={
                        overlayStyle
                            ? overlayStyle
                            : {
                                  background: "linear-gradient(to bottom, rgba(3, 9, 6, 0.24) 0%, rgba(3, 9, 6, 0.42) 48%, rgba(3, 9, 6, 0.82) 100%)",
                                  opacity: overlayOpacity
                              }
                    }
                />
            </div>

            {/* Content */}
            <div className="container relative z-10 px-4 sm:px-6 text-center text-white hero-content-wrapper">
                <h1 
                    className="mb-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight hero-h1-title"
                    style={{
                        textShadow: "0 2px 4px rgba(0, 0, 0, 0.35), 0 8px 20px rgba(0, 0, 0, 0.25)"
                    }}
                >
                    {title}
                </h1>

                {subtitle && (
                    <p 
                        className="hero-subtitle-text mx-auto mb-8 max-w-2xl text-lg font-light text-white/90 sm:text-xl"
                        style={{
                            textShadow: "0 2px 6px rgba(0, 0, 0, 0.4)"
                        }}
                    >
                        {subtitle}
                    </p>
                )}

                {children}

                {ctaText && ctaLink && (
                    <Button size="lg" variant="safari" nativeButton={false} render={<Link href={ctaLink} />}>
                        <span className="inline-flex items-center font-semibold">
                            {ctaText}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </span>
                    </Button>
                )}
            </div>
        </section>
    );
}
