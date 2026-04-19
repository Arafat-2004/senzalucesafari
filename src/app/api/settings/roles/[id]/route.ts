import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type RoleParams = { params: Promise<{ id: string }> }

export async function GET(req: Request, { params }: RoleParams) {
  const { id } = await params
  const role = await prisma.role.findUnique({ where: { id } })
  if (!role) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(role)
}

export async function PATCH(req: Request, { params }: RoleParams) {
  const { id } = await params
  const payload = await req.json()
  try {
    const updated = await prisma.role.update({ where: { id }, data: payload })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 400 })
  }
}

export async function DELETE(req: Request, { params }: RoleParams) {
  const { id } = await params
  try {
    await prisma.role.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 400 })
  }
}