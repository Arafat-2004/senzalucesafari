"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";

interface AnimatedBackgroundProps {
    className?: string;
    color1?: string;
    color2?: string;
    color3?: string;
}

export function AnimatedBackground({
    className = "",
    color1 = "rgba(222, 119, 36, 0.15)",
    color2 = "rgba(232, 137, 58, 0.1)",
    color3 = "rgba(200, 106, 30, 0.12)",
}: AnimatedBackgroundProps) {
    const controls = useAnimation();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        controls.start({
            background: [
                `radial-gradient(circle at 20% 50%, ${color1}, transparent 50%)`,
                `radial-gradient(circle at 80% 80%, ${color2}, transparent 50%)`,
                `radial-gradient(circle at 40% 20%, ${color3}, transparent 50%)`,
                `radial-gradient(circle at 20% 50%, ${color1}, transparent 50%)`,
            ],
            transition: {
                duration: 15,
                repeat: Infinity,
                ease: "linear",
            },
        });
    }, [controls, color1, color2, color3]);

    return (
        <motion.div
            ref={ref}
            animate={controls}
            className={`absolute inset-0 -z-10 ${className}`}
        />
    );
}

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
}

// Particle floating animation
export function FloatingParticles({ className = "" }: { className?: string }) {
    const [particles] = useState<Particle[]>(() =>
        Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 2,
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 5,
        }))
    );
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional hydration mount pattern
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className={`absolute inset-0 overflow-hidden -z-10 ${className}`}>
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-primary/20"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}
