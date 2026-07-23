'use client'

import { useEffect, useState } from 'react'
import { Download, RefreshCw, X } from 'lucide-react'
import { logger } from '@/lib/reliability/logger'
import { usePathname } from 'next/navigation'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export function PWARegistration() {
  const pathname = usePathname()
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    const isLocalDevelopment =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.endsWith('.local')

    if (isLocalDevelopment || process.env.NODE_ENV !== 'production') {
      void navigator.serviceWorker.getRegistrations()
        .then(registrations => Promise.all(registrations.map(registration => registration.unregister())))
        .then(() => ('caches' in window ? caches.keys() : Promise.resolve([])))
        .then(cacheNames => Promise.all(cacheNames.map(cacheName => caches.delete(cacheName))))
        .catch(error => logger.warn('Unable to clear development service worker caches', { error: error instanceof Error ? error.message : String(error) }))
      return
    }

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
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing
        if (!worker) return
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) setWaitingWorker(worker)
        })
      })
    }).catch(error => logger.error('Service Worker registration failed', { error: error instanceof Error ? error.message : String(error) }))
    const beforeInstall = (event: Event) => {
      event.preventDefault()
      if (pathname.startsWith('/admin')) return
      setInstallPrompt(event as BeforeInstallPromptEvent)
    }
    const installed = () => setInstallPrompt(null)

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
    }
  }, [pathname])

  async function install() {
    if (!installPrompt) return
    await installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(null)
  }

  function update() {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' })
  }

  if ((!waitingWorker && !installPrompt) || dismissed) return null

  return (
    <aside className="fixed bottom-24 left-4 right-4 z-50 mx-auto max-w-md rounded-xl border border-border bg-card p-4 text-card-foreground shadow-2xl" aria-live="polite">
      <button type="button" onClick={() => setDismissed(true)} className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground hover:bg-muted" aria-label="Dismiss app prompt"><X className="h-4 w-4" /></button>
      <div className="flex items-center gap-3 pr-6">
        <div className="tone-success rounded-lg border p-2">{waitingWorker ? <RefreshCw className="h-5 w-5" /> : <Download className="h-5 w-5" />}</div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{waitingWorker ? 'Dashboard update ready' : 'Install Senza Safaris'}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{waitingWorker ? 'Apply the latest reliable version now.' : 'Add the app to this device for faster access and push alerts.'}</p>
        </div>
        <button type="button" onClick={waitingWorker ? update : install} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-dark">{waitingWorker ? 'Update' : 'Install'}</button>
      </div>
    </aside>
  )
}

export default PWARegistration
