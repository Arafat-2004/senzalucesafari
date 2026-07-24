import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const settings = await prisma.appSettings.findFirst({ select: { analyticsEnabled: true, analyticsId: true } })
    const measurementId = (settings?.analyticsId?.trim() || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '').trim()
    const isEnabled = settings ? (settings.analyticsEnabled && /^G-[A-Z0-9]+$/i.test(measurementId)) : /^G-[A-Z0-9]+$/i.test(measurementId)
    
    return NextResponse.json({ 
      enabled: Boolean(isEnabled), 
      measurementId: /^G-[A-Z0-9]+$/i.test(measurementId) ? measurementId : null 
    })
  } catch {
    const measurementId = (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '').trim()
    return NextResponse.json({ 
      enabled: /^G-[A-Z0-9]+$/i.test(measurementId), 
      measurementId: /^G-[A-Z0-9]+$/i.test(measurementId) ? measurementId : null 
    })
  }
}
