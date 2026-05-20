import { NextResponse } from 'next/server'
import { getSession } from '@/lib/admin-auth'
import { logger } from '@/lib/reliability/logger'

export async function GET() {
    try {
        const session = await getSession()
        
        return NextResponse.json({
            authenticated: !!session,
            userId: session?.id || null,
            firstName: session?.firstName || null,
            lastName: session?.lastName || null,
            role: session?.role?.name || null,
        })
    } catch (error) {
        logger.error('[Session Check] Error', { error: error instanceof Error ? error.message : String(error) })
        return NextResponse.json({
            authenticated: false,
            error: 'Failed to check session',
        }, { status: 500 })
    }
}