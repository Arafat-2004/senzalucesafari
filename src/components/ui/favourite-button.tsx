"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavourites } from "@/hooks/use-favourites";

interface FavouriteButtonProps {
    tourId: string;
    className?: string;
}

export function FavouriteButton({ tourId, className }: FavouriteButtonProps) {
    const { isFavourite, toggleFavourite, hydrated } = useFavourites();
    const active = hydrated ? isFavourite(tourId) : false;

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (hydrated) {
                    toggleFavourite(tourId);
                }
            }}
            className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200",
                active
                    ? "bg-red-50 dark:bg-red-900/20 text-red-500 shadow-sm"
                    : "bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-red-400 hover:bg-background/90",
                className
            )}
            aria-label={active ? "Remove from favourites" : "Add to favourites"}
        >
            <Heart
                className={cn(
                    "w-4 h-4 transition-all",
                    active && "fill-red-500 scale-110"
                )}
            />
        </button>
    );
}
