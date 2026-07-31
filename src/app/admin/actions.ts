'use server'

import { redirect } from 'next/navigation'
import { destroySession, getSession } from '@/lib/admin-auth'
import { createAuditLog } from '@/lib/admin-audit'

export async function signOut() {
    try {
        const session = await getSession()
        if (session) {
            await createAuditLog({
                userId: session.id,
                action: 'LOGOUT',
                entityType: 'admin_user',
                entityId: session.id,
                description: `Administrator ${session.email} logged out`
            })
        }
    } catch (err) {
        console.error('Logout audit error:', err)
    }
    await destroySession()
    redirect('/admin/login')
}
