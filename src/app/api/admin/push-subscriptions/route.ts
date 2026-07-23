import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/admin-auth'
import { pushIsConfigured, sendAdminPush } from '@/lib/push-notifications'

const subscriptionSchema = z.object({ endpoint: z.string().url(), keys: z.object({ p256dh: z.string().min(1), auth: z.string().min(1) }) })

export async function GET() {
  const session = await getSession(); if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ configured: pushIsConfigured(), publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? null, subscriptions: await prisma.adminPushSubscription.count({ where: { userId: session.id } }) })
}

export async function POST(request: Request) {
  const session = await getSession(); if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!pushIsConfigured()) return NextResponse.json({ error: 'Push delivery is not configured on this deployment.' }, { status: 503 })
  const parsed = subscriptionSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: 'Invalid push subscription.' }, { status: 400 })
  await prisma.adminPushSubscription.upsert({ where: { endpoint: parsed.data.endpoint }, create: { userId: session.id, endpoint: parsed.data.endpoint, p256dh: parsed.data.keys.p256dh, auth: parsed.data.keys.auth, userAgent: request.headers.get('user-agent') }, update: { userId: session.id, p256dh: parsed.data.keys.p256dh, auth: parsed.data.keys.auth, userAgent: request.headers.get('user-agent') } })
  await sendAdminPush({ title: 'Notifications enabled', body: 'This device will receive Senza Luce admin alerts.', url: '/admin/notifications', tag: 'push-enabled' }, { userId: session.id })
  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const session = await getSession(); if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const endpoint = z.string().url().safeParse((await request.json()).endpoint); if (!endpoint.success) return NextResponse.json({ error: 'Invalid endpoint.' }, { status: 400 })
  await prisma.adminPushSubscription.deleteMany({ where: { userId: session.id, endpoint: endpoint.data } })
  return NextResponse.json({ success: true })
}
