'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Globe, Check, Loader2, Languages, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇹🇿' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'zh-CN', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' }
]

function setCookie(name: string, value: string, domain?: string, expire?: boolean) {
    const expires = expire ? 'expires=Thu, 01 Jan 1970 00:00:00 UTC; ' : '';
    const domainStr = domain ? `domain=${domain}; ` : '';
    document.cookie = `${name}=${value}; ${expires}path=/; ${domainStr}`;
}

interface TranslateElementInstance {
    TranslateElement: new (options: { pageLanguage: string; autoDisplay: boolean }, elementId: string) => void;
}

interface WindowWithTranslate extends Window {
    googleTranslateElementInit?: () => void;
    google?: {
        translate: TranslateElementInstance;
    };
}

export function LanguageSwitcher() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)
    const [currentLang, setCurrentLang] = useState('en')
    const [loading, setLoading] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Detect click outside to close dropdown on desktop
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Initialize Google Translate script
    useEffect(() => {
        // Read initial language from cookie
        const match = document.cookie.match(/googtrans=\/en\/([^;]+)/)
        if (match) {
            const lang = match[1]
            setTimeout(() => {
                setCurrentLang(lang)
            }, 0)
        }

        // Add the Google Translate element initialization scripts if not already present
        if (!document.getElementById('google-translate-script')) {
            const w = window as WindowWithTranslate;
            w.googleTranslateElementInit = () => {
                if (w.google?.translate?.TranslateElement) {
                    new w.google.translate.TranslateElement({
                        pageLanguage: 'en',
                        autoDisplay: false
                    }, 'google_translate_element')
                }
            }

            const script = document.createElement('script')
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
            script.id = 'google-translate-script'
            script.type = 'text/javascript'
            script.async = true
            document.body.appendChild(script)
        }
    }, [])

    // SPA Route Change handler - Re-trigger Google Translate on page transition
    useEffect(() => {
        if (currentLang === 'en') return

        const retranslate = () => {
            const selectEl = document.querySelector('select.goog-te-combo') as HTMLSelectElement
            if (selectEl) {
                selectEl.value = currentLang
                selectEl.dispatchEvent(new Event('change'))
            }
        }

        // Wait slightly for Next.js route transition & DOM render to complete
        const timer = setTimeout(retranslate, 250)
        return () => clearTimeout(timer)
    }, [pathname, currentLang])

    const changeLanguage = (langCode: string) => {
        if (langCode === currentLang) {
            setOpen(false)
            return
        }

        setLoading(true)
        setOpen(false)

        const domain = window.location.hostname
        const shortDomain = domain.split('.').slice(-2).join('.')

        // Set the google translate cookie via safe helper function outside component scope
        if (langCode === 'en') {
            setCookie('googtrans', '', undefined, true)
            setCookie('googtrans', '', domain, true)
            setCookie('googtrans', '', `.${shortDomain}`, true)
        } else {
            setCookie('googtrans', `/en/${langCode}`)
            setCookie('googtrans', `/en/${langCode}`, domain)
            setCookie('googtrans', `/en/${langCode}`, `.${shortDomain}`)
        }

        // Programmatically select language if widget is ready
        const selectEl = document.querySelector('select.goog-te-combo') as HTMLSelectElement
        if (selectEl) {
            selectEl.value = langCode
            selectEl.dispatchEvent(new Event('change'))
            setCurrentLang(langCode)
            setLoading(false)
        } else {
            // Fallback: Reload if Google script is not yet initialized
            window.location.reload()
        }
    }

    const currentLanguageObj = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0]

    return (
        /* translate="no" and class "notranslate" prevent Google from translating this widget */
        <div ref={containerRef} className="relative notranslate" translate="no">
            {/* Hidden Div for Google Translate widget */}
            <div id="google_translate_element" style={{ display: 'none' }} className="hidden" />

            {/* Custom styles to sanitize visual Google banners */}
            <style dangerouslySetInnerHTML={{ __html: `
                .skiptranslate, .goog-te-banner-frame, #goog-gt-tt, .goog-te-balloon-frame, .goog-te-banner {
                    display: none !important;
                    visibility: hidden !important;
                }
                body {
                    top: 0px !important;
                }
            ` }} />

            <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 h-10 px-3 rounded-xl hover:bg-muted/80 text-foreground/80 hover:text-foreground relative transition-all duration-200 active:scale-95 select-none border border-transparent hover:border-border"
                aria-label="Switch language"
                disabled={loading}
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                    <>
                        <span className="text-xl leading-none filter drop-shadow-sm">{currentLanguageObj.flag}</span>
                        <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline-block">
                            {currentLanguageObj.nativeName}
                        </span>
                        <Globe className="h-4 w-4 opacity-55 ml-0.5" />
                    </>
                )}
            </Button>

            {/* Backdrop for Mobile overlay */}
            {open && (
                <div 
                    className="fixed inset-0 bg-black/45 backdrop-blur-sm z-[180] block sm:hidden cursor-pointer"
                    onClick={() => setOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Adaptive Dropdown Menu - Standard popover on desktop, bottom sheet drawer on mobile */}
            {open && (
                <div className="
                    fixed bottom-4 left-4 right-4 top-auto w-auto max-w-none rounded-2xl border border-border/80 bg-card/95 backdrop-blur-lg p-4 shadow-2xl z-[190]
                    sm:absolute sm:bottom-auto sm:left-auto sm:right-0 sm:top-full sm:w-64 sm:mt-2 sm:p-2 sm:rounded-xl sm:shadow-lg sm:bg-card sm:backdrop-blur-none
                    animate-in fade-in slide-in-from-bottom-5 duration-200 sm:duration-100 sm:slide-in-from-top-2 select-none
                ">
                    {/* Header Row */}
                    <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-border/40">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            <Languages className="w-3.5 h-3.5 text-primary" />
                            <span>Select Language / Lugha</span>
                        </div>
                        {/* Close button strictly visible on mobile drawer */}
                        <button 
                            onClick={() => setOpen(false)}
                            className="p-1 rounded-full hover:bg-muted text-muted-foreground block sm:hidden"
                            aria-label="Close language selector"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Language list grid (2 cols on mobile, 1 col on desktop) */}
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 sm:gap-1 max-h-[60vh] overflow-y-auto pr-1">
                        {LANGUAGES.map(lang => {
                            const isActive = currentLang === lang.code;
                            return (
                                <button
                                    key={lang.code}
                                    onClick={() => changeLanguage(lang.code)}
                                    className={`
                                        w-full flex items-center justify-between px-3 py-2.5 sm:py-2 rounded-xl sm:rounded-lg text-sm font-medium transition-all text-left duration-150 active:scale-[0.98]
                                        ${isActive 
                                            ? 'bg-primary/10 text-primary border border-primary/20' 
                                            : 'hover:bg-muted/80 text-foreground/80 hover:text-foreground border border-transparent'
                                        }
                                    `}
                                >
                                    <span className="flex items-center gap-2.5 min-w-0">
                                        <span className="text-xl sm:text-lg leading-none filter drop-shadow-xs shrink-0">{lang.flag}</span>
                                        <span className="truncate flex flex-col sm:flex-row sm:items-center sm:gap-1.5 min-w-0">
                                            <span className="font-semibold text-foreground truncate">{lang.nativeName}</span>
                                            {lang.name !== lang.nativeName && (
                                                <span className="text-[10px] sm:text-xs text-muted-foreground truncate font-normal">
                                                    ({lang.name})
                                                </span>
                                            )}
                                        </span>
                                    </span>
                                    {isActive && (
                                        <Check className="h-4 w-4 text-primary shrink-0 ml-1.5" />
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
