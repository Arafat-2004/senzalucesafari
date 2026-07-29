'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
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

const GOOGLE_TRANSLATE_ELEMENT_ID = 'senza-google-translate-element'
const GOOGLE_TRANSLATE_SCRIPT_ID = 'google-translate-script'
let googleTranslatePromise: Promise<HTMLSelectElement> | null = null

function readLangFromCookie(): string {
    if (typeof document === 'undefined') return 'en'
    const cookie = document.cookie.split('; ').find(item => item.startsWith('googtrans='))
    if (!cookie) return 'en'
    const value = decodeURIComponent(cookie.slice('googtrans='.length))
    const match = value.match(/^\/en\/(.+)$/)
    return match?.[1] ?? 'en'
}

function writeCookies(langCode: string) {
    const hostname = window.location.hostname
    const expired = 'expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax'
    const domains = new Set([hostname, hostname.replace(/^www\./, '')])

    // Remove stale domain-scoped values written by older versions. Duplicate
    // googtrans cookies can make the picker and translated document disagree.
    domains.forEach(domain => {
        if (domain.includes('.') && !domain.includes(':')) {
            document.cookie = `googtrans=; ${expired}; domain=.${domain}`
        }
    })
    document.cookie = `googtrans=; ${expired}`

    if (langCode !== 'en') {
        document.cookie = `googtrans=/en/${langCode}; path=/; SameSite=Lax; max-age=31536000`
    }
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

function setDocumentLanguage(langCode: string) {
    document.documentElement.lang = langCode
    document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr'
}

function ensureGoogleTranslateWidget(): Promise<HTMLSelectElement> {
    const existingCombo = document.querySelector('select.goog-te-combo') as HTMLSelectElement | null
    if (existingCombo) return Promise.resolve(existingCombo)
    if (googleTranslatePromise) return googleTranslatePromise

    googleTranslatePromise = new Promise((resolve, reject) => {
        const w = window as WindowWithGT
        let pollId: ReturnType<typeof setInterval> | null = null
        let timeoutId: ReturnType<typeof setTimeout> | null = null

        const cleanup = () => {
            if (pollId) clearInterval(pollId)
            if (timeoutId) clearTimeout(timeoutId)
        }

        const findCombo = () => {
            const combo = document.querySelector('select.goog-te-combo') as HTMLSelectElement | null
            if (!combo) return false
            cleanup()
            resolve(combo)
            return true
        }

        const waitForCombo = () => {
            if (findCombo() || pollId) return
            pollId = setInterval(findCombo, 250)
            timeoutId = setTimeout(() => {
                cleanup()
                googleTranslatePromise = null
                reject(new Error('Google Translate did not initialize'))
            }, 15_000)
        }

        const initialize = () => {
            if (!w.google?.translate?.TranslateElement) return

            let mount = document.getElementById(GOOGLE_TRANSLATE_ELEMENT_ID)
            if (!mount) {
                mount = document.createElement('div')
                mount.id = GOOGLE_TRANSLATE_ELEMENT_ID
                mount.setAttribute('aria-hidden', 'true')
                mount.style.cssText = 'position:fixed;left:-10000px;top:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none'
                document.body.appendChild(mount)
            }

            if (mount.dataset.initialized !== 'true') {
                try {
                    new w.google.translate.TranslateElement(
                        { pageLanguage: 'en', autoDisplay: false },
                        GOOGLE_TRANSLATE_ELEMENT_ID
                    )
                    mount.dataset.initialized = 'true'
                } catch {
                    // The singleton may already have been created by the other
                    // responsive header instance.
                }
            }
            waitForCombo()
        }

        w.googleTranslateElementInit = initialize
        const script = document.getElementById(GOOGLE_TRANSLATE_SCRIPT_ID) as HTMLScriptElement | null
        if (script) {
            if (w.google?.translate?.TranslateElement) initialize()
            else if (script.dataset.failed === 'true') {
                script.remove()
                googleTranslatePromise = null
                reject(new Error('Google Translate failed to load'))
            } else {
                script.addEventListener('load', initialize, { once: true })
            }
        } else {
            const nextScript = document.createElement('script')
            nextScript.id = GOOGLE_TRANSLATE_SCRIPT_ID
            nextScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
            nextScript.async = true
            nextScript.onerror = () => {
                cleanup()
                nextScript.dataset.failed = 'true'
                nextScript.remove()
                googleTranslatePromise = null
                reject(new Error('Google Translate failed to load'))
            }
            document.body.appendChild(nextScript)
        }
    })

    return googleTranslatePromise
}

export function LanguageSwitcher() {
    const pathname                          = usePathname()
    const [open, setOpen]                   = useState(false)
    const [currentLang, setCurrentLang]     = useState('en')
    const [loading, setLoading]             = useState(false)
    const [gtReady, setGtReady]             = useState(false)
    const [mounted, setMounted]             = useState(false)
    const [translationError, setTranslationError] = useState<string | null>(null)
    const containerRef                       = useRef<HTMLDivElement>(null)

    // ── Read initial lang from cookie on mount ───────────────────────────────
    useEffect(() => {
        setMounted(true)
        const savedLanguage = readLangFromCookie()
        setCurrentLang(savedLanguage)
        setDocumentLanguage(savedLanguage)
    }, [])

    // ── Load Google Translate script once ────────────────────────────────────
    useEffect(() => {
        let active = true
        ensureGoogleTranslateWidget()
            .then(() => {
                if (!active) return
                setGtReady(true)
                setTranslationError(null)
                const savedLanguage = readLangFromCookie()
                if (savedLanguage !== 'en') triggerGoogleTranslate(savedLanguage)
            })
            .catch(() => {
                if (!active) return
                setGtReady(false)
                setTranslationError('Translation is temporarily unavailable. Please try again later.')
            })
        return () => { active = false }

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
            const target = e.target
            if (target instanceof Element && target.closest('#language-selector-mobile')) return
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
    const changeLanguage = useCallback(async (langCode: string) => {
        if (langCode === currentLang) { setOpen(false); return }

        setLoading(true)
        setTranslationError(null)

        if (langCode === 'en') {
            writeCookies(langCode)
            setCurrentLang(langCode)
            setDocumentLanguage(langCode)
            setLoading(false)
            setOpen(false)
            // Google Translate changes page DOM outside React. A reload is the
            // reliable way to restore the original server-rendered English UI.
            window.setTimeout(() => window.location.reload(), 100)
            return
        }

        try {
            await ensureGoogleTranslateWidget()
            writeCookies(langCode)
            if (!triggerGoogleTranslate(langCode)) {
                throw new Error('Selected language is unavailable')
            }
            setCurrentLang(langCode)
            setDocumentLanguage(langCode)
            setLoading(false)
            setOpen(false)
            return
        } catch {
            writeCookies(currentLang)
            setLoading(false)
            setTranslationError('Translation is temporarily unavailable. Please try again later.')
        }
    }, [currentLang])

    const currentLangObj = LANGUAGES.find(l => l.code === currentLang) ?? LANGUAGES[0]

    return (
        /* notranslate keeps the widget itself from being translated */
        <div ref={containerRef} className="relative notranslate" translate="no">

            {/* Inline styles to suppress Google's injected banner chrome */}
            <style dangerouslySetInnerHTML={{ __html: `
                body > .skiptranslate, .goog-te-banner-frame, #goog-gt-tt,
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
                mounted && createPortal(
                    <div className="fixed inset-0 z-[170] sm:hidden" onClick={() => setOpen(false)} aria-hidden="true" />,
                    document.body,
                )
            )}

            {open && mounted && createPortal(
                <div id="language-selector-mobile" className="fixed inset-x-0 bottom-0 z-[180] max-h-[85dvh] overflow-y-auto rounded-t-2xl border-t border-border bg-card p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl sm:hidden" role="dialog" aria-label="Select language">
                    <div className="mb-2 flex items-center justify-between border-b border-border/40 px-2 pb-3">
                        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground"><Languages className="h-3.5 w-3.5 text-primary" />Select Language</span>
                        <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 text-muted-foreground hover:bg-muted" aria-label="Close language selector"><X className="h-4 w-4" /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                        {LANGUAGES.map(lang => {
                            const active = currentLang === lang.code
                            return <button key={lang.code} type="button" aria-pressed={active} onClick={() => changeLanguage(lang.code)} className={`flex min-h-14 items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium ${active ? 'border border-primary/20 bg-primary/10 text-primary' : 'hover:bg-muted'}`}><span className="text-xl">{lang.flag}</span><span className="min-w-0"><span className="block truncate font-semibold">{lang.nativeName}</span><span className="block truncate text-[10px] text-muted-foreground">{lang.name}</span></span>{active && <Check className="ml-auto h-3.5 w-3.5 shrink-0" />}</button>
                        })}
                    </div>
                    {translationError && <p role="status" className="mt-3 px-2 text-xs text-destructive">{translationError}</p>}
                </div>, document.body,
            )}

            {/* ── Dropdown / Bottom-sheet ────────────────────────────────── */}
            {open && (
                <div
                    id="language-selector"
                    role="dialog"
                    aria-label="Select language"
                    className={[
                        // Mobile: full-width bottom sheet
                        'hidden sm:block',
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
