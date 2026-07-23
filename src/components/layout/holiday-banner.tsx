'use client'

import { useState, useEffect } from 'react'
import { X, Gift, Sparkles, Megaphone, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface HolidayBannerProps {
    text: string
    link?: string | null
    type: string
}

export function HolidayBanner({ text, link, type }: HolidayBannerProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (!text) return
        const hash = text.length.toString() + text.slice(0, 5)
        const dismissed = sessionStorage.getItem(`dismissed-banner-${hash}`)
        if (!dismissed) {
            setIsVisible(true)
        }
    }, [text])

    if (!isVisible || !text) return null

    const handleDismiss = () => {
        const hash = text.length.toString() + text.slice(0, 5)
        sessionStorage.setItem(`dismissed-banner-${hash}`, 'true')
        setIsVisible(false)
    }

    // Determine styling and icon based on banner type
    let bannerClass = 'bg-gradient-to-r from-primary to-primary-dark text-white'
    let icon = <Megaphone className="h-4 w-4 animate-bounce" />
    let sparkleColor = 'text-green-200'

    switch (type) {
        case 'christmas':
            // Festive bright red gradient
            bannerClass = 'bg-gradient-to-r from-red-600 via-red-500 to-red-700 text-white border-b border-yellow-500/30'
            icon = <Gift className="h-4 w-4 animate-bounce text-yellow-300" />
            sparkleColor = 'text-yellow-200'
            break
        case 'newyear':
            // Elegant gold and charcoal
            bannerClass = 'bg-gradient-to-r from-neutral-900 via-neutral-850 to-neutral-900 text-yellow-400 border-b border-yellow-500/20'
            icon = <Sparkles className="h-4 w-4 animate-pulse text-yellow-400" />
            sparkleColor = 'text-yellow-500'
            break
        case 'holiday':
            // Royal Indigo / Amber warm theme
            bannerClass = 'bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-700 text-white'
            icon = <Calendar className="h-4 w-4 animate-pulse text-pink-300" />
            sparkleColor = 'text-purple-200'
            break
        default:
            bannerClass = 'bg-gradient-to-r from-green-700 via-green-600 to-green-800 text-white'
            icon = <Megaphone className="h-4 w-4 animate-bounce text-white" />
            sparkleColor = 'text-green-300'
            break
    }

    const content = (
        <div className="flex items-center justify-center gap-2 px-6 py-2 text-center text-xs md:text-sm font-medium leading-relaxed">
            {icon}
            <span className="flex-1 max-w-4xl">{text}</span>
            {link && (
                <Link
                    href={link}
                    className="ml-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-0.5 text-xs text-white hover:bg-white/30 transition-all font-semibold whitespace-nowrap active:scale-95"
                >
                    Learn More &rarr;
                </Link>
            )}
        </div>
    )

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={`relative w-full overflow-hidden shadow-md z-[60] select-none ${bannerClass}`}
            >
                <div className="relative mx-auto flex items-center justify-between">
                    {/* Left sparkles decorative */}
                    <div className={`hidden md:block absolute left-4 opacity-45 pointer-events-none ${sparkleColor}`}>
                        <Sparkles className="h-4 w-4 animate-ping" />
                    </div>

                    <div className="flex-1">{content}</div>

                    {/* Right dismiss button */}
                    <button
                        type="button"
                        onClick={handleDismiss}
                        className="p-1.5 mr-2 text-white/75 hover:text-white hover:bg-white/10 rounded-full transition-all shrink-0 active:scale-90 focus:outline-none"
                        aria-label="Dismiss banner"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
