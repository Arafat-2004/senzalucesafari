"use client";

import { useSyncExternalStore } from "react";

const MOBILE_BREAKPOINT = 768;

function getSnapshot(): boolean {
    return window.innerWidth < MOBILE_BREAKPOINT;
}

function getServerSnapshot(): boolean {
    return false;
}

function subscribe(callback: () => void): () => void {
    const check = () => {
        callback();
    };
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
}

export function useIsMobile(): boolean {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
