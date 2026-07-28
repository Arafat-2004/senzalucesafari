'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { Globe, Check, Loader2, Languages, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const LANGUAGES = [
    { code: 'en',    name: 'English',  nativeName: 'English',   flag: '🇬🇧' },
    { code: 'sw',    name: 'Swahili',  nativeName: 'Kiswahili', flag: '🇹🇿' },
    { code: 'fr',    name: 'French',   nativeName: 'Français',  flag: '🇫🇷' },
    { code: 'de',    name: 'German',   nativeName: 'Deutsch',   flag: '🇩🇪' },
    { code: 'es',    name: 'Spanish',  nativeName: 'Español',   flag: '🇪🇸' },
    { code: 'it',    name: 'Italian',  nativeName: 'Italiano',  flag: '🇮🇹' },
    { code: 'zh-CN', name: 'Chinese',  nativeName: '中文',       flag: '🇨🇳' },
    { code: 'ar',    name: 'Arabic',   nativeName: 'العربية',   flag: '🇸🇦' },
]

function readLangFromCookie(): string {
    if (typeof document === 'undefined') return 'en'
    const match = document.cookie.match(/googtrans=\/en\/([^;]+)/)
    return match ? decodeURIComponent(match[1]) : 'en'
}

function writeCookies(langCode: string) {
    const domain = window.location.hostname
    const expire   = langCode === 'en' ? 'expires=Thu, 01 Jan 1970 00:00:00 UTC; ' : ''
    const value    = langCode === 'en' ? '' : `/en/${langCode}`

    // Host-only cookies work for localhost, IP addresses, and preview hosts.
    // Domain cookies are only valid for real multi-label hostnames.
    const pairs = [`googtrans=${value}; ${expire}path=/; SameSite=Lax`]
    const isIpAddress = /^\d{1,3}(?:\.\d{1,3}){3}$/.test(domain) || domain.includes(':')
    if (domain.includes('.') && !isIpAddress) {
        pairs.push(`googtrans=${value}; ${expire}path=/; domain=.${domain}; SameSite=Lax`)
    }
    pairs.forEach(p => { document.cookie = p })
}

function triggerGoogleTranslate(langCode: string): boolean {
    // Try the hidden combo select that Google Translate injects
    const select = document.querySelector('select.goog-te-combo') as HTMLSelectElement | null
    if (!select) return false
    if (![...select.options].some(option => option.value === langCode)) return false
    select.value = langCode
    select.dispatchEvent(new Event('input', { bubbles: true }))
    select.dispatchEvent(new Event('change', { bubbles: true }))
    return true
}

interface WindowWithGT extends Window {
    googleTranslateElementInit?: () => void
    google?: {
        translate: {
            TranslateElement: new (
                opts: { pageLanguage: string; autoDisplay: boolean },
                id: string
            ) => void
        }
    }
}

