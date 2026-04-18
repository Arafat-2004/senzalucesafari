"use client";

import { useState, useEffect, useCallback } from "react";

export function useAdminAnalytics() {
    const [stats, setStats] = useState<{
        bookings: { total: number; pending: number; confirmed: number };
        revenue: number;
        inquiries: { total: number; unread: number };
        reviews: { pending: number };
        content: { tours: number; destinations: number };
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/analytics/dashboard");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setStats(data.stats);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, loading, error, refetch: fetchStats };
}

export function useAdminNotifications() {
    const [notifications, setNotifications] = useState<
        Array<{
            id: string;
            type: string;
            title: string;
            message: string;
            isRead: boolean;
            actionUrl?: string;
            createdAt: string;
        }>
    >([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/notifications");
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const markAsRead = async (id: string) => {
        try {
            await fetch(`/api/admin/notifications?id=${id}`, { method: "PATCH" });
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }
    };

    return { notifications, unreadCount, loading, markAsRead };
}

export function useActivityLogs(entityType?: string, entityId?: string) {
    const [logs, setLogs] = useState<
        Array<{
            id: string;
            action: string;
            description: string;
            user: { firstName: string; lastName: string };
            timestamp: string;
        }>
    >([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (entityType) params.set("entityType", entityType);
            if (entityId) params.set("entityId", entityId);
            const res = await fetch(`/api/admin/audit-logs?${params}`);
            if (res.ok) {
                const data = await res.json();
                setLogs(data.logs || []);
            }
        } catch (err) {
            console.error("Failed to fetch logs:", err);
        } finally {
            setLoading(false);
        }
    }, [entityType, entityId]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    return { logs, loading };
}