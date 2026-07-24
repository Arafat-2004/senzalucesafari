'use client'

import { useState, useEffect, useRef } from 'react'
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
    icon: React.ComponentType<{ className?: string }>
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

// Background patterns
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

/* Confetti particles definitions */
interface ConfettiParticle {
    id: number
    x: number
    y: number
    color: string
    size: number
    speedX: number
    speedY: number
    rotation: number
    rotationSpeed: number
    opacity: number
}

// Festive visual configurations
interface FestiveDecoration {
    anchors: string[]
    ropeColor: string
    cardStyle: string
}

const FESTIVE_DECORATIONS: Record<string, FestiveDecoration> = {
    eid: {
        anchors: ['🌙', '🏮', '🌙', '🏮'],
        ropeColor: 'linear-gradient(to bottom, #d4af37, #115e59)',
        cardStyle: 'bg-emerald-950/85 backdrop-blur-md text-amber-200 border border-amber-400/40 shadow-[0_8px_32px_rgba(251,191,36,0.15)]'
    },
    christmas: {
        anchors: ['🔔', '🎄', '🎁', '🔔'],
        ropeColor: 'repeating-linear-gradient(45deg, #ef4444, #ef4444 5px, #ffffff 5px, #ffffff 10px)',
        cardStyle: 'bg-red-900/85 backdrop-blur-md text-white border border-amber-300/40 shadow-[0_8px_32px_rgba(239,68,68,0.15)]'
    },
    newyear: {
        anchors: ['✨', '🎈', '✨', '🎈'],
        ropeColor: 'linear-gradient(to bottom, #a1a1aa, #f59e0b)',
        cardStyle: 'bg-zinc-950/90 backdrop-blur-md text-amber-100 border border-amber-400/40 shadow-[0_8px_32px_rgba(245,158,11,0.15)]'
    },
    easter: {
        anchors: ['🥚', '🌸', '🥚', '🌸'],
        ropeColor: 'linear-gradient(to bottom, #c084fc, #fef08a)',
        cardStyle: 'bg-purple-100/80 backdrop-blur-md text-purple-950 border border-purple-300/50 shadow-[0_8px_32px_rgba(167,139,250,0.1)]'
    },
    honeymoon: {
        anchors: ['💖', '🎈', '💖', '🎈'],
        ropeColor: 'linear-gradient(to bottom, #f43f5e, #fda4af)',
        cardStyle: 'bg-rose-950/85 backdrop-blur-md text-rose-100 border border-rose-400/40 shadow-[0_8px_32px_rgba(244,63,94,0.15)]'
    },
    anniversary: {
        anchors: ['🥂', '💖', '🥂', '💖'],
        ropeColor: 'linear-gradient(to bottom, #047857, #fbbf24)',
        cardStyle: 'bg-emerald-950/85 backdrop-blur-md text-amber-100 border border-amber-300/40 shadow-[0_8px_32px_rgba(4,120,87,0.15)]'
    },
    default: {
        anchors: ['🎈', '🎈', '🎈', '🎈'],
        ropeColor: 'linear-gradient(to bottom, #6b7280, #d1d5db)',
        cardStyle: 'bg-slate-900/85 backdrop-blur-md text-slate-100 border border-slate-700/50 shadow-[0_8px_32px_rgba(148,163,184,0.1)]'
    }
}

