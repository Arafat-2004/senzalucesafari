import { NextResponse } from "next/server";
import { getDashboardStats, getTopToursByBookings, getTopDestinations, getInquiryStats } from "@/lib/analytics";
import { getSession, canAccess } from "@/lib/admin-auth";
import { withApiResilience } from "@/lib/reliability/api-resilience";

export const GET = withApiResilience(async () => {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!canAccess(session, 50)) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }
    
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
}, { route: '/api/admin/analytics/dashboard', method: 'GET', requireAuth: true, slowThresholdMs: 800 });