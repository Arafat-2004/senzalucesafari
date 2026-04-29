/**
 * Animation Configuration
 * Standardized animation tokens for consistent timing and easing across the website
 */

// Duration tiers (in seconds)
export const MOTION_DURATIONS = {
    instant: 0.1,
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
    deliberate: 0.7
} as const;

// Easing curves [x1, y1, x2, y2]
export const MOTION_EASING = {
    smooth: [0.4, 0, 0.2, 1],
    snappy: [0.25, 0.1, 0.25, 1],
    elegant: [0.65, 0, 0.35, 1],
    gentle: [0.33, 1, 0.68, 1],
    bounce: [0.34, 1.56, 0.64, 1]
} as const;

// Stagger timing for sequential animations
export const STAGGER_TIMES = {
    tight: 0.05,
    normal: 0.1,
    relaxed: 0.15
} as const;

// Animation distance presets
export const MOTION_DISTANCES = {
    subtle: 20,
    normal: 40,
    dramatic: 80
} as const;

// Viewport trigger settings
export const VIEWPORT_CONFIG = {
    once: true,
    margin: "-100px",
    amount: 0.3 as const
} as const;

// Mobile optimization
export const MOBILE_MOTION = {
    reduceDuration: 0.5,
    reduceStagger: 0.5,
    disableParallax: true,
    breakpoint: 768
} as const;