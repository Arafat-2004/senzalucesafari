"use client";

import { useState } from "react";
import { TourPackage } from "@/data/tours";
import { X, ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TourComparison } from "@/components/ui/tour-comparison";
import Image from "next/image";

interface ComparisonBarProps {
    tours: TourPackage[];
    onRemoveTour: (tourId: string) => void;
    onClearAll: () => void;
}

export function ComparisonBar({ tours, onRemoveTour, onClearAll }: ComparisonBarProps) {
    const [showComparison, setShowComparison] = useState(false);

    if (tours.length === 0) {
        return <></>;
    }

    return (
        <>
            {/* Floating Comparison Bar */}
            <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                <div className="bg-card border-2 border-primary shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-4 max-w-2xl mx-4">
                    {/* Count and Text */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                            {tours.length}
                        </div>
                        <div>
                            <p className="font-semibold text-foreground text-sm">
                                {tours.length} {tours.length === 1 ? 'Tour' : 'Tours'} Selected
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Click to compare side-by-side
                            </p>
                        </div>
                    </div>

                    {/* Tour Thumbnails */}
                    <div className="hidden sm:flex items-center gap-2">
                        {tours.map((tour) => (
                            <div key={tour.id} className="relative group">
                                <Image
                                    src={tour.imageUrl}
                                    alt={tour.name}
                                    width={48}
                                    height={48}
                                    className="rounded-lg object-cover border-2 border-border"
                                />
                                <button
                                    onClick={() => onRemoveTour(tour.id)}
                                    className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                                    aria-label={`Remove ${tour.name} from comparison`}
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-auto">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearAll}
                            className="text-muted-foreground hover:text-destructive"
                        >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Clear
                        </Button>
                        <Button
                            onClick={() => setShowComparison(true)}
                            className="bg-primary text-primary-foreground hover:bg-primary-dark"
                        >
                            Compare Now
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Comparison Modal */}
            <TourComparison
                tours={tours}
                onRemoveTour={onRemoveTour}
                onClose={() => setShowComparison(false)}
                isOpen={showComparison}
            />
        </>
    );
}
