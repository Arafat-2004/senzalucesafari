"use client";

import { motion } from "framer-motion";

interface AnimatedGradientProps {
    className?: string;
    colors?: string[];
}

export function AnimatedGradient({
    className = "",
    colors = ["var(--brand-green-ui)", "var(--brand-gold-ui)", "var(--brand-green-light-ui)"],
}: AnimatedGradientProps) {
    return (
        <motion.div
            className={`absolute inset-0 ${className}`}
            animate={{
                background: colors.map((color, i) =>
                    `radial-gradient(circle at ${20 + i * 30}% ${30 + i * 20}%, color-mix(in srgb, ${color} 25%, transparent), transparent 50%)`
                ).join(", "),
            }}
            transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
            }}
            style={{
                background: `radial-gradient(circle at 20% 30%, color-mix(in srgb, ${colors[0]} 25%, transparent), transparent 50%),
                     radial-gradient(circle at 50% 50%, color-mix(in srgb, ${colors[1]} 25%, transparent), transparent 50%),
                     radial-gradient(circle at 80% 70%, color-mix(in srgb, ${colors[2]} 25%, transparent), transparent 50%)`,
            }}
        />
    );
}
