import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "admin_session";
const SALT = process.env.AUTH_SALT || "default-salt-change-in-production";

export interface SessionUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: {
        name: string;
        displayName: string;
        permissions: Record<string, string[]>;
        level: number;
    };
}

export type PermissionCategory = "tours" | "destinations" | "bookings" | "reviews" | "inquiries" | "users" | "settings" | "reports" | "analytics";
export type PermissionAction = "VIEW" | "CREATE" | "EDIT" | "DELETE" | "CONFIRM" | "CANCEL" | "APPROVE" | "REPLY" | "EXPORT";

// Simple hash function for demo - use bcrypt in production
function simpleHash(str: string): string {
    const crypto = require("crypto");
    return crypto.createHmac("sha256", SALT).update(str).digest("hex");
}

export async function getSession(): Promise<SessionUser | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);

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
        redirect("/admin/login");
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

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    const user = await prisma.adminUser.findUnique({
        where: { email: email.toLowerCase() },
        include: { role: true },
    });

    if (!user) {
        return { success: false, error: "Invalid credentials" };
    }

    if (!user.isActive) {
        return { success: false, error: "Account is disabled" };
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
        return { success: false, error: "Account is locked" };
    }

    // Password verification - compare hashed input with stored hash
    const hashedInput = simpleHash(password);
    const validPassword = hashedInput === user.passwordHash;

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

    return { success: true };
}

export async function setSession(userId: string): Promise<void> {
    const cookieStore = await cookies();
    
    cookieStore.set(COOKIE_NAME, userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
    });
}

export async function destroySession(): Promise<void> {
    const cookieStore = await cookies();
    
    cookieStore.delete(COOKIE_NAME);
}

// Legacy helper for backward compatibility
export async function requireAdmin() {
    return await requireSession();
}