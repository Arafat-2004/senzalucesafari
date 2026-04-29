import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/admin-auth'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const roles = await prisma.adminRole.findMany()
  return NextResponse.json({ success: true, data: roles })
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const payload = await req.json()
  if (!payload?.name || payload?.permissions === undefined) {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
  }
  const role = await prisma.adminRole.create({ data: {
    name: payload.name,
    displayName: payload.name,
    permissions: payload.permissions
  }})
  return NextResponse.json({ success: true, data: role }, { status: 201 })
}
