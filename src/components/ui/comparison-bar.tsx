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
    onCompare: (tours: TourPackage[]) => void;
}

export function ComparisonBar({ tours, onRemoveTour, onClearAll, onCompare }: ComparisonBarProps) {
    const [showComparison, setShowComparison] = useState(false);

    if (tours.length === 0) {
        return <></>;
    }

    return (
        <>
            {/* Floating Comparison Bar */}
            <div className="fixed bottom-[calc(6.5rem+env(safe-area-inset-bottom))] left-1/2 z-40 w-[calc(100vw-1rem)] max-w-2xl -translate-x-1/2 animate-in fade-in slide-in-from-bottom-5 duration-300 lg:bottom-8">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-2xl border-2 border-primary bg-card px-3 py-3 shadow-2xl sm:flex sm:gap-4 sm:px-6 sm:py-4">
                    {/* Count and Text */}
                    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground sm:h-10 sm:w-10 sm:text-lg">
                            {tours.length}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-foreground sm:text-sm">
                                {tours.length} {tours.length === 1 ? 'Tour' : 'Tours'} Selected
                            </p>
                            <p className="hidden text-xs text-muted-foreground sm:block">
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
                    <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearAll}
                            className="h-10 w-10 px-0 text-muted-foreground hover:text-destructive sm:h-9 sm:w-auto sm:px-3"
                            aria-label="Clear comparison"
                        >
                            <Trash2 className="h-4 w-4 sm:mr-1" />
                            <span className="hidden sm:inline">Clear</span>
                        </Button>
                        <Button
                            onClick={() => {
                                onCompare(tours);
                                setShowComparison(true);
                            }}
                            className="h-10 px-3 text-xs bg-primary text-primary-foreground hover:bg-primary-dark sm:h-9 sm:px-4 sm:text-sm"
                        >
                            <span className="sm:hidden">Compare</span>
                            <span className="hidden sm:inline">Compare Now</span>
                            <ArrowRight className="ml-1 h-4 w-4" />
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
