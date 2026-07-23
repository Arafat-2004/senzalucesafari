import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const settings = await prisma.appSettings.findFirst({ select: { analyticsEnabled: true, analyticsId: true } })
    const measurementId = settings?.analyticsId?.trim() || ''
    return NextResponse.json({ enabled: Boolean(settings?.analyticsEnabled && /^G-[A-Z0-9]+$/i.test(measurementId)), measurementId: /^G-[A-Z0-9]+$/i.test(measurementId) ? measurementId : null })
  } catch {
    return NextResponse.json({ enabled: false, measurementId: null })
  }
}
