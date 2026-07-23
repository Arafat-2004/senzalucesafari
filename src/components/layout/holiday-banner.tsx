'use client'

import { useState, useEffect } from 'react'
import { 
    X, Gift, Sparkles, Megaphone, Calendar, Compass, Leaf, Crown,
    Percent, Egg, Clock, Globe, Users, Heart, PartyPopper, Tag,
    AlertTriangle, Cloud, Wrench, AlertCircle, Navigation, Sun, Flame,
    Moon, Flower
} from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Link from 'next/link'

interface HolidayBannerProps {
    text: string
    link?: string | null
    type: string
}

interface ThemeTokens {
    accentRail: string
    surface: string
    textPrimary: string
    textSecondary: string
    accent: string
    iconBg: string
    iconFg: string
    ctaBg: string
    ctaFg: string
    ctaBorder: string
    pattern: 'contours' | 'stars' | 'waves' | 'stripes' | 'none'
    eyebrow: string
    icon: React.ComponentType<any>
}

// 24 Theme Configurations Registry
const THEME_REGISTRY: Record<string, ThemeTokens> = {
    // === Core Senza Luce Themes ===
    signature: {
        accentRail: 'bg-[#D4A017]',
        surface: 'bg-gradient-to-r from-[#176B45] via-[#115234] to-[#0d3f28]',
        textPrimary: 'text-white drop-shadow-sm',
        textSecondary: 'text-[#EEDFC4]/80',
        accent: 'text-[#D4A017]',
        iconBg: 'bg-white/10 border border-white/10',
        iconFg: 'text-[#D4A017]',
        ctaBg: 'bg-[#D4A017] hover:bg-[#D4A017]/90 active:scale-95',
        ctaFg: 'text-[#3C2417] font-bold',
        ctaBorder: 'border border-[#D4A017]/25',
        pattern: 'contours',
        eyebrow: 'EXPEDITION',
        icon: Compass
    },
    savanna_sunrise: {
        accentRail: 'bg-[#3C2417]',
        surface: 'bg-gradient-to-r from-[#ea580c] via-[#d97706] to-[#7c2d12]',
        textPrimary: 'text-white font-medium',
        textSecondary: 'text-[#EEDFC4]/85',
        accent: 'text-[#fef08a]',
        iconBg: 'bg-white/10 border border-white/10',
        iconFg: 'text-[#fef08a]',
        ctaBg: 'bg-[#fef08a] hover:bg-[#fef08a]/90 active:scale-95',
        ctaFg: 'text-[#7c2d12] font-semibold',
        ctaBorder: 'border border-[#fef08a]/20',
        pattern: 'waves',
        eyebrow: 'SUNRISE',
        icon: Sun
    },
    savanna_night: {
        accentRail: 'bg-[#D4A017]',
        surface: 'bg-gradient-to-r from-[#020617] via-[#0f172a] to-[#020617] border-b border-[#D4A017]/10',
        textPrimary: 'text-amber-100/90 font-medium',
        textSecondary: 'text-[#9E9E9E]/80',
        accent: 'text-[#D4A017]',
        iconBg: 'bg-[#D4A017]/10 border border-[#D4A017]/20',
        iconFg: 'text-[#D4A017]',
        ctaBg: 'bg-[#D4A017]/20 hover:bg-[#D4A017]/35 text-[#D4A017] hover:text-[#D4A017]/90',
        ctaFg: 'text-[#D4A017]',
        ctaBorder: 'border border-[#D4A017]/30',
        pattern: 'stars',
        eyebrow: 'NIGHTFALL',
        icon: Moon
    },
    wildlife: {
        accentRail: 'bg-[#D4A017]',
        surface: 'bg-gradient-to-r from-[#7c2d12] via-[#b45309] to-[#451a03]',
        textPrimary: 'text-orange-50 font-medium',
        textSecondary: 'text-[#EEDFC4]/80',
        accent: 'text-[#f59e0b]',
        iconBg: 'bg-white/10 border border-white/10',
        iconFg: 'text-[#f59e0b]',
        ctaBg: 'bg-[#f59e0b] hover:bg-[#f59e0b]/90 text-amber-950',
        ctaFg: 'text-amber-950 font-bold',
        ctaBorder: 'border border-[#f59e0b]/30',
        pattern: 'waves',
        eyebrow: 'SAFARI',
        icon: Flame
    },
    migration: {
        accentRail: 'bg-[#D4A017]',
        surface: 'bg-gradient-to-r from-[#854d0e] via-[#a16207] to-[#422006]',
        textPrimary: 'text-amber-50 font-medium',
        textSecondary: 'text-[#EEDFC4]/80',
        accent: 'text-[#fef08a]',
        iconBg: 'bg-white/10 border border-white/10',
        iconFg: 'text-[#fef08a]',
        ctaBg: 'bg-[#fef08a] hover:bg-[#fef08a]/90 text-[#422006]',
        ctaFg: 'text-[#422006] font-bold',
        ctaBorder: 'border border-[#fef08a]/30',
        pattern: 'contours',
        eyebrow: 'SEASON',
        icon: Navigation
    },
    conservation: {
        accentRail: 'bg-[#EEDFC4]',
        surface: 'bg-gradient-to-r from-[#064e3b] via-[#0f766e] to-[#022c22]',
        textPrimary: 'text-white',
        textSecondary: 'text-emerald-200/80',
        accent: 'text-emerald-300',
        iconBg: 'bg-white/15 border border-white/10',
        iconFg: 'text-emerald-300',
        ctaBg: 'bg-emerald-300 hover:bg-emerald-200 text-emerald-950',
        ctaFg: 'text-emerald-950 font-bold',
        ctaBorder: 'border border-emerald-400/20',
        pattern: 'contours',
        eyebrow: 'ECO-SUSTAINABLE',
        icon: Leaf
    },
    luxury: {
        accentRail: 'bg-[#D4A017]',
        surface: 'bg-gradient-to-r from-[#18181b] via-[#27272a] to-[#09090b] border-b border-[#D4A017]/20',
        textPrimary: 'text-[#EEDFC4]',
        textSecondary: 'text-[#9E9E9E]',
        accent: 'text-[#D4A017]',
        iconBg: 'bg-[#D4A017]/10 border border-[#D4A017]/20',
        iconFg: 'text-[#D4A017]',
        ctaBg: 'bg-[#D4A017] hover:bg-[#D4A017]/90 text-[#18181b]',
        ctaFg: 'text-[#18181b] font-bold',
        ctaBorder: 'border border-[#D4A017]/30',
        pattern: 'contours',
        eyebrow: 'PRESTIGE',
        icon: Crown
    },
    adventure: {
        accentRail: 'bg-[#ea580c]',
        surface: 'bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#1e3a8a]',
        textPrimary: 'text-white',
        textSecondary: 'text-blue-200/80',
        accent: 'text-orange-400',
        iconBg: 'bg-white/15 border border-white/10',
        iconFg: 'text-orange-400',
        ctaBg: 'bg-orange-500 hover:bg-orange-400 text-white',
        ctaFg: 'text-white font-bold',
        ctaBorder: 'border border-orange-500/25',
        pattern: 'waves',
        eyebrow: 'EXPEDITION',
        icon: Compass
    },

    // === Commercial Themes ===
    special_offer: {
        accentRail: 'bg-[#f59e0b]',
        surface: 'bg-gradient-to-r from-[#065f46] via-[#047857] to-[#064e3b]',
        textPrimary: 'text-white',
        textSecondary: 'text-emerald-100/80',
        accent: 'text-[#f59e0b]',
        iconBg: 'bg-white/10 border border-white/10',
        iconFg: 'text-[#f59e0b]',
        ctaBg: 'bg-[#f59e0b] hover:bg-[#f59e0b]/90 text-emerald-950',
        ctaFg: 'text-emerald-950 font-bold',
        ctaBorder: 'border border-[#f59e0b]/30',
        pattern: 'contours',
        eyebrow: 'LIMITED DEALS',
        icon: Percent
    },
    early_bird: {
        accentRail: 'bg-[#1b5e3f]',
        surface: 'bg-gradient-to-r from-[#fef3c7] via-[#fde68a] to-[#fef3c7] border-b border-[#1b5e3f]/25',
        textPrimary: 'text-[#1b5e3f] font-semibold',
        textSecondary: 'text-[#4b5563]',
        accent: 'text-[#b45309]',
        iconBg: 'bg-[#1b5e3f]/10 border border-[#1b5e3f]/15',
        iconFg: 'text-[#1b5e3f]',
        ctaBg: 'bg-[#1b5e3f] hover:bg-[#1b5e3f]/90 text-white',
        ctaFg: 'text-white font-bold',
        ctaBorder: 'border border-[#1b5e3f]/20',
        pattern: 'contours',
        eyebrow: 'EARLY BIRD',
        icon: Egg
    },
    last_minute: {
        accentRail: 'bg-[#7f1d1d]',
        surface: 'bg-gradient-to-r from-[#ef4444] via-[#dc2626] to-[#b91c1c]',
        textPrimary: 'text-white font-semibold',
        textSecondary: 'text-[#fecaca]/80',
        accent: 'text-white',
        iconBg: 'bg-white/20 border border-white/10',
        iconFg: 'text-white',
        ctaBg: 'bg-white hover:bg-[#f3f4f6] text-red-700',
        ctaFg: 'text-red-700 font-bold',
        ctaBorder: 'border border-white/30',
        pattern: 'stripes',
        eyebrow: 'URGENT SAVINGS',
        icon: Clock
    },
    new_destination: {
        accentRail: 'bg-[#f59e0b]',
        surface: 'bg-gradient-to-r from-[#0d9488] via-[#0f766e] to-[#115e59]',
        textPrimary: 'text-white',
        textSecondary: 'text-teal-100/80',
        accent: 'text-[#f59e0b]',
        iconBg: 'bg-white/10 border border-white/10',
        iconFg: 'text-[#f59e0b]',
        ctaBg: 'bg-[#f59e0b] hover:bg-[#f59e0b]/90 text-teal-950',
        ctaFg: 'text-teal-950 font-bold',
        ctaBorder: 'border border-[#f59e0b]/20',
        pattern: 'contours',
        eyebrow: 'NEW SAFARI',
        icon: Globe
    },
    group_travel: {
        accentRail: 'bg-[#fbbf24]',
        surface: 'bg-gradient-to-r from-[#3730a3] via-[#4338ca] to-[#312e81]',
        textPrimary: 'text-white',
        textSecondary: 'text-[#c7d2fe]/80',
        accent: 'text-[#fbbf24]',
        iconBg: 'bg-white/10 border border-white/10',
        iconFg: 'text-[#fbbf24]',
        ctaBg: 'bg-[#fbbf24] hover:bg-[#fbbf24]/90 text-indigo-950',
        ctaFg: 'text-indigo-950 font-bold',
        ctaBorder: 'border border-[#fbbf24]/30',
        pattern: 'contours',
        eyebrow: 'GROUP DEPARTURE',
        icon: Users
    },
    honeymoon: {
        accentRail: 'bg-[#EEDFC4]',
        surface: 'bg-gradient-to-r from-[#4c0519] via-[#881337] to-[#4c0519]',
        textPrimary: 'text-pink-50',
        textSecondary: 'text-pink-200/80',
        accent: 'text-[#EEDFC4]',
        iconBg: 'bg-white/10 border border-white/10',
        iconFg: 'text-pink-200',
        ctaBg: 'bg-[#EEDFC4] hover:bg-[#EEDFC4]/90 text-rose-950',
        ctaFg: 'text-rose-950 font-bold',
        ctaBorder: 'border border-[#EEDFC4]/30',
        pattern: 'stars',
        eyebrow: 'HONEYMOON',
        icon: Heart
    },
    anniversary: {
        accentRail: 'bg-[#D4A017]',
        surface: 'bg-gradient-to-r from-[#064e3b] via-[#14532d] to-[#022c22] border-b border-[#D4A017]/20',
        textPrimary: 'text-white',
        textSecondary: 'text-[#EEDFC4]/80',
        accent: 'text-[#D4A017]',
        iconBg: 'bg-white/10 border border-white/10',
        iconFg: 'text-[#D4A017]',
        ctaBg: 'bg-[#D4A017] hover:bg-[#D4A017]/90 text-emerald-950',
        ctaFg: 'text-emerald-950 font-bold',
        ctaBorder: 'border border-[#D4A017]/25',
        pattern: 'stars',
        eyebrow: 'CELEBRATION',
        icon: PartyPopper
    },

    // === Seasonal Themes ===
    christmas: {
        accentRail: 'bg-[#fbbf24]',
        surface: 'bg-gradient-to-r from-[#991b1b] via-[#b91c1c] to-[#7f1d1d] border-b border-[#fbbf24]/20 shadow-[inset_0_-1px_0_0_rgba(251,191,36,0.25)]',
        textPrimary: 'text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]',
        textSecondary: 'text-[#fecaca]/80',
        accent: 'text-[#fbbf24]',
        iconBg: 'bg-white/15 border border-white/10',
        iconFg: 'text-[#fbbf24]',
        ctaBg: 'bg-[#fbbf24] hover:bg-[#f59e0b] text-[#7f1d1d]',
        ctaFg: 'text-[#7f1d1d] font-bold',
        ctaBorder: 'border border-[#fbbf24]/30',
        pattern: 'stars',
        eyebrow: 'FESTIVE SEASON',
        icon: Gift
    },
    newyear: {
        accentRail: 'bg-[#f59e0b]',
        surface: 'bg-gradient-to-r from-[#09090b] via-[#18181b] to-[#09090b] border-b border-[#f59e0b]/20 shadow-[inset_0_-1px_0_0_rgba(245,158,11,0.2)]',
        textPrimary: 'text-amber-100 font-medium',
        textSecondary: 'text-[#a1a1aa]',
        accent: 'text-[#f59e0b]',
        iconBg: 'bg-[#f59e0b]/10 border border-[#f59e0b]/20',
        iconFg: 'text-[#f59e0b]',
        ctaBg: 'bg-[#f59e0b] hover:bg-[#d97706] text-black',
        ctaFg: 'text-black font-bold',
        ctaBorder: 'border border-[#f59e0b]/30',
        pattern: 'stars',
        eyebrow: 'NEW YEAR',
        icon: Sparkles
    },
    eid: {
        accentRail: 'bg-[#fbbf24]',
        surface: 'bg-gradient-to-r from-[#065f46] via-[#064e3b] to-[#022c22] border-b border-[#fbbf24]/20',
        textPrimary: 'text-emerald-50',
        textSecondary: 'text-emerald-200/80',
        accent: 'text-[#fbbf24]',
        iconBg: 'bg-white/10 border border-white/10',
        iconFg: 'text-[#fbbf24]',
        ctaBg: 'bg-[#fbbf24] hover:bg-[#f59e0b] text-emerald-950',
        ctaFg: 'text-emerald-950 font-bold',
        ctaBorder: 'border border-[#fbbf24]/30',
        pattern: 'stars',
        eyebrow: 'EID MUBARAK',
        icon: Moon
    },
    easter: {
        accentRail: 'bg-[#a78bfa]',
        surface: 'bg-gradient-to-r from-[#f5f3ff] via-[#ede9fe] to-[#f5f3ff] border-b border-[#a78bfa]/20',
        textPrimary: 'text-[#5b21b6] font-semibold',
        textSecondary: 'text-[#6b21a8]',
        accent: 'text-[#7c3aed]',
        iconBg: 'bg-[#7c3aed]/10 border border-[#7c3aed]/15',
        iconFg: 'text-[#7c3aed]',
        ctaBg: 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white',
        ctaFg: 'text-white font-bold',
        ctaBorder: 'border border-[#7c3aed]/20',
        pattern: 'contours',
        eyebrow: 'EASTER HOLIDAY',
        icon: Flower
    },
    blackfriday: {
        accentRail: 'bg-[#f43f5e]',
        surface: 'bg-gradient-to-r from-black via-zinc-900 to-black border-b border-[#f43f5e]/40 shadow-[0_1px_8px_rgba(244,63,94,0.15)]',
        textPrimary: 'text-white font-bold tracking-wide',
        textSecondary: 'text-zinc-400',
        accent: 'text-[#f43f5e]',
        iconBg: 'bg-[#f43f5e]/15 border border-[#f43f5e]/30',
        iconFg: 'text-[#f43f5e]',
        ctaBg: 'bg-[#f43f5e] hover:bg-[#e11d48] text-white',
        ctaFg: 'text-white font-bold',
        ctaBorder: 'border border-[#f43f5e]/35',
        pattern: 'stripes',
        eyebrow: 'PROMO EXCLUSIVE',
        icon: Tag
    },

    // === Operational Themes ===
    travel_advisory: {
        accentRail: 'bg-[#eab308]',
        surface: 'bg-gradient-to-r from-[#27272a] via-[#18181b] to-[#27272a] border-b border-[#eab308]/20',
        textPrimary: 'text-white font-medium',
        textSecondary: 'text-[#a1a1aa]',
        accent: 'text-[#eab308]',
        iconBg: 'bg-[#eab308]/15 border border-[#eab308]/30',
        iconFg: 'text-[#eab308]',
        ctaBg: 'bg-[#eab308] hover:bg-[#ca8a04] text-black',
        ctaFg: 'text-black font-semibold',
        ctaBorder: 'border border-[#eab308]/30',
        pattern: 'stripes',
        eyebrow: 'ADVISORY',
        icon: AlertTriangle
    },
    weather_notice: {
        accentRail: 'bg-[#38bdf8]',
        surface: 'bg-gradient-to-r from-[#1e293b] via-[#0f172a] to-[#1e293b]',
        textPrimary: 'text-sky-50',
        textSecondary: 'text-[#9E9E9E]',
        accent: 'text-[#38bdf8]',
        iconBg: 'bg-[#38bdf8]/10 border border-[#38bdf8]/20',
        iconFg: 'text-[#38bdf8]',
        ctaBg: 'bg-[#38bdf8]/25 hover:bg-[#38bdf8]/40 text-[#38bdf8] hover:text-white',
        ctaFg: 'text-[#38bdf8]',
        ctaBorder: 'border border-[#38bdf8]/30',
        pattern: 'none',
        eyebrow: 'WEATHER ALERT',
        icon: Cloud
    },
    maintenance: {
        accentRail: 'bg-[#ea580c]',
        surface: 'bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#b45309] border-b border-[#3c2417]/25',
        textPrimary: 'text-[#3c2417] font-semibold',
        textSecondary: 'text-[#451a03]/90',
        accent: 'text-white',
        iconBg: 'bg-[#3c2417]/10 border border-[#3c2417]/15',
        iconFg: 'text-[#3c2417]',
        ctaBg: 'bg-[#3c2417] hover:bg-[#4a3728] text-white',
        ctaFg: 'text-white font-bold',
        ctaBorder: 'border border-[#3c2417]/20',
        pattern: 'stripes',
        eyebrow: 'SERVICE NOTICE',
        icon: Wrench
    },
    critical_update: {
        accentRail: 'bg-white',
        surface: 'bg-gradient-to-r from-[#991b1b] via-[#7f1d1d] to-[#991b1b] border-b border-red-500/30',
        textPrimary: 'text-white font-bold',
        textSecondary: 'text-red-200/80',
        accent: 'text-white',
        iconBg: 'bg-white/20 border border-white/10',
        iconFg: 'text-white',
        ctaBg: 'bg-white hover:bg-red-50 text-[#7f1d1d]',
        ctaFg: 'text-[#7f1d1d] font-bold',
        ctaBorder: 'border border-white/30',
        pattern: 'stripes',
        eyebrow: 'CRITICAL',
        icon: AlertCircle
    }
}

