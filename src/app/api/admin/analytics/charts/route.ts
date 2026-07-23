import { NextResponse } from "next/server";
import {
  getDashboardStats,
  getBookingsByMonth,
  getTopToursByBookings,
  getInquiryStats,
  getDeviceStats,
} from "@/lib/analytics";
import { getSession, sessionHasPermission } from "@/lib/admin-auth";
import { logger } from "@/lib/reliability/logger";

interface MonthlyData {
  revenue: number;
  count: number;
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!sessionHasPermission(session, 'analytics', 'VIEW')) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    const [stats, monthlyBookings, topTours, inquiryStats, deviceStats] =
      await Promise.all([
        getDashboardStats(),
        getBookingsByMonth(6),
        getTopToursByBookings(5),
        getInquiryStats(),
        getDeviceStats(),
      ]);

    // Format monthly data for charts
    const revenueData = Object.entries(monthlyBookings).map(
      ([month, data]) => ({
        name: month,
        value: (data as MonthlyData).revenue || 0,
        bookings: (data as MonthlyData).count || 0,
      }),
    );

    // Top tours data
    const toursData = topTours.map(
      (t: { tour?: { name?: string }; count: number }) => ({
        name: t.tour?.name || "Unknown",
        value: t.count || 0,
      }),
    );

    // Device stats
    const deviceData = (
      deviceStats as Array<{ device: string; _count: number }>
    ).map((d) => ({
      name: d.device || "Unknown",
      value: d._count || 0,
    }));

    // Inquiry types
    const inquiryData = (
      inquiryStats.byType as Array<{ inquiryType: string; _count: number }>
    ).map((i) => ({
      name: i.inquiryType || "Unknown",
      value: i._count || 0,
    }));

    return NextResponse.json({
      stats,
      revenueData,
      toursData,
      deviceData,
      inquiryData,
    });
  } catch (error) {
    logger.error("Dashboard charts error", { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      { error: "Failed to fetch chart data" },
      { status: 500 },
    );
  }
}
