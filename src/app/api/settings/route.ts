import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { withApiResilience } from '@/lib/reliability/api-resilience'
import { logger } from '@/lib/reliability/logger'
import { getSession, hasPermission } from '@/lib/admin-auth'
import { encryptIntegrationSecret, isSecretMask, SECRET_MASK } from '@/lib/integration-secrets'

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
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const hasAccess = await hasPermission('settings', 'VIEW')
  if (!hasAccess) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const settings = await getOrCreateSettings()

  // Mask sensitive credentials
  const responseData = {
    ...settings,
    smtpPassword: settings.smtpPassword ? SECRET_MASK : null,
    webhookSecret: settings.webhookSecret ? SECRET_MASK : null,
  }

  return NextResponse.json(responseData)
}, { route: '/api/settings', method: 'GET', requireAuth: true })

export const PATCH = withApiResilience(async (req: Request) => {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hasAccess = await hasPermission('settings', 'EDIT')
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const payload = await req.json() as PartialSettings
    const validated = settingsUpdateSchema.parse(payload)
    
    const current = await getOrCreateSettings()

    // Process data to avoid overwriting existing secrets with mask values
    const updateData: Record<string, any> = { ...validated }
    if (isSecretMask(updateData.smtpPassword)) {
      delete updateData.smtpPassword
    } else if (typeof updateData.smtpPassword === 'string' && updateData.smtpPassword) {
      updateData.smtpPassword = encryptIntegrationSecret(updateData.smtpPassword)
    }
    if (isSecretMask(updateData.webhookSecret)) {
      delete updateData.webhookSecret
    } else if (typeof updateData.webhookSecret === 'string' && updateData.webhookSecret) {
      updateData.webhookSecret = encryptIntegrationSecret(updateData.webhookSecret)
    }

    const updated = await prisma.appSettings.update({ 
      where: { id: current.id }, 
      data: {
        ...updateData,
        updatedAt: new Date(),
        version: (current.version ?? 1) + 1,
      }
    })

    await prisma.settingsAudit.create({ 
      data: {
        changes: updateData,
        changedBy: session.email || (payload.changedBy as string) || 'admin',
        environment: updated.environment,
      }
    })

    revalidatePath('/')
    revalidatePath('/admin/settings')

    // Return updated settings with masked credentials
    const responseData = {
      ...updated,
      smtpPassword: updated.smtpPassword ? SECRET_MASK : null,
      webhookSecret: updated.webhookSecret ? SECRET_MASK : null,
    }

    return NextResponse.json(responseData)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }
    
    if (process.env.NODE_ENV === 'development') {
      logger.error('[Settings] Update error', { error: error instanceof Error ? error.message : String(error) })
    }
    
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}, { route: '/api/settings', method: 'PATCH', requireAuth: true })
