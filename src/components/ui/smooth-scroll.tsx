"use client";

import { useEffect } from "react";

export function SmoothScrollProvider() {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest("a[href^='#']");

            if (anchor) {
                e.preventDefault();
                const id = anchor.getAttribute("href");
                const element = document.querySelector(id!);

                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    return null;
}
