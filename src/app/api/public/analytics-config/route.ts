import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PRODUCTION_SITE_URL } from '@/config/site'

const GA_ID_PATTERN = /^G-[A-Z0-9]+$/i

function isProductionAnalyticsHost(hostname: string): boolean {
  return hostname.toLowerCase() === new URL(PRODUCTION_SITE_URL).hostname
}

export async function GET(request: NextRequest) {
  const hostname = request.nextUrl.hostname
  const isProductionHost = isProductionAnalyticsHost(hostname)
  const isProductionDeployment = process.env.VERCEL_ENV
    ? process.env.VERCEL_ENV === 'production' && isProductionHost
    : isProductionHost
  const allowNonProduction = process.env.ANALYTICS_ALLOW_NON_PRODUCTION === 'true'
  const environmentAllowed = isProductionDeployment || allowNonProduction
  const debugMode = !isProductionDeployment
    && allowNonProduction
    && process.env.ANALYTICS_DEBUG_MODE === 'true'

  const environmentMeasurementId = (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '').trim()

  try {
    const settings = await prisma.appSettings.findFirst({
      select: { analyticsEnabled: true, analyticsId: true },
    })
    const settingsMeasurementId = (settings?.analyticsId || '').trim()
    const measurementId = GA_ID_PATTERN.test(environmentMeasurementId)
      ? environmentMeasurementId
      : settingsMeasurementId
    const settingsAllowAnalytics = settings ? settings.analyticsEnabled : true
    const enabled = environmentAllowed
      && settingsAllowAnalytics
      && GA_ID_PATTERN.test(measurementId)

    return NextResponse.json({
      enabled,
      environmentAllowed,
      measurementId: enabled ? measurementId : null,
      debugMode,
    }, {
      headers: { 'Cache-Control': 'private, no-store, max-age=0' },
    })
  } catch {
    const enabled = environmentAllowed && GA_ID_PATTERN.test(environmentMeasurementId)
    return NextResponse.json({
      enabled,
      environmentAllowed,
      measurementId: enabled ? environmentMeasurementId : null,
      debugMode,
    }, {
      headers: { 'Cache-Control': 'private, no-store, max-age=0' },
    })
  }
}
