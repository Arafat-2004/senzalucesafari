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
    // Only apply client-state-dependent values after hydration to avoid
    // server/client mismatch that triggers React hydration errors.
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
            // suppressHydrationWarning is safe here: the server always renders
            // the inactive state (no localStorage), and the client reconciles
            // immediately after mount — no visible flash occurs.
            suppressHydrationWarning
            aria-label={active ? "Remove from favourites" : "Add to favourites"}
        >
            <Heart
                suppressHydrationWarning
                className={cn(
                    "w-4 h-4 transition-all",
                    active && "scale-110 fill-current"
                )}
            />
        </button>
    );
}
