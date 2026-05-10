"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, Star, Clock, Trash2, ArrowRight } from "lucide-react";
import { useFavourites } from "@/hooks/use-favourites";
import { Button } from "@/components/ui/button";
import type { TourPackage } from "@/types/tours";

interface FavouritesContentProps {
    tours: TourPackage[];
}

export function FavouritesContent({ tours }: FavouritesContentProps) {
    const { favouriteIds, isFavourite, removeFavourite, clearAll, hydrated } = useFavourites();

    const favouriteTours = tours.filter((t) => favouriteIds.includes(t.id));

    if (!hydrated) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-card rounded-xl border border-border/50 animate-pulse h-80" />
                ))}
            </div>
        );
    }

    if (favouriteTours.length === 0) {
        return (
            <div className="text-center py-16 md:py-24">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold mb-2">No favourites yet</h2>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Start saving tours by tapping the heart icon on any safari package.
                </p>
                <Button variant="safari" nativeButton={false} render={<Link href="/safaris-tours" />}>
                    Explore Tours
                </Button>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                    {favouriteTours.length} {favouriteTours.length === 1 ? "tour" : "tours"} saved
                </p>
                <Button variant="outline" size="sm" onClick={clearAll}>
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Clear All
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {favouriteTours.map((tour) => (
                    <div
                        key={tour.id}
                        className="group relative bg-card rounded-xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-300"
                    >
                        <Link href={`/safaris-tours/${tour.slug}`} className="block">
                            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                <Image
                                    src={tour.imageUrl || "/images/placeholders/serengeti.jpg"}
                                    alt={tour.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                <div className="absolute top-2.5 left-2.5 px-2.5 py-1.5 bg-primary text-white text-xs font-bold rounded-lg shadow-md flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{tour.duration}</span>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        removeFavourite(tour.id);
                                    }}
                                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    aria-label="Remove from favourites"
                                >
                                    <Heart className="w-4 h-4 fill-red-500" />
                                </button>
                            </div>
                        </Link>

                        <div className="p-4">
                            <Link href={`/safaris-tours/${tour.slug}`}>
                                <h3 className="text-base font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                    {tour.name}
                                </h3>
                            </Link>

                            {tour.startEnd && (
                                <div className="flex items-start space-x-1.5 text-xs text-muted-foreground mb-3">
                                    <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-primary" />
                                    <span className="line-clamp-1">{tour.startEnd}</span>
                                </div>
                            )}

                            {tour.rating && (
                                <div className="flex items-center space-x-1.5 mb-3">
                                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs font-semibold">
                                        {(tour.rating / 2).toFixed(1)}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
                                        ({tour.reviewCount || 0})
                                    </span>
                                </div>
                            )}

                            <div className="flex items-end justify-between">
                                <div>
                                    <span className="text-[10px] text-muted-foreground block uppercase tracking-wide">From</span>
                                    <span className="text-xl font-bold text-primary">
                                        ${tour.priceFrom.toLocaleString()}
                                    </span>
                                </div>
                                <Button variant="safari" size="sm" nativeButton={false} render={<Link href={`/safaris-tours/${tour.slug}`} />}>
                                    View Tour
                                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
