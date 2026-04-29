import { NextResponse } from "next/server";
import { 
    getDashboardStats, 
    getTopToursByBookings, 
    getRevenueByMonth,
    getConversionStats,
    getBookingTrends,
    getTopDestinations 
} from "@/lib/analytics";
import { getSession, canAccess } from "@/lib/admin-auth";

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!canAccess(session, 50)) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const [stats, topTours, revenueData, conversion, trends, topDestinations] = await Promise.all([
            getDashboardStats(),
            getTopToursByBookings(10),
            getRevenueByMonth(12),
            getConversionStats(),
            getBookingTrends(),
            getTopDestinations(5),
        ]);

        return NextResponse.json({
            stats,
            topTours,
            revenueData,
            conversion,
            trends,
            topDestinations,
        });
    } catch (error) {
        console.error("Advanced analytics error:", error);
        return NextResponse.json(
            { error: "Failed to fetch analytics" },
            { status: 500 }
        );
    }
}