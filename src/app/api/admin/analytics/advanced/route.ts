import { NextResponse } from "next/server";
import { 
    getDashboardStats, 
    getTopToursByBookings, 
    getRevenueByMonth,
    getConversionStats,
    getBookingTrends,
    getTopDestinations 
} from "@/lib/analytics";
import { getSession, sessionHasPermission } from "@/lib/admin-auth";
import { logger } from "@/lib/reliability/logger";

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!sessionHasPermission(session, 'analytics', 'VIEW')) {
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
        logger.error("Advanced analytics error", { error: error instanceof Error ? error.message : String(error) });
        return NextResponse.json(
            { error: "Failed to fetch analytics" },
            { status: 500 }
        );
    }
}
