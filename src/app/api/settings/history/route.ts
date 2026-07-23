import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession, hasPermission } from '@/lib/admin-auth'
import { withApiResilience } from '@/lib/reliability/api-resilience'

export const GET = withApiResilience(async () => {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const hasAccess = await hasPermission('settings', 'VIEW')
  if (!hasAccess) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const hist = await prisma.settingsAudit.findMany({ 
    orderBy: { timestamp: 'desc' }, 
    take: 20 
  })
  return NextResponse.json(hist)
}, { route: '/api/settings/history', method: 'GET', requireAuth: true })
