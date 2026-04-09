"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { pageTransition } from "@/lib/motion-variants";

interface PageTransitionProps {
    children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
    const isReduced = useReducedMotion();

    if (isReduced) {
        return <>{children}</>;
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={pageTransition}
        >
            {children}
        </motion.div>
    );
}
