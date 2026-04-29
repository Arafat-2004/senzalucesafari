import { NextResponse } from 'next/server'
import { getSession } from '@/lib/admin-auth'

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
        console.error('[Session Check] Error:', error)
        return NextResponse.json({
            authenticated: false,
            error: 'Failed to check session',
        }, { status: 500 })
    }
}