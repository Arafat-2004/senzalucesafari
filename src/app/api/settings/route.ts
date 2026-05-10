import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { withApiResilience } from '@/lib/reliability/api-resilience'

type PartialSettings = Partial<Record<string, unknown>>

const settingsUpdateSchema = z.object({
  siteTitle: z.string().min(1).max(200).optional(),
  siteUrl: z.string().url().optional(),
  logoUrl: z.string().url().nullable().optional(),
  faviconUrl: z.string().url().nullable().optional(),
  theme: z.enum(['LIGHT', 'DARK', 'SYSTEM']).optional(),
  primaryColor: z.string().nullable().optional(),
  timezone: z.string().optional(),
  currency: z.string().optional(),
  signupEnabled: z.boolean().optional(),
  mfaRequired: z.boolean().optional(),
  passwordPolicy: z.any().optional(),
  sessionExpiration: z.number().int().positive().optional(),
  allowedDomains: z.array(z.string()).optional(),
  dataRetentionDays: z.number().int().positive().nullable().optional(),
  backupsEnabled: z.boolean().optional(),
  backupSchedule: z.string().nullable().optional(),
  featureFlags: z.any().optional(),
  environment: z.string().optional(),
  smtpHost: z.string().nullable().optional(),
  smtpPort: z.number().int().nullable().optional(),
  smtpUsername: z.string().nullable().optional(),
  smtpPassword: z.string().nullable().optional(),
  webhookUrl: z.string().nullable().optional(),
  webhookSecret: z.string().nullable().optional(),
  analyticsId: z.string().nullable().optional(),
  analyticsEnabled: z.boolean().optional(),
  changedBy: z.string().optional(),
})

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

export const GET = withApiResilience(async () => {
  const settings = await getOrCreateSettings()
  return NextResponse.json(settings)
}, { route: '/api/settings', method: 'GET' })

export const PATCH = withApiResilience(async (req: Request) => {
  try {
    const payload = await req.json() as PartialSettings
    
    const validated = settingsUpdateSchema.parse(payload)
    
    const current = await getOrCreateSettings()
    const updated = await prisma.appSettings.update({ 
      where: { id: current.id }, 
      data: {
        ...validated,
        updatedAt: new Date(),
        version: (current.version ?? 1) + 1,
      }
    })

    await prisma.settingsAudit.create({ 
      data: {
        changes: validated,
        changedBy: (payload.changedBy as string) ?? 'admin',
        environment: updated.environment,
      }
    })

    revalidatePath('/')
    revalidatePath('/admin/settings')

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.error('[Settings] Update error:', error)
    }
    
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}, { route: '/api/settings', method: 'PATCH' })
