"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "favouriteTours";

export function useFavourites() {
    const [favouriteIds, setFavouriteIds] = useState<string[]>([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) setFavouriteIds(parsed);
            }
        } catch {
            // ignore parse errors
        }
        setHydrated(true);
    }, []);

    const persist = useCallback((ids: string[]) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
        } catch {
            // localStorage may be full
        }
        setFavouriteIds(ids);
    }, []);

    const isFavourite = useCallback(
        (id: string) => favouriteIds.includes(id),
        [favouriteIds]
    );

    const toggleFavourite = useCallback(
        (id: string) => {
            if (favouriteIds.includes(id)) {
                persist(favouriteIds.filter((fid) => fid !== id));
            } else {
                persist([...favouriteIds, id]);
            }
        },
        [favouriteIds, persist]
    );

    const removeFavourite = useCallback(
        (id: string) => {
            persist(favouriteIds.filter((fid) => fid !== id));
        },
        [favouriteIds, persist]
    );

    const clearAll = useCallback(() => {
        persist([]);
    }, [persist]);

    return {
        favouriteIds,
        isFavourite,
        toggleFavourite,
        removeFavourite,
        clearAll,
        hydrated,
    };
}
