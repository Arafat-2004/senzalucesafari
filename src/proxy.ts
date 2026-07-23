import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const PUBLIC_ROUTES = ['/admin/login', '/admin/reset-password', '/admin/mfa']
const SESSION_BYPASS_ROUTES = ['/api/admin/session', '/api/admin/auth-check', '/api/admin/session-check', '/api/admin/login', '/api/admin/reset-password', '/api/admin/request-reset']

function getSessionSigningKey(): string {
  const configuredKey = process.env.SESSION_SIGNING_SECRET || process.env.NEXTAUTH_SECRET;
  if (configuredKey) return configuredKey;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SIGNING_SECRET must be configured in production');
  }
  return 'senzaluce-local-development-session-key';
}

async function verifySessionValue(signed: string): Promise<string | null> {
  const dotIndex = signed.lastIndexOf('.');
  if (dotIndex === -1) return null;

  const userId = signed.substring(0, dotIndex);
  const providedSig = signed.substring(dotIndex + 1);

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(getSessionSigningKey()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(userId));
  const sigHex = Array.from(new Uint8Array(signature), b => b.toString(16).padStart(2, '0')).join('');

  if (providedSig.length !== sigHex.length) return null;
  let result = 0;
  for (let i = 0; i < providedSig.length; i++) {
    result |= providedSig.charCodeAt(i) ^ sigHex.charCodeAt(i);
  }
  return result === 0 ? userId : null;
}

export async function proxy(request: NextRequest) {
  // First, refresh the Supabase session (required for Supabase SSR)
  const response = await updateSession(request);

  const pathname = request.nextUrl.pathname;

  const publicRoute = PUBLIC_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));
  if (publicRoute) {
    return response;
  }

  // Get session cookie value
  const sessionCookie = request.cookies.get('admin_session');
  let hasValidSession = false;

  if (sessionCookie?.value) {
    try {
      const verifiedUserId = await verifySessionValue(sessionCookie.value);
      if (verifiedUserId) {
        hasValidSession = true;
      }
    } catch {
      hasValidSession = false;
    }
  }

  const isAdminPage = pathname.startsWith('/admin') && !pathname.startsWith('/api/');
  const isAdminApi = pathname.startsWith('/api/admin');

  if (isAdminPage && !hasValidSession) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set('redirectedFrom', pathname);
    const redirectResponse = NextResponse.redirect(url);
    // Clear invalid cookies
    redirectResponse.cookies.delete('admin_session');
    return redirectResponse;
  }

  if (isAdminPage && hasValidSession && pathname === '/admin/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  if (isAdminApi) {
    const isBypass = SESSION_BYPASS_ROUTES.some(r => pathname === r);
    if (!isBypass && !hasValidSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
}
