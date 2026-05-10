import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, generateCsrfToken, checkRateLimit, logSecurityEvent, SecurityEventType } from "@/lib/security";

const COOKIE_NAME = "admin_session";
const BACKUP_COOKIE_NAME = "admin_session_backup";
const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_SECRET_NAME = "csrf_secret";
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours - reduced from 7 days

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
        const userId = sessionCookie.value;
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
    const csrfSecret = await generateCsrfToken();
    const csrfPublic = await generateCsrfToken();

    // Next.js 16 Server Actions do not reliably forward httpOnly cookies.
    // The backup cookie (non-httpOnly) exists solely to allow Server Actions
    // to read the session. This is a known framework limitation.
    // Remove when Next.js fixes the bug.
    cookieStore.set(COOKIE_NAME, userId, {
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
    cookieStore.set(BACKUP_COOKIE_NAME, userId, {
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
    
    cookieStore.set(CSRF_COOKIE_NAME, csrfPublic, {
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
export function setSessionOnResponse(response: NextResponse, userId: string): void {
    const csrfSecret = crypto.randomUUID().replace(/-/g, '');
    const csrfPublic = crypto.randomUUID().replace(/-/g, '');
    const isProduction = process.env.NODE_ENV === "production";

    // Primary httpOnly session cookie
    response.cookies.set(COOKIE_NAME, userId, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: SESSION_MAX_AGE,
        path: "/",
    });

    // Backup non-httpOnly cookie for Server Actions (Next.js 16 bug workaround)
    response.cookies.set(BACKUP_COOKIE_NAME, userId, {
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