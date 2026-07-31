import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { withApiResilience } from '@/lib/reliability/api-resilience'
import { logger } from '@/lib/reliability/logger'
import { getSession, hasPermission } from '@/lib/admin-auth'
import { encryptIntegrationSecret, isSecretMask, SECRET_MASK } from '@/lib/integration-secrets'
import { PRODUCTION_SITE_URL } from '@/config/site'

type PartialSettings = Partial<Record<string, unknown>>

// Coerce empty string to null for URL fields so z.string().url() doesn't reject ''
const nullableUrl = z.preprocess(
  (v) => (v === '' ? null : v),
  z.string().url().nullable().optional()
)

// Coerce empty string to null for generic nullable strings
const nullableString = z.preprocess(
  (v) => (v === '' ? null : v),
  z.string().nullable().optional()
)

const settingsUpdateSchema = z.object({
  siteTitle: z.string().min(1).max(200).optional(),
  // siteUrl: accept empty string as unchanged (skip validation)
  siteUrl: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.string().url().optional()
  ),
  logoUrl: nullableUrl,
  faviconUrl: nullableUrl,
  theme: z.enum(['LIGHT', 'DARK', 'SYSTEM']).optional(),
  primaryColor: nullableString,
  timezone: z.string().optional(),
  currency: z.string().optional(),
  signupEnabled: z.boolean().optional(),
  mfaRequired: z.boolean().optional(),
  passwordPolicy: z.any().optional(),
  sessionExpiration: z.number().int().positive().optional(),
  // allowedDomains can be null in DB (no domains set yet)
  allowedDomains: z.array(z.string()).nullable().optional(),
  dataRetentionDays: z.number().int().positive().nullable().optional(),
  backupsEnabled: z.boolean().optional(),
  backupSchedule: nullableString,
  featureFlags: z.any().optional(),
  environment: z.string().optional(),
  smtpHost: nullableString,
  smtpPort: z.number().int().nullable().optional(),
  smtpUsername: nullableString,
  smtpPassword: nullableString,
  webhookUrl: nullableString,
  webhookSecret: nullableString,
  analyticsId: nullableString,
  analyticsEnabled: z.boolean().optional(),
  // Announcement banner fields
  bannerEnabled: z.boolean().optional().nullable(),
  bannerText: nullableString,
  bannerLink: nullableString,
  bannerType: z.preprocess(
    (v) => (v === '' || v == null ? 'general' : v),
    z.string().optional()
  ),
  changedBy: z.string().optional(),
}).passthrough()  // allow extra DB fields (id, version, createdAt etc.) to be silently ignored

async function getOrCreateSettings() {
  let s = await prisma.appSettings.findFirst()
  if (!s) {
    s = await prisma.appSettings.create({
      data: {
        siteTitle: 'Senza Luce Safari',
        siteUrl: PRODUCTION_SITE_URL,
        environment: 'production',
        version: 1,
      },
    })
  }

  // Auto-fill integrations if they are currently null in the database
  let needsUpdate = false
  const updateData: Record<string, any> = {}

  if (!s.analyticsId && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    updateData.analyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    updateData.analyticsEnabled = true
    needsUpdate = true
  }

  if (!s.smtpHost && process.env.RESEND_API_KEY) {
    updateData.smtpHost = 'smtp.resend.com'
    updateData.smtpPort = 465
    updateData.smtpUsername = 'resend'
    updateData.smtpPassword = encryptIntegrationSecret(process.env.RESEND_API_KEY)
    needsUpdate = true
  }

  if (needsUpdate) {
    s = await prisma.appSettings.update({
      where: { id: s.id },
      data: updateData,
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

    // Validate and coerce the payload — unknown extra fields are stripped
    let validated: z.infer<typeof settingsUpdateSchema>
    try {
      validated = settingsUpdateSchema.parse(payload)
    } catch (zodErr) {
      if (zodErr instanceof z.ZodError) {
        logger.warn('[Settings] Validation failed', { issues: zodErr.issues })
        return NextResponse.json(
          { error: 'Validation failed', details: zodErr.issues },
          { status: 400 }
        )
      }
      throw zodErr
    }

    // Strip non-DB fields before writing
    const { changedBy: _changedBy, ...dbFields } = validated as Record<string, unknown> & { changedBy?: string }

    // Also strip any fields that came through passthrough but are not DB columns
    const nonDbKeys = new Set(['id', 'createdAt', 'updatedAt', 'version'])
    const updateData: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(dbFields)) {
      if (!nonDbKeys.has(k)) {
        updateData[k] = v
      }
    }

    // Handle secret fields: don't overwrite with mask placeholder
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

    // Ensure bannerEnabled is a proper boolean (not null)
    if (updateData.bannerEnabled == null) {
      updateData.bannerEnabled = false
    }

    const current = await getOrCreateSettings()

    const updated = await prisma.appSettings.update({
      where: { id: current.id },
      data: {
        ...updateData,
        updatedAt: new Date(),
        version: (current.version ?? 1) + 1,
      },
    })

    // Record audit trail (best-effort — don't fail the request if audit fails)
    try {
      await prisma.settingsAudit.create({
        data: {
          changes: JSON.parse(JSON.stringify(updateData)),
          changedBy: session.email || (payload.changedBy as string) || 'admin',
          environment: updated.environment,
        },

      })

      const { createAuditLog } = await import('@/lib/admin-audit');
      await createAuditLog({
          userId: session.id,
          action: 'UPDATE',
          entityType: 'settings',
          entityId: current.id,
          description: `Updated global application settings`,
          metadata: JSON.parse(JSON.stringify(updateData))
      });
    } catch (auditErr) {
      logger.warn('[Settings] Audit write failed (non-fatal)', {
        error: auditErr instanceof Error ? auditErr.message : String(auditErr),
      })
    }

    revalidatePath('/')
    revalidatePath('/admin/settings')

    // Return updated settings with masked credentials
    const responseData = {
      ...updated,
      smtpPassword: updated.smtpPassword ? SECRET_MASK : null,
      webhookSecret: updated.webhookSecret ? SECRET_MASK : null,
    }

    return NextResponse.json(responseData)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    logger.error('[Settings] PATCH failed', { error: msg })
    return NextResponse.json(
      {
        error: 'Failed to update settings',
        detail: process.env.NODE_ENV !== 'production' ? msg : undefined,
      },
      { status: 500 }
    )
  }
}, { route: '/api/settings', method: 'PATCH', requireAuth: true })
