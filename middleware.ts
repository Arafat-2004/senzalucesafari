import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const publicRoutes = ['/admin/login', '/admin/reset-password', '/admin/mfa'];
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));

  const isAdminPageRoute = pathname.startsWith('/admin') && !pathname.startsWith('/api/admin');
  const isApiAdminRoute = pathname.startsWith('/api/admin');

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const adminSessionCookie = request.cookies.get('admin_session');
  const adminSessionBackup = request.cookies.get('admin_session_backup');
  const hasAdminSession = !!adminSessionCookie?.value || !!adminSessionBackup?.value;

  if (isAdminPageRoute) {
    if (!hasAdminSession) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isApiAdminRoute) {
    const sessionCreationRoutes = ['/api/admin/session', '/api/admin/auth-check', '/api/admin/session-check', '/api/admin/login', '/api/admin/reset-password', '/api/admin/request-reset'];
    const isSessionCreationRoute = sessionCreationRoutes.some(route => pathname === route);

    if (!isSessionCreationRoute && !hasAdminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
