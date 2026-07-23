'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { MobileCTABar } from '@/components/ui/mobile-cta-bar'
import { HolidayBanner } from '@/components/layout/holiday-banner'
import { useEffect, useState } from 'react'

interface PublicSettings {
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
        fetch('/api/public/settings')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) setSettings(data)
            })
            .catch(() => {})
    }, [pathname, isAdmin])

    if (isAdmin) {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen flex flex-col pb-20 lg:pb-0">
            {settings?.bannerEnabled && settings.bannerText && (
                <HolidayBanner
                    text={settings.bannerText}
                    link={settings.bannerLink}
                    type={settings.bannerType || 'general'}
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
