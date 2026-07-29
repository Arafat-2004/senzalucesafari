'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'
import {
  ensureGtag,
  getAnalyticsConsent,
  trackAnalyticsEvent,
  updateGoogleConsent,
  type AnalyticsConsent,
} from '@/lib/analytics/ga4'

interface AnalyticsConfig {
  enabled: boolean
  environmentAllowed: boolean
  measurementId: string | null
  debugMode: boolean
}

const DENIED_CONSENT = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500,
}

export function ConsentAnalytics() {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null)
  const [config, setConfig] = useState<AnalyticsConfig | null>(null)
  const measurementIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (isAdmin) return

    ensureGtag()
    window.gtag?.('consent', 'default', DENIED_CONSENT)
    window.gtag?.('set', 'ads_data_redaction', true)

    const syncConsent = () => {
      const nextConsent = getAnalyticsConsent()
      setConsent(nextConsent)
      updateGoogleConsent(nextConsent || 'necessary')
    }

    syncConsent()
    window.addEventListener('cookie-consent-changed', syncConsent)
    return () => window.removeEventListener('cookie-consent-changed', syncConsent)
  }, [isAdmin])

  useEffect(() => {
    if (isAdmin) {
      updateGoogleConsent('necessary')
      setConfig(null)
      return
    }

    if (consent !== 'analytics') {
      if (measurementIdRef.current) {
        const disableFlags = window as unknown as Record<string, boolean>
        disableFlags[`ga-disable-${measurementIdRef.current}`] = true
      }
      return
    }

    const controller = new AbortController()
    fetch('/api/public/analytics-config', {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then((response) => response.ok ? response.json() : null)
      .then((analyticsConfig) => {
        if (!analyticsConfig?.environmentAllowed) return
        if (analyticsConfig.measurementId) {
          const disableFlags = window as unknown as Record<string, boolean>
          disableFlags[`ga-disable-${analyticsConfig.measurementId}`] = false
        }
        measurementIdRef.current = analyticsConfig.measurementId
        window.__senzaAnalyticsDebug = analyticsConfig.debugMode
        setConfig(analyticsConfig)
      })
      .catch(() => setConfig(null))

    return () => controller.abort()
  }, [consent, isAdmin])

  useEffect(() => {
    if (isAdmin || consent !== 'analytics' || !config?.environmentAllowed) return

    const trackContactClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest<HTMLAnchorElement>('a[href]')
      if (!anchor) return
      const href = anchor.getAttribute('href') || ''

      if (/^https:\/\/(?:api\.)?wa\.me\//i.test(href)) {
        trackAnalyticsEvent('whatsapp_clicked', { contact_method: 'whatsapp' })
      } else if (href.startsWith('tel:')) {
        trackAnalyticsEvent('phone_clicked', { contact_method: 'phone' })
      } else if (href.startsWith('mailto:')) {
        trackAnalyticsEvent('email_clicked', { contact_method: 'email' })
      }
    }

    const trackLanguageChange = (event: Event) => {
      const language = (event as CustomEvent<{ language?: string }>).detail?.language
      if (language) trackAnalyticsEvent('language_changed', { language })
    }

    document.addEventListener('click', trackContactClick, true)
    window.addEventListener('language-changed', trackLanguageChange)
    return () => {
      document.removeEventListener('click', trackContactClick, true)
      window.removeEventListener('language-changed', trackLanguageChange)
    }
  }, [config, consent, isAdmin])

  if (isAdmin || consent !== 'analytics' || !config?.environmentAllowed) return null

  return (
    <>
      <Analytics />
      {config.enabled && config.measurementId && (
        <>
          <Script
            id="senza-ga4-library"
            src={`https://www.googletagmanager.com/gtag/js?id=${config.measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="senza-ga4-config" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};window.gtag('js',new Date());window.gtag('config','${config.measurementId}',{anonymize_ip:true,allow_google_signals:false,allow_ad_personalization_signals:false,debug_mode:${config.debugMode}});window.__senzaAnalyticsReady=true;(window.__senzaAnalyticsQueue||[]).splice(0).forEach(function(event){window.gtag('event',event.name,event.params)});`}
          </Script>
        </>
      )}
    </>
  )
}
