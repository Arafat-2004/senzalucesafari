import { createHmac, randomUUID } from 'crypto'
import { prisma } from '@/lib/prisma'
import { decryptIntegrationSecret } from '@/lib/integration-secrets'

function validateTarget(value: string) {
  const url = new URL(value)
  const blocked = ['localhost', '127.0.0.1', '::1'].includes(url.hostname) || /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(url.hostname)
  if (blocked) throw new Error('Private or local webhook addresses are not allowed.')
  if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') throw new Error('Production webhooks must use HTTPS.')
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Webhook URL must use HTTP or HTTPS.')
  return url.toString()
}

export async function dispatchWebhook(event: string, payload: Record<string, unknown>) {
  const settings = await prisma.appSettings.findFirst({ select: { webhookUrl: true, webhookSecret: true } })
  if (!settings?.webhookUrl || !settings.webhookSecret) throw new Error('Save a webhook URL and signing secret first.')
  const url = validateTarget(settings.webhookUrl)
  const secret = decryptIntegrationSecret(settings.webhookSecret)
  if (!secret) throw new Error('Webhook signing secret is missing.')
  const body = JSON.stringify({ id: randomUUID(), event, createdAt: new Date().toISOString(), data: payload })
  const signature = `sha256=${createHmac('sha256', secret).update(body).digest('hex')}`
  let lastError = 'Webhook delivery failed.'
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', 'x-senza-event': event, 'x-senza-signature': signature, 'x-senza-attempt': String(attempt) }, body, signal: AbortSignal.timeout(10_000) })
      if (response.ok) return { status: response.status, attempts: attempt }
      lastError = `Webhook returned HTTP ${response.status}.`
    } catch (error) {
      lastError = error instanceof Error ? error.message : lastError
    }
    if (attempt < 3) await new Promise(resolve => setTimeout(resolve, attempt * 300))
  }
  throw new Error(lastError)
}