// Sparkles / starfield overlay pattern
function StarsPattern() {
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10%" cy="30%" r="1" fill="#fff" />
            <circle cx="25%" cy="70%" r="1.5" fill="#fff" />
            <circle cx="45%" cy="20%" r="1" fill="#fff" />
            <circle cx="65%" cy="80%" r="1.2" fill="#fff" />
            <circle cx="85%" cy="40%" r="1.5" fill="#fff" />
            <circle cx="95%" cy="15%" r="1" fill="#fff" />
        </svg>
    )
}

// Savanna waves overlay pattern
function WavesPattern() {
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05]" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M 0,25 C 150,10 350,40 500,25 C 650,10 850,40 1000,25 C 1150,10 1350,40 1500,25" />
            <path d="M 0,15 C 200,30 400,0 600,15 C 800,30 1000,0 1200,15 C 1400,30 1600,0 1800,15" />
        </svg>
    )
}

// Warning stripes overlay pattern
function StripesPattern() {
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="warning-stripes" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="10" height="20" fill="currentColor" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#warning-stripes)" />
        </svg>
    )
}

// Topographical contour lines overlay pattern
function ContoursPattern() {
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M-20,10 Q50,45 150,15 T350,25 T550,5 T750,30 T950,10 T1150,20 T1350,5 T1550,40 T1750,15" />
            <path d="M-10,35 Q100,5 250,35 T600,15 T950,35 T1300,15 T1650,35" />
        </svg>
    )
}

