import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession, canAccess } from '@/lib/admin-auth'
import { withApiResilience } from '@/lib/reliability/api-resilience'

export const GET = withApiResilience(async (req: Request, ctx: Record<string, unknown>) => {
    const params = ctx.params as Promise<{ id: string }>
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  if (!canAccess(session, 50)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }
  
  const { id } = await params
  const role = await prisma.adminRole.findUnique({ where: { id } })
  if (!role) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true, data: role })
}, { route: '/api/settings/roles/:id', method: 'GET', requireAuth: true })

export const PATCH = withApiResilience(async (req: Request, ctx: Record<string, unknown>) => {
    const params = ctx.params as Promise<{ id: string }>
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  if (!canAccess(session, 100)) {
    return NextResponse.json({ error: 'Super admin access required' }, { status: 403 })
  }
  
  const { id } = await params
  const payload = await req.json()
  try {
    const updated = await prisma.adminRole.update({ where: { id }, data: payload })
    return NextResponse.json({ success: true, data: updated })
  } catch {
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 400 })
  }
}, { route: '/api/settings/roles/:id', method: 'PATCH', requireAuth: true })

export const DELETE = withApiResilience(async (req: Request, ctx: Record<string, unknown>) => {
    const params = ctx.params as Promise<{ id: string }>
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  if (!canAccess(session, 100)) {
    return NextResponse.json({ error: 'Super admin access required' }, { status: 403 })
  }
  
  const { id } = await params
  try {
    await prisma.adminRole.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Delete failed' }, { status: 400 })
  }
}, { route: '/api/settings/roles/:id', method: 'DELETE', requireAuth: true })