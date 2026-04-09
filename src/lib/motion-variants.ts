/**
 * Motion Variants
 * Reusable animation patterns for consistent behavior across components
 */

import { MOTION_EASING, MOTION_DISTANCES } from './motion-config';

// Fade in from bottom (default scroll reveal)
export const fadeInUp = {
    hidden: { opacity: 0, y: MOTION_DISTANCES.normal },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: MOTION_EASING.smooth
        }
    }
};

// Simple fade in
export const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: MOTION_EASING.smooth
        }
    }
};

// Scale in with fade
export const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: MOTION_EASING.smooth
        }
    }
};

// Slide in from left
export const slideInLeft = {
    hidden: { opacity: 0, x: -MOTION_DISTANCES.normal },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: MOTION_EASING.smooth
        }
    }
};

// Slide in from right
export const slideInRight = {
    hidden: { opacity: 0, x: MOTION_DISTANCES.normal },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: MOTION_EASING.smooth
        }
    }
};

// Slide in from top
export const slideInDown = {
    hidden: { opacity: 0, y: -MOTION_DISTANCES.normal },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: MOTION_EASING.smooth
        }
    }
};

// Stagger container for child animations
export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
            ease: MOTION_EASING.smooth
        }
    }
};

// Stagger item for use within stagger container
export const staggerItem = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: MOTION_EASING.smooth
        }
    }
};

// Hero text animation (for sequential text reveals)
export const heroText = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.2,
            duration: 0.6,
            ease: MOTION_EASING.elegant
        }
    })
};

// Card hover effect
export const cardHover = {
    rest: {
        y: 0,
        scale: 1,
        transition: { duration: 0.2, ease: MOTION_EASING.snappy }
    },
    hover: {
        y: -8,
        scale: 1.01,
        transition: { duration: 0.2, ease: MOTION_EASING.snappy }
    }
};

// Image loading animation
export const imageLoad = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: MOTION_EASING.gentle
        }
    }
};

// Modal animation
export const modalAnimation = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: MOTION_EASING.smooth
        }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: {
            duration: 0.2,
            ease: MOTION_EASING.snappy
        }
    }
};

// Modal backdrop
export const modalBackdrop = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.2 }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.15 }
    }
};

// Page transition
export const pageTransition = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: MOTION_EASING.smooth
        }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.2 }
    }
};

// Button press effect
export const buttonPress = {
    rest: {
        scale: 1,
        transition: { duration: 0.1 }
    },
    hover: {
        scale: 1.02,
        transition: { duration: 0.2, ease: MOTION_EASING.snappy }
    },
    press: {
        scale: 0.98,
        transition: { duration: 0.1 }
    }
};

// Success checkmark animation
export const successCheck = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: MOTION_EASING.bounce
        }
    }
};

// Loading spinner
export const loadingSpinner = {
    animate: {
        rotate: 360,
        transition: {
            duration: 1,
            repeat: Infinity,
            ease: "linear"
        }
    }
};

// Subtle pulse (use sparingly)
export const subtlePulse = {
    rest: { scale: 1 },
    pulse: {
        scale: 1.02,
        transition: {
            duration: 0.3,
            repeat: Infinity,
            repeatType: "reverse" as const,
            ease: MOTION_EASING.smooth
        }
    }
};

// List item stagger
export const listItem = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number = 0) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.08,
            duration: 0.4,
            ease: MOTION_EASING.smooth
        }
    })
};
