import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname
    const isAdminPageRoute = pathname.startsWith('/admin') && !pathname.startsWith('/admin/api')
    const isLoginPage = pathname === '/admin/login'
    const isApiAdminRoute = pathname.startsWith('/api/admin')
    const bypassAdminAuth =
        process.env.E2E_BYPASS_ADMIN_AUTH === '1' &&
        request.cookies.get('e2e_admin_bypass')?.value === '1'

    if (isAdminPageRoute && !isLoginPage && !user && !bypassAdminAuth) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin/login'
        return NextResponse.redirect(url)
    }

    // Only redirect from login page if user has a valid admin_session (fully logged in)
    if (isLoginPage && !bypassAdminAuth) {
        const adminSessionCookie = request.cookies.get('admin_session')
        if (adminSessionCookie?.value) {
            const url = request.nextUrl.clone()
            url.pathname = '/admin'
            return NextResponse.redirect(url)
        }
    }

    if (isApiAdminRoute) {
        // Allow session creation API without existing cookie
        const isSessionApi = pathname === '/api/admin/session'
        if (!isSessionApi) {
            const adminSessionCookie = request.cookies.get('admin_session')
            if (!adminSessionCookie?.value) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }
        }
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
