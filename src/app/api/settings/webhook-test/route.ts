import { NextResponse } from 'next/server'
import { getSession, hasPermission } from '@/lib/admin-auth'
import { withApiResilience } from '@/lib/reliability/api-resilience'
import { dispatchWebhook } from '@/lib/integrations/webhooks'

export const POST = withApiResilience(async () => {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const hasAccess = await hasPermission('settings', 'EDIT')
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const result = await dispatchWebhook('integration.test', { message: 'Senza Luce webhook connection test' })
    return NextResponse.json({ ok: true, ...result, detail: 'Signed webhook delivered successfully.' })
  } catch (error) {
    return NextResponse.json({ ok: false, detail: error instanceof Error ? error.message : 'Webhook delivery failed' }, { status: 502 })
  }
}, { route: '/api/settings/webhook-test', method: 'POST', requireAuth: true })
