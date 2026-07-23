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
                    ? "tone-danger shadow-sm"
                    : "bg-background/80 text-muted-foreground backdrop-blur-sm hover:bg-background/90 hover:text-destructive",
                className
            )}
            aria-label={active ? "Remove from favourites" : "Add to favourites"}
        >
            <Heart
                className={cn(
                    "w-4 h-4 transition-all",
                    active && "scale-110 fill-current"
                )}
            />
        </button>
    );
}
