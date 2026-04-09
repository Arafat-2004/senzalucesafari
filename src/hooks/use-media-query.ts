/**
 * useMediaQuery Hook
 * Responsive hook for detecting screen size and media queries
 */

import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia(query);
        setMatches(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setMatches(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);

        // Fallback for older browsers
        const deprecatedHandler = () => setMatches(mediaQuery.matches);
        mediaQuery.addListener(deprecatedHandler);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
            mediaQuery.removeListener(deprecatedHandler);
        };
    }, [query]);

    return matches;
}

// Common breakpoints
export const useIsMobile = () => useMediaQuery('(max-width: 768px)');
export const useIsTablet = () => useMediaQuery('(max-width: 1024px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)');
