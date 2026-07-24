'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { MobileCTABar } from '@/components/ui/mobile-cta-bar'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
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

    useEffect(() => {
        if (isAdmin) return

        const controller = new AbortController()
        fetch('/api/public/settings', { signal: controller.signal })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) {
                    setSettings(data)
                    // Apply the admin-configured primary color to the entire
                    // public site instantly — cascades to every element that
                    // uses var(--primary): buttons, nav, cards, gradients, etc.
                    applyPrimaryColor(data.primaryColor)
                }
            })
            .catch((err) => {
                if (err.name !== 'AbortError') {
                    // Ignore normal abort errors
                }
            })

        return () => {
            controller.abort()
        }
    }, [isAdmin])

    if (isAdmin) {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen flex flex-col pb-20 lg:pb-0 relative">
            {settings?.bannerEnabled && settings.bannerText && (
                <HolidayBanner
                    text={settings.bannerText}
                    link={settings.bannerLink}
                    type={settings.bannerType || 'signature'}
                />
            )}
            <Header />
            <main id="main-content" className="flex-1">
                {children}
            </main>
            <Footer />
            <MobileCTABar />
        </div>
    )
}
