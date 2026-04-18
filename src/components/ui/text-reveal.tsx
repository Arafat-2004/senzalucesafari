"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TextRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    splitBy?: "words" | "chars" | "lines";
}

export function TextReveal({
    children,
    className = "",
    delay = 0,
    duration = 0.5,
    splitBy = "words",
}: TextRevealProps) {
    const text = typeof children === "string" ? children : "";

    const splitText = () => {
        if (splitBy === "chars") {
            return text.split("").map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20, rotateX: -90 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration,
                        delay: delay + i * 0.03,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="inline-block"
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ));
        }

        if (splitBy === "words") {
            return text.split(" ").map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration,
                        delay: delay + i * 0.1,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="inline-block mr-2"
                >
                    {word}
                </motion.span>
            ));
        }

        return children;
    };

    return <span className={className}>{splitText()}</span>;
}

// Blur text effect
export function BlurText({
    text,
    className = "",
    delay = 0,
}: {
    text: string;
    className?: string;
    delay?: number;
}) {
    return (
        <motion.span
            className={className}
            initial={{ filter: "blur(10px)", opacity: 0 }}
            whileInView={{ filter: "blur(0px)", opacity: 1 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.8,
                delay,
                ease: "easeOut",
            }}
        >
            {text}
        </motion.span>
    );
}

// Stagger children animation
export function StaggerChildren({
    children,
    className = "",
    staggerDelay = 0.1,
}: {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
}) {
    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
}

export function StaggerItem({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.5,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
}
