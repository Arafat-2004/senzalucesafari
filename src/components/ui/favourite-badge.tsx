"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavourites } from "@/hooks/use-favourites";
import { cn } from "@/lib/utils";

interface FavouriteBadgeProps {
    className?: string;
}

export function FavouriteBadge({ className }: FavouriteBadgeProps) {
    const { favouriteIds, hydrated } = useFavourites();
    const count = favouriteIds.length;

    return (
        <Link
            href="/favourites"
            className={cn("relative flex items-center justify-center w-9 h-9 rounded-md hover:bg-muted transition-colors", className)}
            aria-label={`Favourites (${count})`}
        >
            <Heart className="w-5 h-5 text-foreground/70 hover:text-foreground transition-colors" />
            {hydrated && count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none min-w-[18px] min-h-[18px]">
                    {count > 9 ? "9+" : count}
                </span>
            )}
        </Link>
    );
}
