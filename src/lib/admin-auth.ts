import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, generateCsrfToken, hashCsrfToken, checkRateLimit, logSecurityEvent, SecurityEventType } from "@/lib/security";

const COOKIE_NAME = "admin_session";
const BACKUP_COOKIE_NAME = "admin_session_backup";
const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_SECRET_NAME = "csrf_secret";
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours - reduced from 7 days

// Session signing key - derived from environment for HMAC verification
const SESSION_SIGNING_KEY = process.env.SESSION_SIGNING_SECRET || process.env.NEXTAUTH_SECRET || 'dev-fallback-change-in-production';

/**
 * Sign a session value using HMAC-SHA256 to prevent cookie forgery.
 * Format: "value.signature"
 */
async function signSessionValue(userId: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(SESSION_SIGNING_KEY),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(userId));
  const sigHex = Array.from(new Uint8Array(signature), b => b.toString(16).padStart(2, '0')).join('');
  return `${userId}.${sigHex}`;
}

/**
 * Verify and extract the userId from a signed session value.
 * Returns null if the signature is invalid.
 */
async function verifySessionValue(signed: string): Promise<string | null> {
  const dotIndex = signed.lastIndexOf('.');
  if (dotIndex === -1) return null;

  const userId = signed.substring(0, dotIndex);
  const providedSig = signed.substring(dotIndex + 1);

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(SESSION_SIGNING_KEY),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const expectedSig = await crypto.subtle.sign('HMAC', key, encoder.encode(userId));
  const expectedHex = Array.from(new Uint8Array(expectedSig), b => b.toString(16).padStart(2, '0')).join('');

  // Timing-safe comparison
  if (providedSig.length !== expectedHex.length) return null;
  let result = 0;
  for (let i = 0; i < providedSig.length; i++) {
    result |= providedSig.charCodeAt(i) ^ expectedHex.charCodeAt(i);
  }
  return result === 0 ? userId : null;
}

export interface SessionUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    mfaEnabled: boolean;
    mfaVerified: boolean;
    role: {
        name: string;
        displayName: string;
        permissions: Record<string, string[]>;
        level: number;
    };
}

export type PermissionCategory = "tours" | "destinations" | "bookings" | "reviews" | "inquiries" | "users" | "settings" | "reports" | "analytics";
export type PermissionAction = "VIEW" | "CREATE" | "EDIT" | "DELETE" | "CONFIRM" | "CANCEL" | "APPROVE" | "REPLY" | "EXPORT";

export async function getSession(): Promise<SessionUser | null> {
    const cookieStore = await cookies();
    let sessionCookie = cookieStore.get(COOKIE_NAME);

    // Also check backup cookie (non-httpOnly) for Server Actions
    if (!sessionCookie?.value) {
        sessionCookie = cookieStore.get(BACKUP_COOKIE_NAME);
    }

    if (!sessionCookie?.value) {
        return null;
    }

    try {
        const signedValue = sessionCookie.value;
        const userId = await verifySessionValue(signedValue);

        if (!userId) {
            return null;
        }

        const user = await prisma.adminUser.findUnique({
            where: { id: userId },
            include: {
                role: true,
            },
        });

        if (!user || !user.isActive) {
            return null;
        }

        if (user.lockedUntil && user.lockedUntil > new Date()) {
            return null;
        }

        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            mfaEnabled: user.mfaEnabled,
            mfaVerified: false,
            role: {
                name: user.role.name,
                displayName: user.role.displayName,
                permissions: user.role.permissions as Record<string, string[]>,
                level: user.role.level,
            },
        };
    } catch {
        return null;
    }
}

export async function requireSession(): Promise<SessionUser> {
    const session = await getSession();

    if (!session) {
        // Instead of redirect() which throws NEXT_REDIRECT (problematic in Server Actions),
        // throw a regular error that can be caught and handled properly
        throw new Error("UNAUTHORIZED: Please log in to continue");
    }

    return session;
}

export async function hasPermission(category: PermissionCategory, action: PermissionAction): Promise<boolean> {
    const session = await getSession();

    if (!session) {
        return false;
    }

    if (session.role.name === "super_admin") {
        return true;
    }

    const allowedActions = session.role.permissions[category] || [];
    return allowedActions.includes(action);
}

export async function requirePermission(category: PermissionCategory, action: PermissionAction): Promise<void> {
    const hasAccess = await hasPermission(category, action);

    if (!hasAccess) {
        throw new Error("Unauthorized");
    }
}

export function canAccess(session: SessionUser | null, requiredLevel: number): boolean {
    if (!session) {
        return false;
    }

    if (session.role.level >= 100) {
        return true;
    }

    return session.role.level >= requiredLevel;
}

