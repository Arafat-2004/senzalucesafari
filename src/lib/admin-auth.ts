import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, generateCsrfToken, hashCsrfToken, checkRateLimit, logSecurityEvent, SecurityEventType } from "@/lib/security";

const COOKIE_NAME = "admin_session";
const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_SECRET_NAME = "csrf_secret";
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours - reduced from 7 days

// Session signing key - derived from environment for HMAC verification
function getSessionSigningKey(): string {
    const configuredKey = process.env.SESSION_SIGNING_SECRET || process.env.NEXTAUTH_SECRET;
    if (configuredKey) return configuredKey;
    if (process.env.NODE_ENV === 'production') {
        throw new Error('SESSION_SIGNING_SECRET must be configured in production');
    }
    return 'senzaluce-local-development-session-key';
}

/**
 * Sign a session value using HMAC-SHA256 to prevent cookie forgery.
 * Format: "value.signature"
 */
async function signSessionValue(userId: string): Promise<string> {
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
    encoder.encode(getSessionSigningKey()),
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

function normalizePermissions(value: unknown): Record<string, string[]> {
    if (Array.isArray(value)) {
        return value.reduce<Record<string, string[]>>((result, permission) => {
            if (typeof permission !== 'string') return result;
            const separator = permission.lastIndexOf('_');
            if (separator <= 0) return result;
            const category = permission.slice(0, separator).toLowerCase();
            const action = permission.slice(separator + 1).toUpperCase();
            result[category] = [...(result[category] ?? []), action];
            return result;
        }, {});
    }
    if (!value || typeof value !== 'object') return {};
    return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([category, actions]) => [
            category.toLowerCase(),
            Array.isArray(actions)
                ? actions.filter((action): action is string => typeof action === 'string').map(action => action.toUpperCase())
                : [],
        ])
    );
}

export type PermissionCategory = "tours" | "destinations" | "bookings" | "reviews" | "inquiries" | "users" | "settings" | "reports" | "analytics";
export type PermissionAction = "VIEW" | "CREATE" | "EDIT" | "DELETE" | "CONFIRM" | "CANCEL" | "APPROVE" | "REPLY" | "EXPORT";

export async function getSession(): Promise<SessionUser | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);

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
                permissions: normalizePermissions(user.role.permissions),
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
    return sessionHasPermission(session, category, action);
}

export function sessionHasPermission(session: SessionUser | null, category: PermissionCategory, action: PermissionAction): boolean {
    if (!session) return false;
    if (session.role.name === 'super_admin') return true;
    return (session.role.permissions[category] || []).includes(action);
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

    const signedValue = await signSessionValue(userId);
    cookieStore.set(COOKIE_NAME, signedValue, {
        httpOnly: true,
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
    const csrfPublic = await generateCsrfToken();
    const csrfSecret = await hashCsrfToken(csrfPublic);
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
    response.cookies.delete(CSRF_SECRET_NAME);
    response.cookies.delete(CSRF_COOKIE_NAME);
}

export async function destroySession(): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.delete(COOKIE_NAME);
    cookieStore.delete(CSRF_SECRET_NAME);
    cookieStore.delete(CSRF_COOKIE_NAME);
}

// Legacy helper for backward compatibility
export async function requireAdmin(category?: PermissionCategory, action?: PermissionAction) {
    const session = await requireSession();
    if (category && action && session.role.name !== 'super_admin') {
        const allowedActions = session.role.permissions[category] ?? [];
        if (!allowedActions.includes(action)) {
            throw new Error('FORBIDDEN: You do not have permission to perform this action');
        }
    }
    return session;
}
