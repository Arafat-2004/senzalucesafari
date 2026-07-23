import webPush, { type PushSubscription } from 'web-push'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/reliability/logger'

export type PushMessage = { title: string; body: string; url?: string; tag?: string }

export function pushIsConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY && process.env.VAPID_SUBJECT)
}

function configurePush() {
  if (!pushIsConfigured()) return false
  webPush.setVapidDetails(process.env.VAPID_SUBJECT!, process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!, process.env.VAPID_PRIVATE_KEY!)
  return true
}

export async function sendAdminPush(message: PushMessage, target?: { userId?: string; role?: string }) {
  if (!configurePush()) {
    logger.warn('Web Push delivery skipped: VAPID environment is not configured')
    return { sent: 0, failed: 0, configured: false }
  }
  const subscriptions = await prisma.adminPushSubscription.findMany({
    where: { user: { isActive: true, ...(target?.userId ? { id: target.userId } : {}), ...(target?.role ? { role: { name: target.role } } : {}) } },
  })
  let sent = 0; let failed = 0
  await Promise.all(subscriptions.map(async subscription => {
    const pushSubscription: PushSubscription = { endpoint: subscription.endpoint, keys: { p256dh: subscription.p256dh, auth: subscription.auth } }
    try {
      await webPush.sendNotification(pushSubscription, JSON.stringify(message), { TTL: 300, urgency: 'high' })
      sent++
    } catch (error) {
      failed++
      const statusCode = typeof error === 'object' && error && 'statusCode' in error ? Number(error.statusCode) : 0
      if (statusCode === 404 || statusCode === 410) await prisma.adminPushSubscription.delete({ where: { id: subscription.id } }).catch(() => undefined)
      else logger.error('Web Push delivery failed', { subscriptionId: subscription.id, error: error instanceof Error ? error.message : String(error) })
    }
  }))
  return { sent, failed, configured: true }
}