export function LanguageSwitcher() {
    const pathname                          = usePathname()
    const [open, setOpen]                   = useState(false)
    const [currentLang, setCurrentLang]     = useState('en')
    const [loading, setLoading]             = useState(false)
    const [gtReady, setGtReady]             = useState(false)
    const [translationError, setTranslationError] = useState<string | null>(null)
    const containerRef                       = useRef<HTMLDivElement>(null)
    const retryRef                           = useRef<ReturnType<typeof setInterval> | null>(null)
    const timeoutRef                         = useRef<ReturnType<typeof setTimeout> | null>(null)

    // ── Read initial lang from cookie on mount ───────────────────────────────
    useEffect(() => {
        setCurrentLang(readLangFromCookie())
    }, [])

    // ── Load Google Translate script once ────────────────────────────────────
    useEffect(() => {
        const w = window as WindowWithGT

        function initWidget() {
            if (!w.google?.translate?.TranslateElement) return
            try {
                new w.google.translate.TranslateElement(
                    { pageLanguage: 'en', autoDisplay: false },
                    'google_translate_element'
                )
            } catch {
                // already initialised — safe to ignore
            }
        }

        // Poll for the widget to appear in DOM (GT injects it asynchronously)
        function waitForCombo() {
            if (retryRef.current) clearInterval(retryRef.current)
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            retryRef.current = setInterval(() => {
                if (document.querySelector('select.goog-te-combo')) {
                    setGtReady(true)
                    setTranslationError(null)
                    if (retryRef.current) clearInterval(retryRef.current)
                    if (timeoutRef.current) clearTimeout(timeoutRef.current)
                }
            }, 300)
            timeoutRef.current = setTimeout(() => {
                if (retryRef.current) clearInterval(retryRef.current)
                setTranslationError('Translation is temporarily unavailable. Please try again later.')
            }, 15_000)
        }

        if (!document.getElementById('google-translate-script')) {
            w.googleTranslateElementInit = () => {
                initWidget()
                waitForCombo()
            }
            const s       = document.createElement('script')
            s.id          = 'google-translate-script'
            s.src         = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
            s.async       = true
            s.onerror     = () => setTranslationError('Translation is temporarily unavailable. Please try again later.')
            document.body.appendChild(s)
        } else {
            // Script already injected — widget may already be ready
            if (document.querySelector('select.goog-te-combo')) {
                setGtReady(true)
            } else {
                waitForCombo()
            }
        }

        return () => {
            if (retryRef.current) clearInterval(retryRef.current)
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    // ── Re-apply translation on SPA route changes ─────────────────────────
    useEffect(() => {
        if (currentLang === 'en' || !gtReady) return
        const t = setTimeout(() => triggerGoogleTranslate(currentLang), 300)
        return () => clearTimeout(t)
    }, [pathname, currentLang, gtReady])

    // ── Close dropdown on outside click / escape ──────────────────────────
    useEffect(() => {
        if (!open) return
        const onPointer = (e: PointerEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false)
        }
        document.addEventListener('pointerdown', onPointer)
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('pointerdown', onPointer)
            document.removeEventListener('keydown', onKey)
        }
    }, [open])

    // ── Change language handler ───────────────────────────────────────────
    const changeLanguage = useCallback((langCode: string) => {
        if (langCode === currentLang) { setOpen(false); return }

        setLoading(true)
        setTranslationError(null)

        if (langCode === 'en') {
            writeCookies(langCode)
            setCurrentLang(langCode)
            setLoading(false)
            setOpen(false)
            // Google Translate changes page DOM outside React. A reload is the
            // reliable way to restore the original server-rendered English UI.
            window.setTimeout(() => window.location.reload(), 100)
            return
        }

        writeCookies(langCode)
        setCurrentLang(langCode)
        setOpen(false)
        if (gtReady && triggerGoogleTranslate(langCode)) {
            setLoading(false)
            return
        }

        // The Translate widget reads the googtrans cookie during initialization.
        // Reloading is the reliable fallback when a visitor selects a language
        // before the external widget has finished mounting.
        window.setTimeout(() => window.location.reload(), 100)
    }, [currentLang, gtReady])

    const currentLangObj = LANGUAGES.find(l => l.code === currentLang) ?? LANGUAGES[0]

    return (
        /* notranslate keeps the widget itself from being translated */
        <div ref={containerRef} className="relative notranslate" translate="no">

            {/* Hidden Google Translate mount point */}
            <div id="google_translate_element" className="hidden" />

            {/* Inline styles to suppress Google's injected banner chrome */}
            <style dangerouslySetInnerHTML={{ __html: `
                .skiptranslate, .goog-te-banner-frame, #goog-gt-tt,
                .goog-te-balloon-frame, .goog-te-banner { display:none!important; visibility:hidden!important; }
                body { top:0!important; }
            `}} />

            {/* Trigger button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-1.5 h-10 px-2 sm:px-3 rounded-xl hover:bg-muted/80 text-foreground/80 hover:text-foreground transition-all duration-200 active:scale-95 select-none border border-transparent hover:border-border"
                aria-label="Switch language"
                aria-expanded={open}
                aria-haspopup="dialog"
                aria-controls="language-selector"
                disabled={loading}
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                    <>
                        <span className="text-xl leading-none">{currentLangObj.flag}</span>
                        <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline-block">
                            {currentLangObj.code.toUpperCase().slice(0, 2)}
                        </span>
                        <Globe className="h-3.5 w-3.5 opacity-50" />
                    </>
                )}
            </Button>

            {/* ── Backdrop (mobile only) ─────────────────────────────────── */}
            {open && (
                <div
                    className="fixed inset-0 z-[170] sm:hidden"
                    onClick={() => setOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* ── Dropdown / Bottom-sheet ────────────────────────────────── */}
            {open && (
                <div
                    id="language-selector"
                    role="dialog"
                    aria-label="Select language"
                    className={[
                        // Mobile: full-width bottom sheet
                        'fixed bottom-0 left-0 right-0 z-[180] max-h-[85dvh] overflow-y-auto rounded-t-2xl bg-card border-t border-border p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl',
                        // Desktop: normal popover
                        'sm:absolute sm:bottom-auto sm:left-auto sm:right-0 sm:top-full sm:mt-2',
                        'sm:w-56 sm:rounded-xl sm:border sm:border-border sm:p-1.5 sm:shadow-lg',
                        'animate-in fade-in',
                        'sm:slide-in-from-top-2 slide-in-from-bottom-4 duration-200',
                    ].join(' ')}
                >
                    {/* Header row (mobile) */}
                    <div className="flex items-center justify-between px-2 pb-3 mb-1 border-b border-border/40 sm:hidden">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            <Languages className="w-3.5 h-3.5 text-primary" />
                            <span>Select Language</span>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground touch-manipulation"
                            aria-label="Close language selector"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Language grid — 2 cols on mobile, 1 col on desktop */}
                    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-1 sm:gap-0.5 max-h-[55vh] sm:max-h-[400px] overflow-y-auto">
                        {LANGUAGES.map(lang => {
                            const isActive = currentLang === lang.code
                            return (
                                <button
                                    key={lang.code}
                                    aria-pressed={isActive}
                                    onClick={() => changeLanguage(lang.code)}
                                    // touch-manipulation removes the 300 ms tap delay on mobile
                                    className={[
                                        'touch-manipulation w-full flex items-center gap-2 px-3 py-2.5 sm:py-2',
                                        'rounded-xl sm:rounded-lg text-sm font-medium text-left',
                                        'transition-all duration-150 active:scale-[0.97]',
                                        isActive
                                            ? 'bg-primary/10 text-primary border border-primary/20'
                                            : 'hover:bg-muted/80 text-foreground/80 hover:text-foreground border border-transparent',
                                    ].join(' ')}
                                >
                                    <span className="text-xl leading-none shrink-0">{lang.flag}</span>
                                    <span className="flex flex-col min-w-0">
                                        <span className="font-semibold truncate">{lang.nativeName}</span>
                                        {lang.name !== lang.nativeName && (
                                            <span className="text-[10px] text-muted-foreground truncate font-normal">
                                                {lang.name}
                                            </span>
                                        )}
                                    </span>
                                    {isActive && <Check className="h-3.5 w-3.5 text-primary shrink-0 ml-auto" />}
                                </button>
                            )
                        })}
                    </div>
                    {translationError && (
                        <p role="status" className="mt-3 px-2 text-xs leading-relaxed text-destructive">
                            {translationError}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
