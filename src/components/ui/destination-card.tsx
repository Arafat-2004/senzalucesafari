"use client";

import Link from 'next/link';
import Image from "next/image";
import { MapPin, ArrowRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface DestinationCardProps {
    name: string;
    slug: string;
    imageUrl: string;
    region: string;
    shortDescription: string;
    highlights: string[];
    bestTimeToGo: string[];
    badge?: string;
    className?: string;
    isFeatured?: boolean;
}

export function DestinationCard({
    name,
    slug,
    imageUrl,
    region,
    shortDescription,
    highlights,
    bestTimeToGo,
    badge,
    className,
    isFeatured,
}: DestinationCardProps) {
    return (
        <Link href={`/destinations/${slug}`} className={cn("group block", className)}>
            <div className={cn(
                "relative bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col",
                isFeatured && "md:flex-row md:aspect-auto md:min-h-[320px]"
            )}>
                {/* Image Container */}
                <div className={cn(
                    "relative aspect-[16/10] overflow-hidden bg-muted flex-shrink-0",
                    isFeatured ? "md:aspect-auto md:w-2/5" : "w-full"
                )}>
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes={isFeatured ? "(max-width: 768px) 100vw, 40vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                    />

                    {/* Badge - Top Right (TanView Style) */}
                    {badge && (
                        <div className="absolute top-3 right-3 px-3 py-1.5 bg-primary text-white text-[10px] font-bold uppercase tracking-wide rounded-full shadow-lg">
                            {badge}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className={cn(
                    "p-5 flex flex-col flex-1",
                    isFeatured && "lg:p-8 lg:justify-center"
                )}>
                    {/* Title with Location Pin (Right-aligned) */}
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {name}
                        </h3>
                        <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{region}</p>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                        {shortDescription}
                    </p>

                    {/* Feature Pills (TanView Style - Horizontal with icons) */}
                    {highlights && highlights.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {highlights.slice(0, 3).map((highlight, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-secondary/50 text-secondary-foreground text-[11px] rounded-full font-medium"
                                >
                                    <span className="text-primary">●</span>
                                    {highlight}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Best Time & Discover Link Row */}
                    <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                        {bestTimeToGo && bestTimeToGo.length > 0 && (
                            <span className="inline-flex items-center px-2.5 py-1 bg-muted text-muted-foreground text-[11px] rounded-full font-medium">
                                <Calendar className="w-3 h-3 mr-1" /> {bestTimeToGo[0]}
                            </span>
                        )}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-full text-primary font-bold text-xs group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                            <span>Discover {name.split(' ')[0]}</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
