"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type WildlifeAccentKind =
  | "lion"
  | "elephant"
  | "giraffe"
  | "rhino"
  | "zebra"
  | "eagle"
  | "acacia";

type WildlifeAccentProps = {
  kind: WildlifeAccentKind;
  className?: string;
  opacity?: "quiet" | "soft" | "visible";
  side?: "left" | "right";
};

const opacityValue = {
  quiet: 0.035,
  soft: 0.055,
  visible: 0.075,
};

function WildlifeShape({ kind }: { kind: WildlifeAccentKind }) {
  switch (kind) {
    case "elephant":
      return (
        <path d="M88 138c-19-9-29-25-29-48 0-31 23-53 58-53 19 0 35 7 47 20 8-5 18-7 29-5 23 4 38 21 38 44 0 18-8 33-23 43l-8 47h-30l-6-34h-52l-8 34H76l12-48Zm-7-60c-13 8-21 22-21 38 0 14 6 26 17 35l4-73Zm122 39c10-5 17-15 17-27 0-13-8-23-21-27 7 15 8 35 4 54Zm-55-57c-9-9-21-14-36-14-22 0-38 14-38 35 0 9 3 18 8 25 14-20 39-33 66-46Z" />
      );
    case "giraffe":
      return (
        <path d="M112 197V75l-20-29 17-10 24 32v129h-21Zm45 0V94l-14-15 17-14 26 28v104h-29Zm-65-139 17-37 13 4-7 31-23 2Zm83 14 4-33 13-2 6 44-23-9Zm-38 7c16 0 29 13 29 29v89h-24v-85c0-5-4-9-9-9h-19V79h23Zm-29 14h37v22h-37V93Zm-5 104h94v28h-94v-28Z" />
      );
    case "rhino":
      return (
        <path d="M45 138c14-33 42-52 83-52h44l31-31 6 47 34 15-38 14-12 47h-31l-5-32h-65l-8 32H54l12-41-21 1Zm164-17-29-13-3-24-16 18h-32c-28 0-49 11-61 32h116l25-13Z" />
      );
    case "zebra":
      return (
        <path d="M55 92h111l32-28 18 17-18 31 29 66h-30l-21-48h-35l-8 48h-30l8-48H82l-13 48H40l15-86Zm28 15-7 15h30l8-15H83Zm47 0-8 15h30l8-15h-30Zm48 1-8 14h20l-7-16-5 2Z" />
      );
    case "eagle":
      return (
        <path d="M128 68c29 28 63 41 101 38-18 19-38 31-60 36l37 27c-31 1-57-8-78-26-21 18-47 27-78 26l37-27c-22-5-42-17-60-36 38 3 72-10 101-38Zm0 32c-10 10-21 18-33 24 13 4 24 10 33 18 9-8 20-14 33-18-12-6-23-14-33-24Z" />
      );
    case "acacia":
      return (
        <path d="M119 197v-62c-30-1-58-10-85-28 33 0 58-8 75-24-12-2-24-8-36-17 28 1 50-5 66-18 14 14 35 20 63 19-9 8-20 14-34 17 13 12 33 18 59 18-21 19-49 29-84 32v63h-24Z" />
      );
    case "lion":
    default:
      return (
        <path d="M127 42c25 0 47 13 59 33l37 4-25 28c0 2 1 4 1 7 0 40-32 72-72 72s-72-32-72-72c0-3 0-5 1-8L31 79l37-4c12-20 34-33 59-33Zm0 31c-23 0-41 18-41 41s18 41 41 41 41-18 41-41-18-41-41-41Zm-19 35 19 16 19-16-8 34h-22l-8-34Z" />
      );
  }
}

export function WildlifeAccent({
  kind,
  className,
  opacity = "soft",
  side = "right",
}: WildlifeAccentProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 256 256"
      className={cn(
        "pointer-events-none absolute hidden h-56 w-56 fill-current text-primary md:block lg:h-72 lg:w-72",
        side === "left" ? "-left-16" : "-right-16",
        className
      )}
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      animate={reducedMotion ? { opacity: opacityValue[opacity] } : undefined}
      whileInView={reducedMotion ? undefined : { opacity: opacityValue[opacity], y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <WildlifeShape kind={kind} />
    </motion.svg>
  );
}
