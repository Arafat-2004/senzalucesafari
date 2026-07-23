"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Circle, MapPin } from "lucide-react";
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
            <div
                className={cn(
                    "relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl",
                    isFeatured && "md:min-h-[320px] md:flex-row md:aspect-auto",
                )}
            >
                <div
                    className={cn(
                        "relative flex-shrink-0 overflow-hidden bg-muted aspect-[16/10]",
                        isFeatured ? "md:aspect-auto md:w-2/5" : "w-full",
                    )}
                >
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes={isFeatured ? "(max-width: 768px) 100vw, 40vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                    />

                    {badge && (
                        <div className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground shadow-lg">
                            {badge}
                        </div>
                    )}
                </div>

                <div className={cn("flex flex-1 flex-col p-5", isFeatured && "lg:justify-center lg:p-8")}>
                    <div className="mb-2 flex items-start justify-between gap-3">
                        <h3 className="line-clamp-1 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                            {name}
                        </h3>
                        <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-primary" aria-hidden="true" />
                    </div>
                    <p className="mb-3 text-xs text-muted-foreground">{region}</p>

                    <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {shortDescription}
                    </p>

                    {highlights && highlights.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                            {highlights.slice(0, 3).map((highlight, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-secondary/50 px-2.5 py-1.5 text-[11px] font-medium text-secondary-foreground"
                                >
                                    <Circle className="h-2 w-2 fill-primary text-primary" aria-hidden="true" />
                                    {highlight}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/50 pt-4">
                        {bestTimeToGo && bestTimeToGo.length > 0 && (
                            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                                <Calendar className="mr-1 h-3 w-3" aria-hidden="true" /> {bestTimeToGo[0]}
                            </span>
                        )}
                        <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary shadow-sm transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                            <span>Discover {name.split(" ")[0]}</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
