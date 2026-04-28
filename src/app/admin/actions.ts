'use server'

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { destroySession } from '@/lib/admin-auth'

export async function signOut() {
    const supabase = await createServerSupabaseClient()
    await supabase.auth.signOut()
    // Also clear custom admin session cookies
    await destroySession()
    redirect('/admin/login')
}
