import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Define public routes that don't need authentication
  const publicRoutes = ['/admin/login', '/admin/reset-password'];
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));

  // Define admin page routes (not API routes)
  const isAdminPageRoute = pathname.startsWith('/admin') && !pathname.startsWith('/admin/api');
  const isApiAdminRoute = pathname.startsWith('/api/admin');

  // First, run Supabase session update
  const supabaseResponse = await updateSession(request);

  // If it's a public route, allow access
  if (isPublicRoute) {
    return supabaseResponse;
  }

  // Check for authentication: either Supabase user OR admin_session cookie
  const adminSessionCookie = request.cookies.get('admin_session');
  const hasAdminSession = !!adminSessionCookie?.value;

  // For admin page routes, check if user has any valid session
  if (isAdminPageRoute) {
    // Extract Supabase user from the response (already checked in updateSession)
    // We need to re-check here since updateSession doesn't return the user
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let hasSupabaseSession = false;
    if (supabaseUrl && supabaseAnonKey) {
      try {
        // Check for Supabase session cookie
        const supabaseSessionCookie = request.cookies.get('sb-' + new URL(supabaseUrl).hostname.split('.')[0] + '-auth-token');
        hasSupabaseSession = !!supabaseSessionCookie?.value;
      } catch {
        hasSupabaseSession = false;
      }
    }

    // Allow access if either session is valid
    if (!hasSupabaseSession && !hasAdminSession) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      return NextResponse.redirect(loginUrl);
    }
  }

  // For admin API routes, check admin_session cookie
  if (isApiAdminRoute) {
    if (!hasAdminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
