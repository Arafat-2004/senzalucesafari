"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type SafariParallaxProps = {
  children: React.ReactNode;
  className?: string;
  distance?: number;
};

export function SafariParallax({ children, className, distance = 24 }: SafariParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <motion.div
      ref={ref}
      className={cn("will-change-transform", className)}
      style={reducedMotion ? undefined : { y }}
    >
      {children}
    </motion.div>
  );
}
