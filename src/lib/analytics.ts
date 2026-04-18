import { prisma } from "@/lib/prisma";

export interface DateRange {
    from: Date;
    to: Date;
}

export async function getDashboardStats() {
    const [
        totalBookings,
        pendingBookings,
        confirmedBookings,
        totalRevenue,
        totalInquiries,
        unreadInquiries,
        pendingReviews,
        totalTours,
        totalDestinations,
    ] = await Promise.all([
        prisma.booking.count(),
        prisma.booking.count({ where: { status: "PENDING" } }),
        prisma.booking.count({ where: { status: "CONFIRMED" } }),
        prisma.booking.aggregate({
            _sum: { totalPrice: true },
            where: { paymentStatus: "FULLY_PAID" },
        }),
        prisma.contactInquiry.count(),
        prisma.contactInquiry.count({ where: { isRead: false } }),
        prisma.review.count({ where: { isApproved: false } }),
        prisma.tour.count({ where: { isActive: true } }),
        prisma.destination.count({ where: { isActive: true } }),
    ]);

    return {
        bookings: { total: totalBookings, pending: pendingBookings, confirmed: confirmedBookings },
        revenue: totalRevenue._sum.totalPrice || 0,
        inquiries: { total: totalInquiries, unread: unreadInquiries },
        reviews: { pending: pendingReviews },
        content: { tours: totalTours, destinations: totalDestinations },
    };
}

export async function getBookingsByMonth(months = 12) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const bookings = await prisma.booking.findMany({
        where: {
            createdAt: { gte: startDate },
        },
        select: {
            createdAt: true,
            totalPrice: true,
            status: true,
            tour: { select: { name: true } },
        },
        orderBy: { createdAt: "asc" },
    });

    const monthlyData: Record<string, { revenue: number; count: number; tours: Record<string, number> }> = {};

    for (const booking of bookings) {
        const monthKey = booking.createdAt.toISOString().slice(0, 7);
        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { revenue: 0, count: 0, tours: {} };
        }
        monthlyData[monthKey].revenue += booking.totalPrice;
        monthlyData[monthKey].count += 1;
    }

    return monthlyData;
}

export async function getTopToursByBookings(limit = 10) {
    const bookings = await prisma.booking.groupBy({
        by: ["tourId"],
        _count: { id: true },
        _sum: { totalPrice: true },
        orderBy: { _count: { id: "desc" } },
        take: limit,
    });

    const tourIds = bookings.map((b) => b.tourId);
    const tours = await prisma.tour.findMany({
        where: { id: { in: tourIds } },
        select: { id: true, name: true, category: true },
    });

    const tourMap = new Map(tours.map((t) => [t.id, t]));

    return bookings.map((b) => ({
        count: b._count.id,
        revenue: b._sum.totalPrice || 0,
        tour: tourMap.get(b.tourId),
    }));
}

export async function getTopDestinations(limit = 10) {
    const tourDestinations = await prisma.tourDestination.groupBy({
        by: ["destinationId"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: limit,
    });

    const destIds = tourDestinations.map((td) => td.destinationId);
    const destinations = await prisma.destination.findMany({
        where: { id: { in: destIds } },
        select: { id: true, name: true, region: true },
    });

    const destMap = new Map(destinations.map((d) => [d.id, d]));

    return tourDestinations.map((td) => ({
        tourCount: td._count.id,
        destination: destMap.get(td.destinationId),
    }));
}

export async function getInquiryStats() {
    const [total, unread, byType] = await Promise.all([
        prisma.contactInquiry.count(),
        prisma.contactInquiry.count({ where: { isRead: false } }),
        prisma.contactInquiry.groupBy({
            by: ["inquiryType"],
            _count: true,
        }),
    ]);

    return { total, unread, byType };
}

export async function getPopularPages(limit = 10) {
    const result = await prisma.$queryRaw`
        SELECT path, COUNT(*) as count
        FROM page_views
        GROUP BY path
        ORDER BY count DESC
        LIMIT ${limit}
    `;
    return result as Array<{ path: string; count: bigint }>;
}

export async function getDeviceStats() {
    return await prisma.pageView.groupBy({
        by: ["device"],
        _count: true,
    });
}