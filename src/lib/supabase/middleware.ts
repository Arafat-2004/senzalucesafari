import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
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

    // Protect /admin page routes (except login page) with Supabase auth
    if (isAdminPageRoute && !isLoginPage && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin/login'
        return NextResponse.redirect(url)
    }

    // Redirect logged-in users away from login page
    if (isLoginPage && user) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin'
        return NextResponse.redirect(url)
    }

    // Protect /api/admin routes with custom session cookie
    if (isApiAdminRoute) {
        const adminSessionCookie = request.cookies.get('admin_session')
        if (!adminSessionCookie?.value) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
    }

    return supabaseResponse
}
