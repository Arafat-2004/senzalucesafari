import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession, canAccess } from '@/lib/admin-auth'
import { withApiResilience } from '@/lib/reliability/api-resilience'

export const GET = withApiResilience(async () => {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  if (!canAccess(session, 50)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const roles = await prisma.adminRole.findMany()
  return NextResponse.json({ success: true, data: roles })
}, { route: '/api/settings/roles', method: 'GET', requireAuth: true })

export const POST = withApiResilience(async (req: Request) => {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!canAccess(session, 100)) {
    return NextResponse.json({ error: 'Super admin access required' }, { status: 403 })
  }

  const payload = await req.json()
  if (!payload?.name || payload?.permissions === undefined) {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
  }

  const role = await prisma.adminRole.create({ 
    data: {
      name: payload.name.toLowerCase(),
      displayName: payload.name,
      permissions: payload.permissions,
      level: payload.level ?? 0
    }
  })
  return NextResponse.json({ success: true, data: role }, { status: 201 })
}, { route: '/api/settings/roles', method: 'POST', requireAuth: true })
