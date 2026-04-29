import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession, canAccess } from '@/lib/admin-auth'
import { withApiResilience } from '@/lib/reliability/api-resilience'

export const POST = withApiResilience(async (request: Request) => {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!canAccess(session, 50)) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { email, content } = await request.json()
    
    if (!email || !content) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const note = await prisma.customerNote.create({
        data: {
            customerEmail: email.toLowerCase(),
            content,
            adminId: session.id
        }
    })

    return NextResponse.json(note)
}, { route: '/api/admin/customers/notes', method: 'POST', requireAuth: true })