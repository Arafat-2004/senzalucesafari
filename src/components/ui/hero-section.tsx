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
    overlayOpacity = 0.6,
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
                                  background: "linear-gradient(135deg, rgba(12, 28, 20, 0.75) 0%, rgba(18, 40, 28, 0.35) 50%, rgba(12, 28, 20, 0.75) 100%)",
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
                        className="mx-auto max-w-2xl text-lg sm:text-xl mb-8 text-gray-100 font-light hero-subtitle-text"
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
