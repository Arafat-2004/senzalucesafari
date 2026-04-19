import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const roles = await prisma.role.findMany()
  return NextResponse.json(roles)
}

export async function POST(req: Request) {
  const payload = await req.json()
  if (!payload?.name || payload?.permissions === undefined) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  const role = await prisma.role.create({ data: {
    name: payload.name,
    permissions: payload.permissions
  }})
  return NextResponse.json(role, { status: 201 })
}