export function HolidayBanner({ text, link, type }: HolidayBannerProps) {
    const [isVisible, setIsVisible] = useState(false)
    const shouldReduceMotion = useReducedMotion()

    const themeKey = THEME_REGISTRY[type] ? type : 'signature'
    const tokens = THEME_REGISTRY[themeKey]

    useEffect(() => {
        if (!text) return
        
        // Generate a safe fingerprint identifying the exact version, content, and type
        const fingerprint = `${themeKey}-${text.length}-${text.slice(0, 8)}-${link || 'none'}`
        const dismissed = sessionStorage.getItem(`dismissed-banner-v2-${fingerprint}`)
        if (!dismissed) {
            setIsVisible(true)
        }
    }, [text, themeKey, link])

    if (!isVisible || !text) return null

    const handleDismiss = () => {
        const fingerprint = `${themeKey}-${text.length}-${text.slice(0, 8)}-${link || 'none'}`
        try {
            sessionStorage.setItem(`dismissed-banner-v2-${fingerprint}`, 'true')
        } catch (e) {
            // Quietly catch private browsing Storage quota exceptions
            console.warn('[HolidayBanner] Could not write dismissal to storage:', e)
        }
        setIsVisible(false)
    }

    const IconComponent = tokens.icon

    // Accessible ARIA role mapping: Urgency determines role
    let ariaRole = 'region'
    let ariaLabel = 'Important announcement'
    if (themeKey === 'critical_update') {
        ariaRole = 'alert'
        ariaLabel = 'Urgent update'
    } else if (themeKey === 'maintenance' || themeKey === 'travel_advisory') {
        ariaRole = 'status'
        ariaLabel = 'Operational notice'
    }

    // Themes with a light/cream surface — these need dark text and dark UI controls
    const isLightSurface = ['easter', 'early_bird', 'maintenance'].includes(themeKey)

    return (
        <AnimatePresence>
            <motion.div
                role={ariaRole}
                aria-label={ariaLabel}
                initial={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                animate={shouldReduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: 'easeInOut' }}
                className={`relative w-full overflow-hidden select-none z-[60] flex items-stretch ${
                    isLightSurface ? 'border-b border-black/15' : 'border-b border-white/10'
                } ${tokens.surface}`}
            >
                {/* 1. Theme rail - 4px left-side accent strip */}
                <div className={`w-1 shrink-0 ${tokens.accentRail}`} aria-hidden="true" />

                {/* 2. Micro-glassmorphic sheen — neutral so it doesn't bleach light-surface themes */}
                <div className="absolute inset-0 bg-transparent pointer-events-none" aria-hidden="true" />
                
                {tokens.pattern === 'contours' && <ContoursPattern />}
                {tokens.pattern === 'stars' && <StarsPattern />}
                {tokens.pattern === 'waves' && <WavesPattern />}
                {tokens.pattern === 'stripes' && <StripesPattern />}

                {/* Main inner container - Centered to match site grid */}
                <div className="container mx-auto px-4 md:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 py-2 md:py-2.5 relative">
                    
                    {/* Content Group: Medallion + Message */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        
                        {/* 2. Icon Medallion */}
                        <motion.div 
                            initial={shouldReduceMotion ? {} : { scale: 0.85, rotate: -5 }}
                            animate={shouldReduceMotion ? {} : { scale: 1, rotate: 0 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${tokens.iconBg}`}
                        >
                            <IconComponent className={`h-4.5 w-4.5 ${tokens.iconFg}`} aria-hidden="true" />
                        </motion.div>

                        {/* 3. Message Group */}
                        <div className="flex flex-col text-left leading-tight overflow-hidden">
                            <span className={`text-[10px] tracking-[0.12em] font-bold uppercase ${tokens.accent}`}>
                                {tokens.eyebrow}
                            </span>
                            <span className={`text-xs sm:text-sm font-medium tracking-normal line-clamp-2 md:line-clamp-1 ${tokens.textPrimary}`}>
                                {text}
                            </span>
                        </div>
                    </div>

                    {/* Action & Dismiss Group */}
                    <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto shrink-0 border-t border-white/5 md:border-t-0 pt-2 md:pt-0">
                        
                        {/* 4. Action Area */}
                        {link ? (
                            <Link href={link} prefetch={true} className="inline-block">
                                <motion.span
                                    whileHover={shouldReduceMotion ? {} : { x: 2 }}
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs transition-all font-semibold active:scale-95 shadow-sm ${tokens.ctaBg} ${tokens.ctaFg} ${tokens.ctaBorder}`}
                                >
                                    Learn More &rarr;
                                </motion.span>
                            </Link>
                        ) : (
                            <div className="w-0 h-0" />
                        )}

                        {/* 5. Dismiss Control */}
                        <button
                            type="button"
                            onClick={handleDismiss}
                            className={`p-1.5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 shrink-0 ${
                                isLightSurface 
                                    ? 'text-black/50 hover:text-black hover:bg-black/8 focus-visible:ring-black' 
                                    : 'text-white/50 hover:text-white hover:bg-white/10 focus-visible:ring-white'
                            }`}
                            aria-label="Dismiss banner"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                </div>
            </motion.div>
        </AnimatePresence>
    )
}
