'use client'

import { useEffect, useState } from 'react'
import { Download, RefreshCw, X } from 'lucide-react'
import { logger } from '@/lib/reliability/logger'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export function PWARegistration() {
  const pathname = usePathname()
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(true)
  const [cookieConsentActive, setCookieConsentActive] = useState(false)

  useEffect(() => {
    // Check if running in standalone mode (already installed/running as PWA)
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (navigator as any).standalone === true;

    // Check if dismissed recently (7 days cooldown)
    const dismissedAt = localStorage.getItem('pwa-install-dismissed-at')
    const hasBeenInstalled = localStorage.getItem('pwa-installed') === 'true'
    
    let isDismissed = false
    if (dismissedAt) {
      const lastDismissed = parseInt(dismissedAt, 10)
      if (Date.now() - lastDismissed < 7 * 24 * 60 * 60 * 1000) {
        isDismissed = true
      }
    }

    if (isStandalone || hasBeenInstalled) {
      isDismissed = true
    }

    setDismissed(isDismissed)

    // Coordinated cookie consent check
    const checkCookieConsent = () => {
      const consent = localStorage.getItem('cookie-consent-v2')
      setCookieConsentActive(!consent)
    }
    checkCookieConsent()
    window.addEventListener('cookie-consent-changed', checkCookieConsent)

    if (!('serviceWorker' in navigator)) {
      return () => {
        window.removeEventListener('cookie-consent-changed', checkCookieConsent)
      }
    }

    const isLocalDevelopment =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.endsWith('.local') ||
      window.location.hostname.startsWith('192.168.') ||
      window.location.hostname.startsWith('10.') ||
      window.location.hostname.startsWith('172.')

    let refreshing = false
    const controllerChanged = () => {
      if (!refreshing) {
        refreshing = true
        window.location.reload()
      }
    }
    
    const register = () => navigator.serviceWorker.register('/sw.js').then(registration => {
      logger.info('Service Worker registered with scope', { scope: registration.scope })
      void registration.update()

      if (isLocalDevelopment) {
        caches.keys()
          .then(keys => Promise.all(keys.map(key => caches.delete(key))))
          .catch(() => {})
      }

      registration.addEventListener('updatefound', () => {
        const worker = registration.installing
        if (!worker) return
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            setWaitingWorker(worker)
          }
        })
      })
    }).catch(error => logger.error('Service Worker registration failed', { error: error instanceof Error ? error.message : String(error) }))

    const beforeInstall = (event: Event) => {
      event.preventDefault()
      if (window.location.pathname.startsWith('/admin')) return
      setInstallPrompt(event as BeforeInstallPromptEvent)
    }

    const installed = () => {
      setInstallPrompt(null)
      localStorage.setItem('pwa-installed', 'true')
    }

    navigator.serviceWorker.addEventListener('controllerchange', controllerChanged)
    window.addEventListener('beforeinstallprompt', beforeInstall)
    window.addEventListener('appinstalled', installed)
    if (document.readyState === 'complete') void register()
    else window.addEventListener('load', register, { once: true })

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', controllerChanged)
      window.removeEventListener('beforeinstallprompt', beforeInstall)
      window.removeEventListener('appinstalled', installed)
      window.removeEventListener('load', register)
      window.removeEventListener('cookie-consent-changed', checkCookieConsent)
    }
  }, [])

  async function install() {
    if (!installPrompt) return
    try {
      await installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      if (outcome === 'accepted') {
        localStorage.setItem('pwa-installed', 'true')
      } else {
        localStorage.setItem('pwa-install-dismissed-at', Date.now().toString())
        setDismissed(true)
      }
    } catch (err) {
      logger.error('PWA installation error', { error: err instanceof Error ? err.message : String(err) })
    }
    setInstallPrompt(null)
  }

  function update() {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' })
  }

  function handleDismiss() {
    if (waitingWorker) {
      setDismissed(true)
    } else {
      localStorage.setItem('pwa-install-dismissed-at', Date.now().toString())
      setDismissed(true)
    }
  }

  const shouldShow = waitingWorker ? true : (installPrompt && !dismissed)

  if (!shouldShow) return null

  return (
    <aside 
      className={cn(
        "fixed left-4 right-4 z-50 mx-auto max-w-md rounded-xl border border-border bg-card p-4 text-card-foreground shadow-2xl transition-all duration-300",
        cookieConsentActive 
          ? "bottom-[270px] sm:bottom-[150px]" 
          : "bottom-24"
      )} 
      aria-live="polite"
    >
      <button type="button" onClick={handleDismiss} className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground hover:bg-muted" aria-label="Dismiss app prompt"><X className="h-4 w-4" /></button>
      <div className="flex items-center gap-3 pr-6">
        <div className="tone-success rounded-lg border p-2">{waitingWorker ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}</div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{waitingWorker ? 'Dashboard update ready' : 'Install Senza Safaris'}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{waitingWorker ? 'Apply the latest reliable version now.' : 'Add the app to this device for faster access and push alerts.'}</p>
        </div>
        <button type="button" onClick={waitingWorker ? update : install} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-dark transition-colors">{waitingWorker ? 'Update' : 'Install'}</button>
      </div>
    </aside>
  )
}

export default PWARegistration
