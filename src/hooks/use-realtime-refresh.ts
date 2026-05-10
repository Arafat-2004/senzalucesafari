"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useRouter } from "next/navigation";

interface RealtimeStats {
  pendingBookings: number;
  unreadInquiries: number;
  pendingReviews: number;
  totalBookings: number;
  totalInquiries: number;
  lastUpdate: string;
}

export function useRealtimeRefresh(intervalMs = 30000) {
  const router = useRouter();
  const [stats, setStats] = useState<RealtimeStats | null>(null);
  const [hasNewData, setHasNewData] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastStatsRef = useRef<RealtimeStats | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/realtime-stats", {
        cache: "no-store",
      });
      if (!response.ok) return;
      const data = await response.json();
      if (data.success) {
        const newStats = data.stats as RealtimeStats;
        if (lastStatsRef.current) {
          const prev = lastStatsRef.current;
          if (
            newStats.pendingBookings !== prev.pendingBookings ||
            newStats.unreadInquiries !== prev.unreadInquiries ||
            newStats.pendingReviews !== prev.pendingReviews ||
            newStats.totalBookings !== prev.totalBookings ||
            newStats.totalInquiries !== prev.totalInquiries
          ) {
            setHasNewData(true);
            router.refresh();
            setTimeout(() => setHasNewData(false), 3000);
          }
        }
        lastStatsRef.current = newStats;
        setStats(newStats);
      }
    } catch {
      // Silently fail - polling should not break the UI
    }
  }, [router]);

  useEffect(() => {
    fetchStats();
    intervalRef.current = setInterval(fetchStats, intervalMs);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchStats, intervalMs]);

  return { stats, hasNewData, refresh: fetchStats };
}
