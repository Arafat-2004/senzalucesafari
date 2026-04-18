"use client"

import { useEffect, useRef, useState } from "react"
import { useInView, useMotionValue, useSpring } from "framer-motion"

interface NumberTickerProps {
    value: number
    direction?: "up" | "down"
    delay?: number
    className?: string
    duration?: number
    decimalPlaces?: number
    suffix?: string
    prefix?: string
}

export function NumberTicker({
    value,
    direction = "up",
    delay = 0,
    className = "",
    duration = 2,
    decimalPlaces = 0,
    suffix = "",
    prefix = "",
}: NumberTickerProps) {
    const ref = useRef<HTMLSpanElement>(null)
    const motionValue = useMotionValue(direction === "down" ? value : 0)
    const damping = 20 + 40 * (1 / duration)
    const stiffness = 100 * (1 / duration)

    const springValue = useSpring(motionValue, {
        damping,
        stiffness,
    })

    const isInView = useInView(ref, { once: true, margin: "0px" })

    const [renderedValue, setRenderedValue] = useState(
        direction === "down" ? 0 : value
    )

    useEffect(() => {
        if (isInView) {
            const timer = setTimeout(() => {
                motionValue.set(direction === "down" ? 0 : value)
            }, delay * 1000)

            return () => clearTimeout(timer)
        }
    }, [motionValue, isInView, delay, direction, value])

    useEffect(() => {
        springValue.on("change", (latest) => {
            setRenderedValue(latest)
        })
    }, [springValue])

    const formattedValue = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    }).format(renderedValue)

    return (
        <span
            ref={ref}
            className={`inline-flex tabular-nums ${className}`}
        >
            {prefix}{formattedValue}{suffix}
        </span>
    )
}
