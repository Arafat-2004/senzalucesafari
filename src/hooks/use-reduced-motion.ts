/**
 * useReducedMotion Hook
 * Detects user's motion preference for accessibility
 */

import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        // Check if window is available (client-side)
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        // Modern browsers
        mediaQuery.addEventListener('change', handleChange);

        // Fallback for older browsers
        const deprecatedHandler = () => setPrefersReducedMotion(mediaQuery.matches);
        mediaQuery.addListener(deprecatedHandler);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
            mediaQuery.removeListener(deprecatedHandler);
        };
    }, []);

    return prefersReducedMotion;
}
