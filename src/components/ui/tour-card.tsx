"use client";

import Link from 'next/link';
import Image from "next/image";
import { MapPin, Star, Clock, CheckCircle, Zap, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TourPackage } from "@/data/tours";
import { useAnalytics, ANALYTICS_EVENTS } from "@/lib/analytics/hooks";
import { FavouriteButton } from "@/components/ui/favourite-button";

interface TourCardProps {
    tour: TourPackage;
    className?: string;
    style?: React.CSSProperties;
    onBookClick?: (tour: TourPackage) => void;
    onCompareToggle?: (tour: TourPackage) => void;
    isComparing?: boolean;
}

export function TourCard({
    tour,
    className,
    style,
    onBookClick,
    onCompareToggle,
    isComparing = false,
}: TourCardProps) {
    const { trackCTA } = useAnalytics();
    
    // Extract data from tour object
    const {
        name,
        slug,
        imageUrl,
        duration,
        priceFrom: price,
        rating: ratingRaw,
        reviewCount,
        startEnd,
        highlights,
        category
    } = tour;

    // Parse locations from startEnd
    const locations = startEnd.split(/[•\-\–]+/).map(loc => loc.trim()).filter(Boolean);

    // Convert rating from /10 to /5 scale
    const rating = ratingRaw ? ratingRaw / 2 : undefined;
    const ratingLabel = rating ? `${rating.toFixed(1)} / 5` : undefined;

    // Extract number of days from duration string
    const getDaysNumber = (dur: string): number => {
        const match = dur.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    };

    const days = getDaysNumber(duration);
    const perDayPrice = days > 0 ? Math.round(price / days) : price;
    const isHighDemand = ratingRaw && ratingRaw >= 4.5;

    return (
        <div className={cn("group block", className)} style={style}>
            <div className="relative bg-card rounded-xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <Image
                        src={imageUrl || "/images/placeholders/serengeti.jpg"}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={false}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/images/placeholders/serengeti.jpg";
                        }}
                    />

                    {/* Gradient Overlay - Always visible for better text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {/* Top Badges Row */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-start">
                        <div className="px-2.5 py-1.5 bg-primary text-white text-xs font-bold rounded-lg shadow-md flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{days} Days</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            {isHighDemand ? (
                                <div className="px-2 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-lg shadow-md flex items-center gap-1">
                                    <Zap className="w-3 h-3" />
                                    <span>High Demand</span>
                                </div>
                            ) : (!ratingRaw || ratingRaw === 0) ? (
                                <div className="px-2 py-1 bg-primary text-white text-[10px] font-bold rounded-lg shadow-md flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-white text-white" />
                                    <span>Staff Pick</span>
                                </div>
                            ) : null}
                            <FavouriteButton tourId={tour.id} />
                        </div>
                    </div>

                    {/* Category Badge - Below Duration */}
                    <div className="absolute top-11 left-2.5 px-2.5 py-1 bg-background/95 backdrop-blur-sm text-primary text-[10px] font-semibold rounded-md shadow-sm uppercase tracking-wide">
                        {category.split(' ')[0]}
                    </div>

                    {/* Compare Checkbox - Bottom Left */}
                    {onCompareToggle && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onCompareToggle(tour);
                            }}
                            className={`absolute bottom-2.5 left-2.5 px-2.5 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 text-xs font-semibold transition-all ${isComparing
                                    ? 'bg-primary text-white'
                                    : 'bg-background/95 backdrop-blur-sm text-muted-foreground hover:text-primary'
                                }`}
                        >
                            <CheckCircle className={`w-3.5 h-3.5 ${isComparing ? 'fill-white' : ''}`} />
                            <span>{isComparing ? 'Added' : 'Compare'}</span>
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                    {/* Title - More prominent */}
                    <h3 className="text-base font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug min-h-[2.75rem]">
                        {name}
                    </h3>

                    {/* Locations with Icon - Compact */}
                    <div className="flex items-start space-x-1.5 text-xs text-muted-foreground mb-3">
                        <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-primary" />
                        <span className="line-clamp-1">{locations.join(", ")}</span>
                    </div>

                    {/* Highlights/Badges - Smaller and more compact */}
                    {highlights && highlights.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 mb-3 min-h-[1.5rem]">
                            {highlights.slice(0, 2).map((highlight, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-0.5 bg-secondary/50 text-secondary-foreground text-[10px] rounded-md font-medium"
                                >
                                    {highlight}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="mb-3 min-h-[1.5rem]" />
                    )}

                    {/* Rating - More compact */}
                    {rating ? (
                        <div className="flex items-center space-x-1.5 mb-3 pb-3 border-b border-border/50">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-3.5 h-3.5 ${i < Math.floor(rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "fill-gray-200 text-gray-200"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs font-semibold text-foreground">
                                {ratingLabel}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                                ({reviewCount || 0})
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-1.5 mb-3 pb-3 border-b border-border/50 text-muted-foreground text-xs min-h-[1.75rem]">
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">
                                New Adventure
                            </span>
                            <span className="text-[10px]">•</span>
                            <span>No reviews yet</span>
                        </div>
                    )}

                    {/* Price and CTA - With per-day pricing and trust signals */}
                    <div className="mt-auto pt-2">
                        <div className="flex items-end justify-between mb-2">
                            <div>
                                <span className="text-[10px] text-muted-foreground block mb-0.5 uppercase tracking-wide">From</span>
                                <div className="flex items-baseline gap-0.5">
                                    <span className="text-2xl font-bold text-primary whitespace-nowrap">
                                        ${price.toLocaleString()}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">PP</span>
                                </div>
                                {days > 0 && (
                                    <span className="text-[10px] text-green-600 font-medium whitespace-nowrap block mt-0.5">
                                        ${perDayPrice}/day
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Trust Microcopy */}
                        <div className="flex items-center gap-2 mb-3 text-[10px] text-muted-foreground">
                            <Shield className="w-3 h-3 text-green-600" />
                            <span>Free cancellation</span>
                            <span className="text-border">•</span>
                            <span>Best price guarantee</span>
                        </div>

                        {/* Two Buttons - Primary + Secondary */}
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                aria-label={`Book ${name}`}
                                size="sm"
                                variant="safari"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    trackCTA('book', 'tour_card', tour.id);
                                    if (onBookClick) {
                                        onBookClick(tour);
                                    }
                                }}
                            >
                                Book Now
                            </Button>
                            <Link
                                href={`/safaris-tours/${slug}`}
                                aria-label={`View details for ${name}`}
                                className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold h-9 border border-primary text-primary hover:bg-primary/5 rounded-md transition-colors w-full"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Details
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
