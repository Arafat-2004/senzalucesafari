import { NextResponse } from "next/server";
import { getDashboardStats, getBookingsByMonth, getTopToursByBookings, getInquiryStats, getDeviceStats } from "@/lib/analytics";

export async function GET() {
    try {
        const [stats, monthlyBookings, topTours, inquiryStats, deviceStats] = await Promise.all([
            getDashboardStats(),
            getBookingsByMonth(6),
            getTopToursByBookings(5),
            getInquiryStats(),
            getDeviceStats(),
        ]);

        // Format monthly data for charts
        const revenueData = Object.entries(monthlyBookings).map(([month, data]: [string, any]) => ({
            name: month,
            value: data.revenue || 0,
            bookings: data.count || 0,
        }));

        // Top tours data
        const toursData = topTours.map((t: any) => ({
            name: t.tour?.name || "Unknown",
            value: t.count || 0,
        }));

        // Device stats
        const deviceData = deviceStats.map((d: any) => ({
            name: d.device || "Unknown",
            value: d._count || 0,
        }));

        // Inquiry types
        const inquiryData = inquiryStats.byType.map((i: any) => ({
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
        console.error("Dashboard charts error:", error);
        return NextResponse.json(
            { error: "Failed to fetch chart data" },
            { status: 500 }
        );
    }
}