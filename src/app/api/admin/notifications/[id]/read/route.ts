import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession, canAccess } from '@/lib/admin-auth'
import { withApiResilience } from '@/lib/reliability/api-resilience'

export const POST = withApiResilience(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!canAccess(session, 50)) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { id } = await params

    await prisma.adminNotification.update({
        where: { id },
        data: { 
            isRead: true,
            readAt: new Date()
        }
    })

    return NextResponse.json({ success: true })
}, { route: '/api/admin/notifications/:id/read', method: 'POST', requireAuth: true })