"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface RangeSliderProps {
    min: number;
    max: number;
    step: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
    formatLabel?: (value: number) => string;
}

export function RangeSlider({ min, max, step, value, onChange, formatLabel }: RangeSliderProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [localValue, setLocalValue] = useState(value);
    const [dragging, setDragging] = useState<"min" | "max" | null>(null);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const getPercent = (v: number) => ((v - min) / (max - min)) * 100;

    const clamp = (v: number) => Math.min(max, Math.max(min, v));

    const handlePointerDown = (thumb: "min" | "max") => (e: React.PointerEvent) => {
        e.preventDefault();
        setDragging(thumb);
    };

    const handlePointerMove = useCallback(
        (e: PointerEvent) => {
            if (!dragging || !trackRef.current) return;
            const rect = trackRef.current.getBoundingClientRect();
            const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            const raw = clamp(Math.round((min + pct * (max - min)) / step) * step);
            const newVal: [number, number] = [...localValue] as [number, number];
            if (dragging === "min") {
                newVal[0] = Math.min(raw, localValue[1] - step);
            } else {
                newVal[1] = Math.max(raw, localValue[0] + step);
            }
            setLocalValue(newVal);
        },
        [dragging, localValue, min, max, step, clamp]
    );

    const handlePointerUp = useCallback(() => {
        if (dragging) {
            setDragging(null);
            onChange(localValue);
        }
    }, [dragging, localValue, onChange]);

    useEffect(() => {
        if (dragging) {
            window.addEventListener("pointermove", handlePointerMove);
            window.addEventListener("pointerup", handlePointerUp);
            return () => {
                window.removeEventListener("pointermove", handlePointerMove);
                window.removeEventListener("pointerup", handlePointerUp);
            };
        }
    }, [dragging, handlePointerMove, handlePointerUp]);

    const pctMin = getPercent(localValue[0]);
    const pctMax = getPercent(localValue[1]);

    const fmt = formatLabel ?? ((v: number) => `$${v.toLocaleString()}`);

    return (
        <div className="space-y-3">
            <div
                ref={trackRef}
                className="relative h-2 bg-muted rounded-full cursor-pointer touch-none select-none"
            >
                <div
                    className="absolute h-full rounded-full bg-primary"
                    style={{ left: `${pctMin}%`, width: `${pctMax - pctMin}%` }}
                />
                <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-primary border-2 border-white shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
                    style={{ left: `${pctMin}%` }}
                    onPointerDown={handlePointerDown("min")}
                    role="slider"
                    aria-label="Minimum price"
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={localValue[0]}
                    tabIndex={0}
                />
                <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-primary border-2 border-white shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
                    style={{ left: `${pctMax}%` }}
                    onPointerDown={handlePointerDown("max")}
                    role="slider"
                    aria-label="Maximum price"
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={localValue[1]}
                    tabIndex={0}
                />
            </div>
            <div className="flex items-center justify-between text-sm font-medium">
                <span className="text-foreground">{fmt(localValue[0])}</span>
                <span className="text-muted-foreground text-xs">to</span>
                <span className="text-foreground">{fmt(localValue[1])}</span>
            </div>
        </div>
    );
}
