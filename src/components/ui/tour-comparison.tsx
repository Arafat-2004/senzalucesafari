"use client";

import { useState, useEffect } from "react";
import { TourPackage } from "@/data/tours";
import { X, Check, Star, Clock, MapPin, Users, DollarSign, Award, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";
import Image from "next/image";

interface TourComparisonProps {
    tours: TourPackage[];
    onRemoveTour: (tourId: string) => void;
    onClose: () => void;
    isOpen: boolean;
}

export function TourComparison({ tours, onRemoveTour, onClose, isOpen }: TourComparisonProps) {
    const [scrollPosition, setScrollPosition] = useState(0);

    if (tours.length === 0) return null;

    // Find best value (highest rating to price ratio)
    const getBestValue = () => {
        if (tours.length === 0) return null;
        return tours.reduce((best, tour) => {
            const ratio = tour.rating / tour.priceFrom;
            const bestRatio = best.rating / best.priceFrom;
            return ratio > bestRatio ? tour : best;
        });
    };

    const bestValueTour = getBestValue();

    const scrollLeft = () => {
        setScrollPosition(prev => Math.max(0, prev - 1));
    };

    const scrollRight = () => {
        setScrollPosition(prev => Math.min(tours.length - 1, prev + 1));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-7xl w-[95vw] max-h-[90vh] overflow-hidden p-0">
                <DialogHeader className="px-6 pt-6 pb-4 border-b">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl font-bold">
                            Compare Safari Tours ({tours.length})
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
                    {/* Mobile: Scrollable cards */}
                    <div className="lg:hidden">
                        <div className="relative">
                            {tours.length > 1 && (
                                <>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur"
                                        onClick={scrollLeft}
                                        disabled={scrollPosition === 0}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur"
                                        onClick={scrollRight}
                                        disabled={scrollPosition >= tours.length - 1}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </>
                            )}

                            <div
                                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide p-4"
                                style={{ scrollSnapType: 'x mandatory' }}
                            >
                                {tours.map((tour) => (
                                    <div
                                        key={tour.id}
                                        className="flex-shrink-0 w-[85vw] max-w-sm snap-center"
                                    >
                                        <TourComparisonCard
                                            tour={tour}
                                            isBestValue={tour.id === bestValueTour?.id}
                                            onRemove={() => onRemoveTour(tour.id)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Desktop: Side-by-side grid */}
                    <div className="hidden lg:grid gap-6 p-6" style={{ gridTemplateColumns: `repeat(${tours.length}, 1fr)` }}>
                        {tours.map((tour) => (
                            <TourComparisonCard
                                key={tour.id}
                                tour={tour}
                                isBestValue={tour.id === bestValueTour?.id}
                                onRemove={() => onRemoveTour(tour.id)}
                            />
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

interface TourComparisonCardProps {
    tour: TourPackage;
    isBestValue: boolean;
    onRemove: () => void;
}

function TourComparisonCard({ tour, isBestValue, onRemove }: TourComparisonCardProps) {
    return (
        <div className={`relative bg-card rounded-xl border-2 overflow-hidden ${isBestValue ? 'border-primary shadow-lg' : 'border-border/50'
            }`}>
            {/* Best Value Badge */}
            {isBestValue && (
                <div className="absolute top-0 left-0 right-0 bg-primary text-white text-center py-2 text-sm font-bold z-10">
                    ⭐ BEST VALUE
                </div>
            )}

            {/* Remove Button */}
            <button
                onClick={onRemove}
                className="absolute top-2 right-2 z-20 p-1.5 bg-background/90 backdrop-blur rounded-full hover:bg-red-500 hover:text-white transition-colors"
            >
                <X className="w-4 h-4" />
            </button>

            {/* Tour Image */}
            <div className={`relative ${isBestValue ? 'pt-10' : ''} aspect-video`}>
                <Image
                    src={tour.imageUrl}
                    alt={tour.name}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg leading-tight mb-1">{tour.name}</h3>
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                        <Star className="w-4 h-4 fill-current text-yellow-400" />
                        <span>{tour.rating}/10</span>
                        <span>({tour.reviewCount} reviews)</span>
                    </div>
                </div>
            </div>

            {/* Tour Details */}
            <div className="p-5 space-y-4">
                {/* Price */}
                <div className={`p-4 rounded-lg ${isBestValue ? 'bg-primary/10 border border-primary/30' : 'bg-muted/50'}`}>
                    <div className="flex items-baseline gap-2">
                        <DollarSign className="w-5 h-5 text-primary" />
                        <span className="text-3xl font-bold text-primary">${tour.priceFrom.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">per person</p>
                </div>

                {/* Key Info */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                        <div>
                            <p className="text-xs text-muted-foreground">Duration</p>
                            <p className="text-sm font-semibold">{tour.duration}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                        <div>
                            <p className="text-xs text-muted-foreground">Start/End</p>
                            <p className="text-sm font-semibold">{tour.startEnd}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-primary flex-shrink-0" />
                        <div>
                            <p className="text-xs text-muted-foreground">Category</p>
                            <p className="text-sm font-semibold">{tour.category}</p>
                        </div>
                    </div>
                </div>

                {/* Highlights */}
                <div>
                    <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        Highlights
                    </h4>
                    <ul className="space-y-2">
                        {tour.highlights.slice(0, 4).map((highlight, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground">{highlight}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* What's Included */}
                <div>
                    <h4 className="text-sm font-bold mb-2">What&apos;s Included</h4>
                    <ul className="space-y-1">
                        {tour.included.slice(0, 3).map((item, index) => (
                            <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                                <Check className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                        {tour.included.length > 3 && (
                            <li className="text-xs text-primary font-medium">+{tour.included.length - 3} more</li>
                        )}
                    </ul>
                </div>

                {/* CTA Button */}
                <Link href={`/safaris-tours/${tour.slug}`} className="block">
                    <Button className="w-full" variant={isBestValue ? "default" : "outline"}>
                        View Details
                    </Button>
                </Link>
            </div>
        </div>
    );
}

// Hook to manage tour comparison state
export function useTourComparison() {
    const [compareTours, setCompareTours] = useState<TourPackage[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const saved = localStorage.getItem('compareTours');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [showComparison, setShowComparison] = useState(false);

    // Save to localStorage when changed
    useEffect(() => {
        if (compareTours.length > 0) {
            localStorage.setItem('compareTours', JSON.stringify(compareTours));
        } else {
            localStorage.removeItem('compareTours');
        }
    }, [compareTours]);

    const addTour = (tour: TourPackage) => {
        if (compareTours.find(t => t.id === tour.id)) {
            return; // Already added
        }
        if (compareTours.length >= 4) {
            return; // Max 4 tours
        }
        setCompareTours(prev => [...prev, tour]);
    };

    const removeTour = (tourId: string) => {
        setCompareTours(prev => prev.filter(t => t.id !== tourId));
    };

    const isAdded = (tourId: string) => {
        return compareTours.some(t => t.id === tourId);
    };

    const clearAll = () => {
        setCompareTours([]);
        setShowComparison(false);
    };

    return {
        compareTours,
        showComparison,
        setShowComparison,
        addTour,
        removeTour,
        isAdded,
        clearAll,
        count: compareTours.length
    };
}
