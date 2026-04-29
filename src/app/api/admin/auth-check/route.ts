import { NextResponse } from 'next/server'
import { getSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({
                authenticated: false,
                mfaRequired: false,
                mfaVerified: false,
            })
        }

        const user = await prisma.adminUser.findUnique({
            where: { id: session.id },
            select: {
                id: true,
                mfaEnabled: true,
                totpSecret: true,
                lastLoginAt: true,
            },
        })

        return NextResponse.json({
            authenticated: true,
            mfaRequired: user?.mfaEnabled || false,
            mfaVerified: !!user?.totpSecret,
            session: {
                id: session.id,
                email: session.email,
                firstName: session.firstName,
                lastName: session.lastName,
                mfaEnabled: user?.mfaEnabled || false,
                lastLoginAt: user?.lastLoginAt,
            },
        })
    } catch (error) {
        console.error('[Auth Check] Error:', error)
        return NextResponse.json({
            authenticated: false,
            error: 'Failed to check authentication',
        }, { status: 500 })
    }
}