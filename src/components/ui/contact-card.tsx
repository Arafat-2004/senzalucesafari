"use client";

import { motion, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";

interface SpotlightCardProps {
    children: ReactNode;
    className?: string;
    spotlightColor?: string;
    icon?: ReactNode;
    title?: string;
    description?: string;
}

export function EnhancedSpotlightCard({
    children,
    className = "",
    spotlightColor = "rgba(222, 119, 36, 0.25)",
    icon,
    title,
    description,
}: SpotlightCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ y: -5, transition: { duration: 0.3 } }}
            className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 ${className}`}
        >
            {/* Spotlight gradient effect */}
            <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${spotlightColor}, transparent 40%)`,
                }}
            />

            {/* Content */}
            <div className="relative z-10">
                {icon && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : {}}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="mb-4 flex items-center justify-center"
                    >
                        {icon}
                    </motion.div>
                )}

                {title && (
                    <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.3 }}
                        className="mb-2 text-center text-xl font-bold text-foreground"
                    >
                        {title}
                    </motion.h3>
                )}

                {description && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.4 }}
                        className="mb-4 text-center text-sm text-muted-foreground"
                    >
                        {description}
                    </motion.p>
                )}

                {children}
            </div>
        </motion.div>
    );
}

// Animated section wrapper
export function AnimatedSection({
    children,
    className = "",
    delay = 0,
}: {
    children: ReactNode;
    className?: string;
    delay?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
                duration: 0.7,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Pulse animation for icons
export function PulseIcon({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            className={className}
            animate={{
                scale: [1, 1.1, 1],
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        >
            {children}
        </motion.div>
    );
}
