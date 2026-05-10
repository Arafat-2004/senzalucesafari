'use server'

import { redirect } from 'next/navigation'
import { destroySession } from '@/lib/admin-auth'

export async function signOut() {
    await destroySession()
    redirect('/admin/login')
}