export function HolidayBanner({ text, link, type }: HolidayBannerProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [particles, setParticles] = useState<ConfettiParticle[]>([])
    const shouldReduceMotion = useReducedMotion()
    const requestRef = useRef<number | null>(null)
    const particleIdCounter = useRef(0)

    const themeKey = THEME_REGISTRY[type] ? type : 'signature'
    const tokens = THEME_REGISTRY[themeKey]

    // Separate operational alerts from festive celebrations
    const isOperational = ['travel_advisory', 'weather_notice', 'maintenance', 'critical_update', 'last_minute'].includes(themeKey)
    const decoration = FESTIVE_DECORATIONS[themeKey] || FESTIVE_DECORATIONS.default

    // Hoisted helper function to completely prevent temporal dead zone (TDZ) / ReferenceErrors
    const triggerConfetti = (originX: number, count = 25) => {
        if (shouldReduceMotion) return
        const newParticles: ConfettiParticle[] = []
        const colors = ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6', '#06b6d4', '#eab308']
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.random() * 120 + 30) * (Math.PI / 180) // 30deg to 150deg
            const force = Math.random() * 8 + 4
            newParticles.push({
                id: particleIdCounter.current++,
                x: originX,
                y: 20,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 6,
                speedX: Math.cos(angle) * force * (Math.random() > 0.5 ? 1 : -1),
                speedY: -Math.sin(angle) * force,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 10 - 5,
                opacity: 1
            })
        }
        setParticles(prev => [...prev, ...newParticles])
    }

    useEffect(() => {
        if (!text) return
        
        const fingerprint = `${themeKey}-${text.length}-${text.slice(0, 8)}-${link || 'none'}`
        const dismissed = sessionStorage.getItem(`dismissed-banner-v2-${fingerprint}`)
        if (!dismissed) {
            setTimeout(() => {
                setIsVisible(true)
            }, 0)
            // Trigger automatic initial confetti burst on festive banners
            if (!isOperational && !shouldReduceMotion) {
                setTimeout(() => triggerConfetti(window.innerWidth / 2, 40), 400)
            }
        }
    }, [text, themeKey, link, isOperational, shouldReduceMotion])

    // Update loops for particle simulation
    useEffect(() => {
        if (particles.length === 0) return

        const updateParticles = () => {
            setParticles(prev => 
                prev
                    .map(p => ({
                        ...p,
                        x: p.x + p.speedX,
                        y: p.y + p.speedY,
                        speedY: p.speedY + 0.18, // Gravity
                        rotation: p.rotation + p.rotationSpeed,
                        opacity: p.opacity - 0.007 // Decay
                    }))
                    .filter(p => p.opacity > 0 && p.y < window.innerHeight + 10)
            )
            requestRef.current = requestAnimationFrame(updateParticles)
        }

        requestRef.current = requestAnimationFrame(updateParticles)
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current)
        }
    }, [particles])

    if (!isVisible || !text) return null

    const handleDismiss = () => {
        const fingerprint = `${themeKey}-${text.length}-${text.slice(0, 8)}-${link || 'none'}`
        try {
            sessionStorage.setItem(`dismissed-banner-v2-${fingerprint}`, 'true')
        } catch (e) {
            console.warn('[HolidayBanner] Could not write dismissal to storage:', e)
        }
        setIsVisible(false)
    }

    const IconComponent = tokens.icon

    /* ─── Operational Mode: Push-down alert bar ─── */
    if (isOperational) {
        let ariaRole = 'region'
        let ariaLabel = 'Important announcement'
        if (themeKey === 'critical_update') {
            ariaRole = 'alert'
            ariaLabel = 'Urgent update'
        } else if (themeKey === 'maintenance' || themeKey === 'travel_advisory') {
            ariaRole = 'status'
            ariaLabel = 'Operational notice'
        }

        return (
            <AnimatePresence>
                <motion.div
                    role={ariaRole}
                    aria-label={ariaLabel}
                    initial={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    animate={shouldReduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: 'easeInOut' }}
                    className={`relative w-full overflow-hidden select-none z-[60] flex items-stretch border-b border-black/15 ${tokens.surface}`}
                >
                    <div className={`w-1 shrink-0 ${tokens.accentRail}`} aria-hidden="true" />
                    <div className="absolute inset-0 bg-transparent pointer-events-none" aria-hidden="true" />
                    <StripesPattern />

                    <div className="container mx-auto px-4 sm:px-10 flex items-center justify-center min-h-[44px] py-2 md:py-2.5 relative">
                        <div className="flex flex-col sm:flex-row items-center justify-center text-center gap-2 sm:gap-3 max-w-4xl mx-auto px-4">
                            <div className="flex items-center gap-2 shrink-0 justify-center">
                                <div className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 ${tokens.iconBg}`}>
                                    <IconComponent className={`h-4 w-4 ${tokens.iconFg}`} aria-hidden="true" />
                                </div>
                                <span className={`text-[10px] tracking-[0.12em] font-bold uppercase px-2 py-0.5 rounded-full border bg-black/5 border-black/10 ${tokens.accent}`}>
                                    {tokens.eyebrow}
                                </span>
                            </div>
                            <span className={`text-xs sm:text-sm font-semibold tracking-normal text-center line-clamp-2 md:line-clamp-1 ${tokens.textPrimary}`}>
                                {text}
                            </span>
                            {link && (
                                <Link href={link} prefetch={true} className="shrink-0 mt-0.5 sm:mt-0">
                                    <motion.span
                                        whileHover={shouldReduceMotion ? {} : { x: 2 }}
                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs transition-all font-semibold active:scale-95 shadow-sm ${tokens.ctaBg} ${tokens.ctaFg} ${tokens.ctaBorder}`}
                                    >
                                        Learn More &rarr;
                                    </motion.span>
                                </Link>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={handleDismiss}
                            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-black/60 hover:text-black hover:bg-black/10 focus-visible:ring-black"
                            aria-label="Dismiss banner"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        )
    }

    /* ─── Festive Mode: Suspended Rope & Decoration Overlay ─── */
    return (
        <div className="absolute top-20 md:top-[116px] left-0 w-full h-[150px] pointer-events-none z-[45] overflow-visible select-none transition-all duration-300">
            {/* Inline keyframe animations to keep component self-contained and modular */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes float-left {
                    0% { transform: translateY(0px) rotate(-3deg) scale(1); }
                    100% { transform: translateY(-10px) rotate(3deg) scale(1.02); }
                }
                @keyframes float-right {
                    0% { transform: translateY(0px) rotate(4deg) scale(0.98); }
                    100% { transform: translateY(-12px) rotate(-4deg) scale(1.02); }
                }
                @keyframes rope-swing {
                    0% { transform: rotate(-2deg); }
                    100% { transform: rotate(2deg); }
                }
                @keyframes card-swing {
                    0% { transform: rotate(-1.5deg) translateX(-1px); }
                    100% { transform: rotate(1.5deg) translateX(1px); }
                }
                .animate-float-L { animation: float-left 3.5s ease-in-out infinite alternate; }
                .animate-float-R { animation: float-right 4s ease-in-out infinite alternate; }
                .animate-swing-rope { animation: rope-swing 4.5s ease-in-out infinite alternate; transform-origin: top center; }
                .animate-swing-card { animation: card-swing 4.2s ease-in-out infinite alternate; transform-origin: top center; }
            `}} />

            {/* Render confetti particles */}
            <AnimatePresence>
                {particles.map(p => (
                    <div
                        key={p.id}
                        className="fixed pointer-events-none rounded-sm z-[100]"
                        style={{
                            left: p.x,
                            top: p.y,
                            width: p.size,
                            height: p.size,
                            backgroundColor: p.color,
                            opacity: p.opacity,
                            transform: `rotate(${p.rotation}deg)`,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    />
                ))}
            </AnimatePresence>

            <AnimatePresence>
                <motion.div 
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                    className="relative w-full h-full max-w-6xl mx-auto flex items-start justify-center gap-12 sm:gap-24 px-4 pt-1"
                >
                    {/* Left Hanging Unit */}
                    <div className="hidden md:flex flex-col items-center animate-float-L pointer-events-auto">
                        <button 
                            type="button"
                            onClick={(e) => triggerConfetti(e.clientX)}
                            className="text-3xl active:scale-95 transition-transform hover:scale-110 cursor-pointer text-shadow"
                            title="Pop confetti!"
                        >
                            {decoration.anchors[0]}
                        </button>
                        <div 
                            className="w-[1.5px] h-[55px] opacity-75 shadow-sm"
                            style={{ background: decoration.ropeColor }}
                        />
                    </div>

                    {/* Central Suspended Text Card */}
                    <div className="flex flex-col items-center animate-swing-rope relative">
                        {/* String dropping down from invisible top point */}
                        <div 
                            className="w-[2px] h-[36px] shadow-sm opacity-80"
                            style={{ background: decoration.ropeColor }}
                        />

                        {/* Ribbon tie bow element for realistic hanging detail */}
                        <div className="absolute top-[32px] text-xs pointer-events-none select-none z-10" aria-hidden="true">🎀</div>

                        {/* Hanging Banner Card */}
                        <div className={`pointer-events-auto flex items-center gap-3 px-5 py-2.5 rounded-2xl shadow-xl animate-swing-card ${decoration.cardStyle}`}>
                            
                            {/* Medallion / Icon */}
                            <div className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 ${tokens.iconBg}`}>
                                <IconComponent className={`h-4 w-4 ${tokens.iconFg}`} aria-hidden="true" />
                            </div>

                            {/* Message & CTA */}
                            <div className="flex flex-col items-start min-w-0">
                                <span className="text-[9px] tracking-[0.15em] font-bold uppercase opacity-85">
                                    {tokens.eyebrow}
                                </span>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs sm:text-sm font-bold tracking-tight">
                                        {text}
                                    </span>
                                    {link && (
                                        <Link href={link} prefetch={true} className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold underline hover:opacity-85 transition-opacity">
                                            Learn More &rarr;
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* Dismiss button integrated directly inside the card */}
                            <button
                                type="button"
                                onClick={handleDismiss}
                                className="p-1 rounded-full text-current hover:bg-black/10 transition-colors ml-2"
                                aria-label="Dismiss announcement"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Right Hanging Unit */}
                    <div className="hidden md:flex flex-col items-center animate-float-R pointer-events-auto">
                        <button 
                            type="button"
                            onClick={(e) => triggerConfetti(e.clientX)}
                            className="text-3xl active:scale-95 transition-transform hover:scale-110 cursor-pointer text-shadow"
                            title="Pop confetti!"
                        >
                            {decoration.anchors[1]}
                        </button>
                        <div 
                            className="w-[1.5px] h-[55px] opacity-75 shadow-sm"
                            style={{ background: decoration.ropeColor }}
                        />
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
