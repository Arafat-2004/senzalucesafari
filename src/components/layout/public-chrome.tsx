'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { MobileCTABar } from '@/components/ui/mobile-cta-bar'

export function PublicChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAdmin = pathname.startsWith('/admin')

    if (isAdmin) {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen flex flex-col pb-20 lg:pb-0">
            <Header />
            <main id="main-content" className="flex-1">
                {children}
            </main>
            <Footer />
            <MobileCTABar />
        </div>
    )
}
