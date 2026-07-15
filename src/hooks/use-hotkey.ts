"use client";

import { useEffect, useRef } from "react";

type HotkeyHandler = (e: KeyboardEvent) => void;

interface HotkeyDef {
    key: string;
    ctrl?: boolean;
    meta?: boolean;
    shift?: boolean;
    handler: HotkeyHandler;
    enabled?: boolean;
}

export function useHotkey(defs: HotkeyDef[]) {
    const defsRef = useRef(defs);
    defsRef.current = defs;

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            for (const def of defsRef.current) {
                if (def.enabled === false) continue;
                const ctrlOrMeta = def.ctrl || def.meta;
                const matchCtrl = ctrlOrMeta ? (e.ctrlKey || e.metaKey) : true;
                const matchKey = e.key?.toLowerCase() === def.key.toLowerCase();
                const matchShift = def.shift ? e.shiftKey : !e.shiftKey;
                if (matchKey && matchCtrl && matchShift) {
                    e.preventDefault();
                    e.stopPropagation();
                    def.handler(e);
                    return;
                }
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);
}
