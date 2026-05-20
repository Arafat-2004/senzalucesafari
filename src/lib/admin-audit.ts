import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/reliability/logger";

export type AuditLogInput = {
    userId: string;
    action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "EXPORT" | "BULK_UPDATE" | "STATUS_CHANGE";
    entityType: string;
    entityId: string;
    description?: string;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
};

export async function createAuditLog(input: AuditLogInput) {
    try {
        return await prisma.adminAuditLog.create({
            data: {
                userId: input.userId,
                action: input.action,
                entityType: input.entityType,
                entityId: input.entityId,
                description: input.description || "",
                metadata: input.metadata ? JSON.stringify(input.metadata) : undefined,
                ipAddress: input.ipAddress,
            },
        });
    } catch (error) {
        logger.error("Audit log error", { error: error instanceof Error ? error.message : String(error) });
    }
}

export type NotificationInput = {
    type: "NEW_BOOKING" | "BOOKING_CONFIRMED" | "BOOKING_CANCELLED" | "NEW_INQUIRY" | "INQUIRY_REPLIED" | "NEW_REVIEW" | "REVIEW_APPROVED" | "REVIEW_REJECTED" | "NEW_NEWSLETTER_SIGNUP" | "NEW_FEEDBACK" | "SYSTEM_ALERT" | "USER_ACTION" | "REMINDER";
    title: string;
    message: string;
    targetRole?: string;
    targetUserId?: string;
    actionUrl?: string;
    expiresIn?: number;
};

export async function createNotification(input: NotificationInput) {
    try {
        const expiresAt = input.expiresIn
            ? new Date(Date.now() + input.expiresIn)
            : undefined;

        return await prisma.adminNotification.create({
            data: {
                type: input.type,
                title: input.title,
                message: input.message,
                targetRole: input.targetRole,
                targetUserId: input.targetUserId,
                actionUrl: input.actionUrl,
                expiresAt,
            },
        });
    } catch (error) {
        logger.error("Notification error", { error: error instanceof Error ? error.message : String(error) });
    }
}

export async function markNotificationRead(id: string) {
    return await prisma.adminNotification.update({
        where: { id },
        data: { isRead: true, readAt: new Date() },
    });
}

export async function getUnreadNotifications(userId: string, role: string) {
    return await prisma.adminNotification.findMany({
        where: {
            isRead: false,
            OR: [
                { targetUserId: userId },
                { targetRole: role },
                { targetUserId: null, targetRole: null },
            ],
        },
        orderBy: { createdAt: "desc" },
        take: 20,
    });
}

export async function getUnreadCount(userId: string, role: string) {
    return await prisma.adminNotification.count({
        where: {
            isRead: false,
            OR: [
                { targetUserId: userId },
                { targetRole: role },
                { targetUserId: null, targetRole: null },
            ],
        },
    });
}

export async function getActivityLogs(entityType?: string, entityId?: string, limit = 100) {
    return await prisma.adminAuditLog.findMany({
        where: entityType && entityId
            ? { entityType, entityId }
            : undefined,
        orderBy: { timestamp: "desc" },
        take: limit,
        include: { user: true },
    });
}