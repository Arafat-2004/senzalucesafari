"use client";

import { motion } from "framer-motion";

interface AnimatedGradientProps {
    className?: string;
    colors?: string[];
}

export function AnimatedGradient({
    className = "",
    colors = ["#22c55e", "#f97316", "#22c55e"],
}: AnimatedGradientProps) {
    return (
        <motion.div
            className={`absolute inset-0 ${className}`}
            animate={{
                background: colors.map((color, i) =>
                    `radial-gradient(circle at ${20 + i * 30}% ${30 + i * 20}%, ${color}40, transparent 50%)`
                ).join(", "),
            }}
            transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
            }}
            style={{
                background: `radial-gradient(circle at 20% 30%, ${colors[0]}40, transparent 50%), 
                     radial-gradient(circle at 50% 50%, ${colors[1]}40, transparent 50%),
                     radial-gradient(circle at 80% 70%, ${colors[2]}40, transparent 50%)`,
            }}
        />
    );
}
