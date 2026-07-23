'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'

export function ConsentAnalytics() {
  const [measurementId, setMeasurementId] = useState<string | null>(null)
  const [allowed, setAllowed] = useState(false)
  useEffect(() => {
    const sync = () => setAllowed(localStorage.getItem('cookie-consent-v2') === 'analytics')
    sync()
    window.addEventListener('cookie-consent-changed', sync)
    return () => window.removeEventListener('cookie-consent-changed', sync)
  }, [])
  useEffect(() => {
    if (!allowed) return
    fetch('/api/public/analytics-config').then(response => response.ok ? response.json() : null).then(config => setMeasurementId(config?.enabled ? config.measurementId : null)).catch(() => setMeasurementId(null))
  }, [allowed])
  if (!allowed) return null
  return <><Analytics />{measurementId && <><Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" /><Script id="ga4-consent" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${measurementId}',{anonymize_ip:true});`}</Script></>}</>
}
