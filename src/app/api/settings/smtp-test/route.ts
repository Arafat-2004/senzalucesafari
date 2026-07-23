import { NextResponse } from 'next/server'
import { getSession, hasPermission } from '@/lib/admin-auth'
import { withApiResilience } from '@/lib/reliability/api-resilience'
import { verifySmtpConnection } from '@/lib/integrations/smtp'

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

    const result = await verifySmtpConnection()
    return NextResponse.json({ ok: true, ...result, detail: 'SMTP connection and authentication succeeded.' })
  } catch (error) {
    return NextResponse.json({ ok: false, detail: error instanceof Error ? error.message : 'SMTP verification failed' }, { status: 502 })
  }
}, { route: '/api/settings/smtp-test', method: 'POST', requireAuth: true })
