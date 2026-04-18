import { NextResponse } from "next/server";
import { getDashboardStats, getTopToursByBookings, getTopDestinations, getInquiryStats } from "@/lib/analytics";

export async function GET() {
    try {
        const [stats, topTours, topDestinations, inquiryStats] = await Promise.all([
            getDashboardStats(),
            getTopToursByBookings(5),
            getTopDestinations(5),
            getInquiryStats(),
        ]);

        return NextResponse.json({
            stats,
            topTours,
            topDestinations,
            inquiryStats,
        });
    } catch (error) {
        console.error("Dashboard analytics error:", error);
        return NextResponse.json(
            { error: "Failed to fetch dashboard stats" },
            { status: 500 }
        );
    }
}