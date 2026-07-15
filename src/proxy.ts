import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/admin/login', '/admin/reset-password', '/admin/mfa']
const SESSION_BYPASS_ROUTES = ['/api/admin/session', '/api/admin/auth-check', '/api/admin/session-check', '/api/admin/login', '/api/admin/reset-password', '/api/admin/request-reset']

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const publicRoute = PUBLIC_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'))
  if (publicRoute) {
    return NextResponse.next()
  }

  const cookieHeader = request.headers.get('cookie') || ''
  const hasSession = /admin_session=[^;]+/.test(cookieHeader) || /admin_session_backup=[^;]+/.test(cookieHeader)

  const isAdminPage = pathname.startsWith('/admin') && !pathname.startsWith('/api/')
  const isAdminApi = pathname.startsWith('/api/admin')

  if (isAdminPage && !hasSession) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(url)
  }

  if (isAdminPage && hasSession && pathname === '/admin/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  if (isAdminApi) {
    const isBypass = SESSION_BYPASS_ROUTES.some(r => pathname === r)
    if (!isBypass && !hasSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
}
