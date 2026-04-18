"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useIsMobile } from "@/hooks/use-media-query";
import { MOTION_EASING, MOBILE_MOTION } from "@/lib/motion-config";

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    distance?: number;
    className?: string;
    once?: boolean;
}

export function FadeIn({
    children,
    delay = 0,
    duration = 0.6,
    direction = "up",
    distance = 50,
    className = "",
    once = true
}: FadeInProps) {
    const isReduced = useReducedMotion();
    const isMobile = useIsMobile();

    const getDirectionOffset = () => {
        switch (direction) {
            case "up": return { y: distance, x: 0 };
            case "down": return { y: -distance, x: 0 };
            case "left": return { x: distance, y: 0 };
            case "right": return { x: -distance, y: 0 };
            default: return { x: 0, y: 0 };
        }
    };

    const offset = getDirectionOffset();

    // Optimize for mobile and reduced motion
    const finalDuration = isMobile ? duration * MOBILE_MOTION.reduceDuration : duration;
    const finalDelay = isMobile ? delay * MOBILE_MOTION.reduceDuration : delay;

    return (
        <motion.div
            initial={isReduced ? { opacity: 0 } : { opacity: 0, ...offset }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once, margin: "-100px", amount: 0.3 }}
            transition={{
                duration: isReduced ? 0.3 : finalDuration,
                delay: isReduced ? 0 : finalDelay,
                ease: MOTION_EASING.smooth
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface StaggerContainerProps {
    children: ReactNode;
    staggerDelay?: number;
    className?: string;
}

interface StaggerItemProps {
    children: ReactNode;
    className?: string;
}

export function StaggerContainer({
    children,
    staggerDelay = 0.1,
    className = ""
}: StaggerContainerProps) {
    const isReduced = useReducedMotion();
    const isMobile = useIsMobile();

    const finalStagger = isMobile
        ? staggerDelay * MOBILE_MOTION.reduceStagger
        : staggerDelay;

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px", amount: 0.2 }}
            variants={{
                hidden: { opacity: isReduced ? 1 : 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: isReduced ? 0 : finalStagger,
                        delayChildren: isReduced ? 0 : 0.1
                    }
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function StaggerItem({ children, className = "" }: StaggerItemProps) {
    const isReduced = useReducedMotion();

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: isReduced ? 0 : 30 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: isReduced ? 0.3 : 0.5,
                        ease: MOTION_EASING.smooth
                    }
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface ScaleInProps {
    children: ReactNode;
    delay?: number;
    className?: string;
}

export function ScaleIn({ children, delay = 0, className = "" }: ScaleInProps) {
    const isReduced = useReducedMotion();
    const isMobile = useIsMobile();

    const finalDelay = isMobile ? delay * MOBILE_MOTION.reduceDuration : delay;

    return (
        <motion.div
            initial={isReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px", amount: 0.3 }}
            transition={{
                duration: isReduced ? 0.3 : 0.5,
                delay: isReduced ? 0 : finalDelay,
                ease: MOTION_EASING.smooth
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// New: Slide in from left
export function SlideInLeft({ children, delay = 0, className = "" }: FadeInProps) {
    const isReduced = useReducedMotion();
    const isMobile = useIsMobile();
    const finalDelay = isMobile ? delay * MOBILE_MOTION.reduceDuration : delay;

    return (
        <motion.div
            initial={isReduced ? { opacity: 0 } : { opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px", amount: 0.3 }}
            transition={{
                duration: isReduced ? 0.3 : 0.6,
                delay: isReduced ? 0 : finalDelay,
                ease: MOTION_EASING.smooth
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// New: Slide in from right
export function SlideInRight({ children, delay = 0, className = "" }: FadeInProps) {
    const isReduced = useReducedMotion();
    const isMobile = useIsMobile();
    const finalDelay = isMobile ? delay * MOBILE_MOTION.reduceDuration : delay;

    return (
        <motion.div
            initial={isReduced ? { opacity: 0 } : { opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px", amount: 0.3 }}
            transition={{
                duration: isReduced ? 0.3 : 0.6,
                delay: isReduced ? 0 : finalDelay,
                ease: MOTION_EASING.smooth
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// New: Fade in with scale (for images)
export function FadeInWithScale({ children, delay = 0, className = "" }: FadeInProps) {
    const isReduced = useReducedMotion();
    const isMobile = useIsMobile();
    const finalDelay = isMobile ? delay * MOBILE_MOTION.reduceDuration : delay;

    return (
        <motion.div
            initial={isReduced ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px", amount: 0.3 }}
            transition={{
                duration: isReduced ? 0.3 : 0.5,
                delay: isReduced ? 0 : finalDelay,
                ease: MOTION_EASING.gentle
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
