"use client";

import { useEffect, useState } from "react";
import { TourPackage } from "@/data/tours";
import { X, Check, Star, Clock, MapPin, Users, DollarSign, Award, ChevronLeft, ChevronRight, Link as LinkIcon } from "lucide-react";
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
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);

  const copyShareLink = () => {
    if (typeof window === 'undefined') return;
    const base = window.location.origin + window.location.pathname;
    const ids = tours.map(t => t.id);
    const url = ids.length ? `${base}?compare=${ids.join(',')}` : base;
    navigator.clipboard?.writeText(url).then(() => {
      import('@/lib/ui/toast').then(mod => mod.showToast('Shareable link copied', { type: 'success' }));
    }).catch(() => {
      import('@/lib/ui/toast').then(mod => mod.showToast('Failed to copy link', { type: 'error' }));
    });
  };

  if (tours.length === 0) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="fixed inset-0 h-full w-full max-w-none max-h-screen sm:relative sm:max-h-[90dvh] sm:w-[95vw] sm:max-w-md rounded-none sm:rounded-2xl p-6 text-center">
                <DialogHeader>
                    <DialogTitle>Compare Safari Tours</DialogTitle>
                </DialogHeader>
                <div className="py-8 flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No tours selected</h3>
                    <p className="text-muted-foreground text-sm">
                        Add some tours to compare their features, prices, and itineraries side by side.
                    </p>
                    <Button onClick={onClose} className="mt-4">
                        Close Comparison
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
  }

  // Row definition matrix for side-by-side comparison
  const rows = [
    {
      id: 'price',
      label: 'Price',
      icon: <DollarSign className="w-4 h-4 text-primary shrink-0" />,
      getValue: (tour: TourPackage) => `$${tour.priceFrom.toLocaleString()}`,
      isDifferent: (tours: TourPackage[]) => !tours.every(t => t.priceFrom === tours[0].priceFrom)
    },
    {
      id: 'duration',
      label: 'Duration',
      icon: <Clock className="w-4 h-4 text-primary shrink-0" />,
      getValue: (tour: TourPackage) => tour.duration,
      isDifferent: (tours: TourPackage[]) => !tours.every(t => t.duration === tours[0].duration)
    },
    {
      id: 'startEnd',
      label: 'Start / End',
      icon: <MapPin className="w-4 h-4 text-primary shrink-0" />,
      getValue: (tour: TourPackage) => tour.startEnd,
      isDifferent: (tours: TourPackage[]) => !tours.every(t => t.startEnd === tours[0].startEnd)
    },
    {
      id: 'category',
      label: 'Category',
      icon: <Award className="w-4 h-4 text-primary shrink-0" />,
      getValue: (tour: TourPackage) => tour.category,
      isDifferent: (tours: TourPackage[]) => !tours.every(t => t.category === tours[0].category)
    },
    {
      id: 'highlights',
      label: 'Highlights',
      icon: <Check className="w-4 h-4 text-success shrink-0" />,
      renderValue: (tour: TourPackage) => (
        <ul className="space-y-1.5 text-left">
          {tour.highlights.slice(0, 5).map((h, i) => (
            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
              <Check className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
              <span className="leading-tight">{h}</span>
            </li>
          ))}
        </ul>
      ),
      isDifferent: (tours: TourPackage[]) => !tours.every(t => JSON.stringify(t.highlights.slice(0, 5)) === JSON.stringify(tours[0].highlights.slice(0, 5)))
    },
    {
      id: 'included',
      label: 'Included',
      icon: <Check className="w-4 h-4 text-primary shrink-0" />,
      renderValue: (tour: TourPackage) => (
        <ul className="space-y-1 text-left">
          {tour.included.slice(0, 4).map((item, index) => (
            <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
              <span className="w-1.5 h-1.5 bg-primary/45 rounded-full shrink-0 mt-1.5" />
              <span className="leading-tight">{item}</span>
            </li>
          ))}
        </ul>
      ),
      isDifferent: (tours: TourPackage[]) => !tours.every(t => JSON.stringify(t.included.slice(0, 4)) === JSON.stringify(tours[0].included.slice(0, 4)))
    },
    {
      id: 'excluded',
      label: 'Excluded',
      icon: <X className="w-4 h-4 text-destructive shrink-0" />,
      renderValue: (tour: TourPackage) => (
        <ul className="space-y-1 text-left">
          {tour.excluded.slice(0, 4).map((item, index) => (
            <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
              <span className="w-1.5 h-1.5 bg-destructive/45 rounded-full shrink-0 mt-1.5" />
              <span className="leading-tight">{item}</span>
            </li>
          ))}
        </ul>
      ),
      isDifferent: (tours: TourPackage[]) => !tours.every(t => JSON.stringify(t.excluded.slice(0, 4)) === JSON.stringify(tours[0].excluded.slice(0, 4)))
    }
  ];

  const filteredRows = showDifferencesOnly ? rows.filter(r => r.isDifferent(tours)) : rows;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="fixed inset-0 h-full w-full max-w-none max-h-screen sm:relative sm:max-h-[90dvh] sm:w-[95vw] sm:max-w-7xl sm:rounded-2xl overflow-hidden p-0 bg-background flex flex-col">
            <DialogHeader className="border-b px-4 pb-3 pt-5 sm:px-6 sm:pb-4 sm:pt-6">
                <div className="flex items-start justify-between gap-3 pr-10 sm:pr-12">
                    <DialogTitle className="text-lg font-bold leading-tight sm:text-2xl text-left truncate flex-1">
                        Compare Safari Tours ({tours.length})
                    </DialogTitle>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={copyShareLink} 
                        className="h-8 px-2 text-xs sm:px-3 sm:text-sm"
                        title="Copy share link"
                        aria-label="Copy share link"
                      >
                        <LinkIcon className="mr-1 h-4 w-4" />
                        <span className="hidden sm:inline">Copy Link</span>
                      </Button>
                    </div>
                </div>
            </DialogHeader>

            <div className="flex-1 overflow-auto overscroll-contain">
                <table className="w-full border-collapse min-w-max md:min-w-0">
                    <thead>
                        <tr className="border-b">
                            <th className="sticky top-0 left-0 bg-background z-40 p-4 text-left border-r border-border/50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] w-[120px] xs:w-[150px] sm:w-[180px]">
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Features</span>
                                    <label className="flex items-center gap-2 cursor-pointer mt-1">
                                        <input
                                            type="checkbox"
                                            checked={showDifferencesOnly}
                                            onChange={(e) => setShowDifferencesOnly(e.target.checked)}
                                            className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                                        />
                                        <span className="text-[10px] xs:text-xs text-foreground font-semibold whitespace-nowrap">Diffs Only</span>
                                    </label>
                                </div>
                            </th>
                            {tours.map((tour) => (
                                <th key={tour.id} className="sticky top-0 bg-background z-30 p-4 min-w-[200px] xs:min-w-[240px] border-r border-border/50 text-left align-top">
                                    <div className="relative flex flex-col gap-3">
                                        <div className="flex gap-2.5 items-center">
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                                                <Image
                                                    src={tour.imageUrl}
                                                    alt={tour.name}
                                                    fill
                                                    sizes="48px"
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-xs xs:text-sm font-bold text-foreground truncate max-w-[150px] xs:max-w-[180px]" title={tour.name}>
                                                    {tour.name}
                                                </h4>
                                                <div className="flex items-center gap-1 text-[10px] text-amber-500 font-semibold mt-0.5">
                                                    <Star className="w-3 h-3 fill-current" />
                                                    <span>{tour.rating}/10</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Link href={`/safaris-tours/${tour.slug}`} className="block">
                                            <Button size="sm" className="w-full text-xs h-8 bg-primary hover:bg-primary-dark">
                                                Select Safari
                                            </Button>
                                        </Link>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRows.map((row) => (
                            <tr key={row.id} className="border-b hover:bg-muted/30 transition-colors">
                                <td className="sticky left-0 bg-background z-20 p-4 text-xs sm:text-sm font-semibold border-r border-border/50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] text-foreground">
                                    <div className="flex items-center gap-2">
                                        {row.icon}
                                        <span>{row.label}</span>
                                    </div>
                                </td>
                                {tours.map((tour) => (
                                    <td key={tour.id} className="p-4 text-xs sm:text-sm border-r border-border/50 text-muted-foreground bg-card/40 align-top">
                                        {row.renderValue ? row.renderValue(tour) : row.getValue(tour)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DialogContent>
    </Dialog>
  );
}



// Hook to manage tour comparison state
export function useTourComparison() {
    const [compareTours, setCompareTours] = useState<TourPackage[]>([]);
    const [showComparison, setShowComparison] = useState(false);
    const [hydrated, setHydrated] = useState(false);

    // Load saved compare tours after initial hydration render
    useEffect(() => {
        try {
            const saved = localStorage.getItem('compareTours');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setCompareTours(parsed);
                }
            }
        } catch {
            // Ignore storage / JSON parse errors
        }
        setHydrated(true);
    }, []);

    // Save to localStorage when compareTours changes (only after initial hydration)
    useEffect(() => {
        if (!hydrated) return;
        if (compareTours.length > 0) {
            localStorage.setItem('compareTours', JSON.stringify(compareTours));
        } else {
            localStorage.removeItem('compareTours');
        }
    }, [compareTours, hydrated]);

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
        count: compareTours.length,
        hydrated,
    };
}
