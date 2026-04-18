/**
 * useMediaQuery Hook
 * Responsive hook for detecting screen size and media queries
 */

import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia(query).matches;
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia(query);

        const handleChange = (e: MediaQueryListEvent) => {
            setMatches(e.matches);
        };

        // Sync in case the query changed since initial render
        if (mediaQuery.matches !== matches) {
            setMatches(mediaQuery.matches); // eslint-disable-line react-hooks/set-state-in-effect -- intentional: sync with external media query API
        }

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

    return matches;
}

// Common breakpoints
export const useIsMobile = () => useMediaQuery('(max-width: 768px)');
export const useIsTablet = () => useMediaQuery('(max-width: 1024px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)');
