import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type PartialSettings = Partial<Record<string, any>>

async function getOrCreateSettings() {
  let s = await prisma.appSettings.findFirst()
  if (!s) {
    s = await prisma.appSettings.create({
      data: {
        siteTitle: 'Senza Luce Safaris',
        siteUrl: 'https://example.com',
        environment: 'production',
        version: 1,
      },
    })
  }
  return s
}

export async function GET() {
  const settings = await getOrCreateSettings()
  return NextResponse.json(settings)
}

export async function PATCH(req: Request) {
  const payload = await req.json() as PartialSettings
  const current = await getOrCreateSettings()
  const updated = await prisma.appSettings.update({ where: { id: current.id }, data: {
    ...payload,
    updatedAt: new Date(),
    version: (current.version ?? 1) + 1,
  }})

  // Audit trail
  await prisma.settingsAudit.create({ data: {
    changes: payload,
    changedBy: (payload.changedBy as string) ?? 'admin',
    environment: updated.environment,
  }})

  return NextResponse.json(updated)
}
