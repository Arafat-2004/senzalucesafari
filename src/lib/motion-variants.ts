import type { Variants } from "framer-motion";

export const cardHover: Variants = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.02, y: -4 }
};

export const pageTransition: Variants = {
    initial: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};