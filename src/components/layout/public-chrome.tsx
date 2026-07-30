'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { MobileCTABar } from '@/components/ui/mobile-cta-bar'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { applyPrimaryColor } from '@/lib/apply-primary-color'

const HolidayBanner = dynamic(
    () => import('@/components/layout/holiday-banner').then(mod => mod.HolidayBanner),
    { ssr: false }
)

interface PublicSettings {
    primaryColor?: string | null
    bannerEnabled?: boolean
    bannerText?: string | null
    bannerLink?: string | null
    bannerType?: string
}

export function PublicChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAdmin = pathname.startsWith('/admin')
    const [settings, setSettings] = useState<PublicSettings | null>(null)

    // Guard flag: ensures the settings fetch runs only ONCE per page session,
    // even if PublicChrome re-mounts (e.g. after a Google Translate language
    // switch causes a soft navigation / component re-mount).
    const fetchedRef = useRef(false)

    useEffect(() => {
        if (isAdmin) return
        // Already fetched this session — skip to avoid visible repaint on
        // language-switch re-mounts and duplicate API calls.
        if (fetchedRef.current) return
        fetchedRef.current = true

        const controller = new AbortController()
        fetch('/api/public/settings', { signal: controller.signal })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) {
                    setSettings(data)
                    // Apply the admin-configured primary color to the entire
                    // public site instantly — cascades to every element that
                    // uses var(--primary): buttons, nav, cards, gradients, etc.
                    // applyPrimaryColor is idempotent: skips DOM writes if the
                    // same colour has already been applied (e.g. by the inline
                    // <head> script that read from localStorage).
                    applyPrimaryColor(data.primaryColor)
                }
            })
            .catch((err) => {
                if (err.name !== 'AbortError') {
                    // Ignore normal abort errors; other errors are silent — the
                    // default CSS colour remains, which is acceptable.
                }
            })

        return () => {
            controller.abort()
        }
    }, [isAdmin]) // Only re-run if admin status changes (i.e. user navigates to/from admin)

    if (isAdmin) {
        return <>{children}</>
    }

    return (
        <div className="safari-public-shell relative flex min-h-screen flex-col overflow-hidden">
            <div className="safari-content-layer min-h-screen flex flex-col">
                {settings?.bannerEnabled && settings.bannerText && (
                    <HolidayBanner
                        text={settings.bannerText}
                        link={settings.bannerLink}
                        type={settings.bannerType || 'signature'}
                    />
                )}
                <Header />
                <main id="main-content" className="flex-1 pb-24 lg:pb-0">
                    {children}
                </main>
                <Footer />
                <MobileCTABar />
            </div>
        </div>
    )
}
