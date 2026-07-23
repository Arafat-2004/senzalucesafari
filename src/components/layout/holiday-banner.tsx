'use client'

import { useState, useEffect } from 'react'
import { X, Gift, Sparkles, Megaphone, Calendar, Compass, Flower, Moon, Tag, AlertTriangle } from 'lucide-react'
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
    let bannerClass = 'bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-950 text-white'
    let icon = <Megaphone className="h-4 w-4 text-emerald-200" />
    let sparkleColor = 'text-emerald-300'
    let textClass = 'text-white'
    let badgeClass = 'bg-white/20 hover:bg-white/30 text-white border border-white/20'

    switch (type) {
        case 'christmas':
            // Festive deep bright red gradient with gold dust border
            bannerClass = 'bg-gradient-to-r from-red-700 via-red-500 to-red-800 border-b border-amber-400/40 shadow-[inset_0_-1px_0_0_rgba(251,191,36,0.3)]'
            icon = <Gift className="h-4.5 w-4.5 text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]" />
            sparkleColor = 'text-amber-200'
            textClass = 'text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]'
            badgeClass = 'bg-amber-400/25 hover:bg-amber-400/40 text-amber-100 hover:text-white border border-amber-300/30'
            break
        case 'newyear':
            // Charcoal midnight and starry champagne gold
            bannerClass = 'bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-amber-500/20'
            icon = <Sparkles className="h-4.5 w-4.5 text-amber-400 animate-pulse" />
            sparkleColor = 'text-amber-400'
            textClass = 'text-amber-200/90 font-medium'
            badgeClass = 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 border border-amber-500/30'
            break
        case 'holiday':
            // Royal Indigo / Orchid magenta warm celebration
            bannerClass = 'bg-gradient-to-r from-indigo-800 via-purple-700 to-pink-800'
            icon = <Calendar className="h-4.5 w-4.5 text-pink-300 animate-pulse" />
            sparkleColor = 'text-purple-300'
            textClass = 'text-white'
            badgeClass = 'bg-white/25 hover:bg-white/35 text-white border border-white/20'
            break
        case 'wildlife':
            // Serengeti Savanna Sunset (rich orange, deep amber, warm clay red)
            bannerClass = 'bg-gradient-to-r from-orange-800 via-amber-600 to-rose-950 border-b border-amber-400/20'
            icon = <Compass className="h-4.5 w-4.5 text-amber-200 animate-spin-slow" />
            sparkleColor = 'text-orange-300'
            textClass = 'text-amber-50 font-medium'
            badgeClass = 'bg-amber-500/30 hover:bg-amber-500/45 text-amber-50 border border-amber-400/30'
            break
        case 'easter':
            // Spring blossom / Lilac & Fresh Mint pastel (high contrast dark text for light pastel gradient)
            bannerClass = 'bg-gradient-to-r from-purple-200 via-pink-200 to-sky-200 border-b border-purple-300/30'
            icon = <Flower className="h-4.5 w-4.5 text-purple-700 animate-pulse" />
            sparkleColor = 'text-purple-500'
            textClass = 'text-purple-950 font-semibold'
            badgeClass = 'bg-purple-900/10 hover:bg-purple-900/20 text-purple-900 border border-purple-950/20'
            break
        case 'eid':
            // Moonlit emerald green with Islamic crescent gold theme
            bannerClass = 'bg-gradient-to-r from-emerald-950 via-emerald-850 to-teal-950 border-b border-amber-400/30'
            icon = <Moon className="h-4.5 w-4.5 text-amber-300 animate-pulse" />
            sparkleColor = 'text-amber-200'
            textClass = 'text-emerald-50'
            badgeClass = 'bg-amber-400/20 hover:bg-amber-400/30 text-amber-100 hover:text-amber-50 border border-amber-400/30'
            break
        case 'blackfriday':
            // Dark obsidian with striking electric pink neon contrast
            bannerClass = 'bg-gradient-to-r from-black via-zinc-900 to-black border-b border-rose-500/40 shadow-[0_1px_10px_rgba(244,63,94,0.15)]'
            icon = <Tag className="h-4.5 w-4.5 text-rose-500" />
            sparkleColor = 'text-rose-400'
            textClass = 'text-white font-bold tracking-wide'
            badgeClass = 'bg-rose-500/20 hover:bg-rose-500/35 text-rose-300 border border-rose-500/40'
            break
        case 'maintenance':
            // Warning pulse amber/charcoal stripe warning
            bannerClass = 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 border-b border-black/25'
            icon = <AlertTriangle className="h-4.5 w-4.5 text-black animate-bounce" />
            sparkleColor = 'text-black/55'
            textClass = 'text-black font-semibold'
            badgeClass = 'bg-black/15 hover:bg-black/25 text-black border border-black/20'
            break
        default:
            // Emerald forest signature theme
            bannerClass = 'bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-950'
            icon = <Megaphone className="h-4.5 w-4.5 text-emerald-100" />
            sparkleColor = 'text-emerald-300'
            textClass = 'text-emerald-50'
            badgeClass = 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 border border-emerald-400/20'
            break
    }

    const content = (
        <div className="flex items-center justify-center gap-2 px-6 py-2.5 text-center text-xs md:text-sm font-medium leading-relaxed">
            <span className="flex items-center gap-1.5 justify-center shrink-0">
                {icon}
            </span>
            <span className={`flex-1 max-w-4xl tracking-normal text-[13px] md:text-[14px] ${textClass}`}>
                {text}
            </span>
            {link && (
                <Link
                    href={link}
                    className={`ml-2 inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs transition-all font-semibold whitespace-nowrap active:scale-95 shadow-sm hover:shadow ${badgeClass}`}
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
                {/* Micro glassmorphic overlay for elegant light diffusion */}
                <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-[0.5px] pointer-events-none" />

                <div className="relative mx-auto flex items-center justify-between">
                    {/* Left sparkles decorative */}
                    <div className={`hidden md:block absolute left-4 opacity-40 pointer-events-none ${sparkleColor}`}>
                        <Sparkles className="h-4 w-4 animate-pulse" />
                    </div>

                    <div className="flex-1">{content}</div>

                    {/* Right dismiss button */}
                    <button
                        type="button"
                        onClick={handleDismiss}
                        className={`p-1.5 mr-2 opacity-70 hover:opacity-100 hover:bg-black/10 rounded-full transition-all shrink-0 active:scale-90 focus:outline-none ${
                            type === 'easter' || type === 'maintenance' ? 'text-black hover:text-black/80' : 'text-white hover:text-white/80'
                        }`}
                        aria-label="Dismiss banner"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

