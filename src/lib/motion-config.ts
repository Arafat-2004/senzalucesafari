/**
 * Animation Configuration
 * Standardized animation tokens for consistent timing and easing across the website
 */

// Duration tiers (in seconds)
export const MOTION_DURATIONS = {
    instant: 0.1,        // Quick feedback (clicks, toggles)
    fast: 0.2,           // Hover states, micro-interactions
    normal: 0.3,         // Standard transitions
    slow: 0.5,           // Page transitions, hero animations
    deliberate: 0.7      // Scroll reveals, major transitions
} as const;

// Easing curves [x1, y1, x2, y2]
export const MOTION_EASING = {
    smooth: [0.4, 0, 0.2, 1],        // Default smooth - most versatile
    snappy: [0.25, 0.1, 0.25, 1],    // Quick and responsive - buttons, links
    elegant: [0.65, 0, 0.35, 1],     // Premium feel - hero sections, showcases
    gentle: [0.33, 1, 0.68, 1],      // Soft landing - cards, images
    bounce: [0.34, 1.56, 0.64, 1]    // Subtle bounce - success states (rare)
} as const;

// Stagger timing for sequential animations
export const STAGGER_TIMES = {
    tight: 0.05,       // Quick succession - dense grids
    normal: 0.1,       // Standard stagger - most cases
    relaxed: 0.15      // Breathing room - featured items
} as const;

// Animation distance presets
export const MOTION_DISTANCES = {
    subtle: 20,        // Minimal movement - text
    normal: 40,        // Standard - cards, sections
    dramatic: 80       // Large movement - hero elements
} as const;

// Viewport trigger settings
export const VIEWPORT_CONFIG = {
    once: true,                          // Trigger only once
    margin: "-100px",                    // Start animation before element is fully visible
    amount: 0.3 as const                // Trigger when 30% visible
} as const;

// Mobile optimization
export const MOBILE_MOTION = {
    reduceDuration: 0.5,                 // Multiply all durations by this on mobile
    reduceStagger: 0.5,                  // Multiply stagger times by this on mobile
    disableParallax: true,               // Disable parallax on mobile
    breakpoint: 768                      // Mobile breakpoint in pixels
} as const;

export type MotionDuration = typeof MOTION_DURATIONS[keyof typeof MOTION_DURATIONS];
export type MotionEasing = typeof MOTION_EASING[keyof typeof MOTION_EASING];
export type StaggerTime = typeof STAGGER_TIMES[keyof typeof STAGGER_TIMES];
