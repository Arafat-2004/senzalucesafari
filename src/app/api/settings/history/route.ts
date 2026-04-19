import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const hist = await prisma.settingsAudit.findMany({ orderBy: { timestamp: 'desc' }, take: 20 })
  return NextResponse.json(hist)
}