export async function login(email: string, password: string, ip?: string): Promise<{ success: boolean; error?: string }> {
    const clientIp = ip || 'unknown';
    
    const rateLimit = await checkRateLimit(clientIp, 'auth');
    if (!rateLimit.allowed) {
        logSecurityEvent({
            type: SecurityEventType.RATE_LIMIT_EXCEEDED,
            message: `Rate limit exceeded for ${email}`,
            email,
            ip: clientIp,
            metadata: { retryAfter: rateLimit.retryAfter },
        });
        return { success: false, error: "Too many attempts. Please wait before trying again." };
    }

    const user = await prisma.adminUser.findUnique({
        where: { email: email.toLowerCase() },
        include: { role: true },
    });

    if (!user) {
        logSecurityEvent({
            type: SecurityEventType.LOGIN_FAILED,
            message: `Login attempt for non-existent user`,
            email,
            ip: clientIp,
            metadata: { reason: 'User not found' },
        });
        return { success: false, error: "Invalid credentials" };
    }

    if (!user.isActive) {
        logSecurityEvent({
            type: SecurityEventType.LOGIN_FAILED,
            message: `Login attempt for disabled account`,
            email,
            ip: clientIp,
            metadata: { reason: 'Account disabled', userId: user.id },
        });
        return { success: false, error: "Account is disabled" };
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
        logSecurityEvent({
            type: SecurityEventType.LOGIN_LOCKED,
            message: `Login attempt for locked account`,
            email,
            ip: clientIp,
            metadata: { reason: 'Account locked', lockedUntil: user.lockedUntil },
        });
        return { success: false, error: "Account is locked" };
    }

    const validPassword = await verifyPassword(password, user.passwordHash);

    if (!validPassword) {
        const newAttempts = user.failedAttempts + 1;
        const locked = newAttempts >= 5;

        await prisma.adminUser.update({
            where: { id: user.id },
            data: {
                failedAttempts: newAttempts,
                lockedUntil: locked ? new Date(Date.now() + 30 * 60 * 1000) : null,
            },
        });

        logSecurityEvent({
            type: SecurityEventType.LOGIN_FAILED,
            message: `Failed password attempt`,
            email,
            ip: clientIp,
            metadata: { attempts: newAttempts, locked },
        });

        return { success: false, error: locked ? "Account locked" : "Invalid credentials" };
    }

    await prisma.adminUser.update({
        where: { id: user.id },
        data: {
            failedAttempts: 0,
            lockedUntil: null,
            lastLoginAt: new Date(),
        },
    });

    logSecurityEvent({
        type: SecurityEventType.LOGIN_SUCCESS,
        message: `Successful login`,
        userId: user.id,
        email,
        ip: clientIp,
    });

    return { success: true };
}

export async function setSession(userId: string): Promise<void> {
    const cookieStore = await cookies();
    const csrfToken = await generateCsrfToken();
    const csrfSecret = await hashCsrfToken(csrfToken);

    // Next.js 16 Server Actions do not reliably forward httpOnly cookies.
    // The backup cookie (non-httpOnly) exists solely to allow Server Actions
    // to read the session. This is a known framework limitation.
    // Remove when Next.js fixes the bug.
    const signedValue = await signSessionValue(userId);
    cookieStore.set(COOKIE_NAME, signedValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_MAX_AGE,
        path: "/",
    });

    // Next.js 16 Server Actions do not reliably forward httpOnly cookies.
    // The backup cookie (non-httpOnly) exists solely to allow Server Actions
    // to read the session. This is a known framework limitation.
    // Remove when Next.js fixes the bug.
    cookieStore.set(BACKUP_COOKIE_NAME, signedValue, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_MAX_AGE,
        path: "/",
    });
    
    cookieStore.set(CSRF_SECRET_NAME, csrfSecret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: SESSION_MAX_AGE,
        path: "/",
    });
    
    cookieStore.set(CSRF_COOKIE_NAME, csrfToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: SESSION_MAX_AGE,
        path: "/",
    });
}

/**
 * Set session cookies directly on a NextResponse object.
 * Use this in Route Handlers instead of setSession() for reliable cookie delivery.
 */
export async function setSessionOnResponse(response: NextResponse, userId: string): Promise<void> {
    const csrfSecret = crypto.randomUUID().replace(/-/g, '');
    const csrfPublic = crypto.randomUUID().replace(/-/g, '');
    const isProduction = process.env.NODE_ENV === "production";

    // Sign session value using HMAC to prevent cookie forgery
    const signedValue = await signSessionValue(userId);

    // Primary httpOnly session cookie
    response.cookies.set(COOKIE_NAME, signedValue, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: SESSION_MAX_AGE,
        path: "/",
    });

    // Backup non-httpOnly cookie for Server Actions (Next.js 16 bug workaround)
    response.cookies.set(BACKUP_COOKIE_NAME, signedValue, {
        httpOnly: false,
        secure: isProduction,
        sameSite: "lax",
        maxAge: SESSION_MAX_AGE,
        path: "/",
    });

    // CSRF cookies
    response.cookies.set(CSRF_SECRET_NAME, csrfSecret, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        maxAge: SESSION_MAX_AGE,
        path: "/",
    });

    response.cookies.set(CSRF_COOKIE_NAME, csrfPublic, {
        httpOnly: false,
        secure: isProduction,
        sameSite: "strict",
        maxAge: SESSION_MAX_AGE,
        path: "/",
    });
}

/**
 * Clear session cookies on a NextResponse object.
 * Use this in Route Handlers instead of destroySession() for reliable cookie removal.
 */
export function clearSessionOnResponse(response: NextResponse): void {
    response.cookies.delete(COOKIE_NAME);
    response.cookies.delete(BACKUP_COOKIE_NAME);
    response.cookies.delete(CSRF_SECRET_NAME);
    response.cookies.delete(CSRF_COOKIE_NAME);
}

export async function destroySession(): Promise<void> {
    const cookieStore = await cookies();

    // Next.js 16 Server Actions do not reliably forward httpOnly cookies.
    // The backup cookie (non-httpOnly) exists solely to allow Server Actions
    // to read the session. This is a known framework limitation.
    // Remove when Next.js fixes the bug.
    cookieStore.delete(COOKIE_NAME);
    cookieStore.delete(BACKUP_COOKIE_NAME);
    cookieStore.delete(CSRF_SECRET_NAME);
    cookieStore.delete(CSRF_COOKIE_NAME);
}

// Legacy helper for backward compatibility
export async function requireAdmin() {
    return await requireSession();
}