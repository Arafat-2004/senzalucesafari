import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/reliability/logger'

export async function GET() {
  try {
    const settings = await prisma.appSettings.findFirst({
      select: {
        siteTitle: true,
        logoUrl: true,
        faviconUrl: true,
        theme: true,
        primaryColor: true,
        timezone: true,
        currency: true,
        bannerEnabled: true,
        bannerText: true,
        bannerLink: true,
        bannerType: true,
        featureFlags: true,
      }
    })
    
    if (!settings) {
      return NextResponse.json({
        siteTitle: 'Senza Luce Safaris',
        theme: 'SYSTEM',
        primaryColor: '#176B45',
        currency: 'USD',
        bannerEnabled: false,
        bannerText: '',
        bannerLink: '',
        bannerType: 'general',
      })
    }
    
    return NextResponse.json(settings)
  } catch (error) {
    logger.warn('[PublicSettings] Database settings query failed, falling back to static config', {
      error: error instanceof Error ? error.message : String(error)
    })
    return NextResponse.json({
      siteTitle: 'Senza Luce Safaris',
      theme: 'SYSTEM',
      primaryColor: '#176B45',
      currency: 'USD',
      bannerEnabled: false,
      bannerText: '',
      bannerLink: '',
      bannerType: 'general',
      isFallback: true
    })
  }
}
