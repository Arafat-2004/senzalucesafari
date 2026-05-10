import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/admin-auth'
import {
    generateMFASecret,
    generateMFAQRCode,
    verifyMFAToken,
    generateBackupCodes,
    encryptMFASecret,
} from '@/lib/mfa'

export const dynamic = 'force-dynamic'

// POST: Generate QR code / secret for setup
export async function POST() {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const secret = generateMFASecret()
        const qrCode = await generateMFAQRCode(session.email, secret)

        // Store the unverified secret temporarily
        const encryptedSecret = await encryptMFASecret(secret)
        await prisma.adminUser.update({
            where: { id: session.id },
            data: { totpSecret: encryptedSecret },
        })

        return NextResponse.json({
            secret,
            qrCode,
            message: 'Scan the QR code with your authenticator app, then verify',
        })
    } catch (error) {
        console.error('MFA setup POST error:', error)
        return NextResponse.json({ error: 'Failed to generate MFA setup' }, { status: 500 })
    }
}

// PUT: Verify code and enable MFA
export async function PUT(request: Request) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { secret, code } = await request.json()

        if (!secret || !code) {
            return NextResponse.json({ error: 'Secret and code are required' }, { status: 400 })
        }

        const isValid = verifyMFAToken(secret, code)
        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid verification code. Please try again.' },
                { status: 400 }
            )
        }

        const { codes, hashedCodes } = generateBackupCodes(10)
        const encryptedSecret = await encryptMFASecret(secret)

        await prisma.adminUser.update({
            where: { id: session.id },
            data: {
                totpSecret: encryptedSecret,
                mfaEnabled: true,
                backupCodes: JSON.stringify(hashedCodes),
            },
        })

        return NextResponse.json({
            success: true,
            backupCodes: codes,
            message: 'MFA has been enabled successfully',
        })
    } catch (error) {
        console.error('MFA setup PUT error:', error)
        return NextResponse.json({ error: 'Failed to enable MFA' }, { status: 500 })
    }
}
