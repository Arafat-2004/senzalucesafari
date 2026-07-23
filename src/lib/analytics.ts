import { prisma } from "@/lib/prisma";

type InquiryTypeResult = { inquiryType: string; _count: number };
type BookingGroupResult = {
  tourId: string;
  _count: { id: number };
  _sum: { totalPrice: number | null };
};
type TourDestinationGroupResult = {
  destinationId: string;
  _count: { id: number };
};
type PageViewGroupResult = { device: string; _count: number };

async function groupByInquiryType() {
  const result = await prisma.$queryRaw<
    Array<{ inquiryType: string; _count: bigint }>
  >`
        SELECT "inquiryType", COUNT(*) as _count
        FROM contact_inquiries
        GROUP BY "inquiryType"
    `;
  return result.map((r) => ({
    inquiryType: r.inquiryType,
    _count: Number(r._count),
  })) as InquiryTypeResult[];
}

async function groupByBookingTour(limit: number) {
  const result = await prisma.$queryRaw<
    Array<{ tourId: string; id_count: bigint; totalPrice_sum: number | null }>
  >`
        SELECT "tourId", COUNT(*) as id_count, SUM("totalPrice") as totalPrice_sum
        FROM bookings
        GROUP BY "tourId"
        ORDER BY id_count DESC
        LIMIT ${limit}
    `;
  return result.map((r) => ({
    tourId: r.tourId,
    _count: { id: Number(r.id_count) },
    _sum: { totalPrice: r.totalPrice_sum },
  })) as BookingGroupResult[];
}

async function groupByTourDestination(limit: number) {
  const result = await prisma.$queryRaw<
    Array<{ destinationId: string; id_count: bigint }>
  >`
        SELECT "destinationId", COUNT(*) as id_count
        FROM tour_destinations
        GROUP BY "destinationId"
        ORDER BY id_count DESC
        LIMIT ${limit}
    `;
  return result.map((r) => ({
    destinationId: r.destinationId,
    _count: { id: Number(r.id_count) },
  })) as TourDestinationGroupResult[];
}

async function groupByPageViewDevice() {
  const result = await prisma.$queryRaw<
    Array<{ device: string; _count: bigint }>
  >`
        SELECT device, COUNT(*) as _count
        FROM page_views
        GROUP BY device
    `;
  return result.map((r) => ({
    device: r.device,
    _count: Number(r._count),
  })) as PageViewGroupResult[];
}

export interface DashboardStats {
  counts: {
    tours: number;
    destinations: number;
    accommodations: number;
    vehicles: number;
    blogPosts: number;
    reviews: number;
    bookings: number;
    inquiries: number;
    newsletters: number;
    faqs: number;
    guides: number;
  };
  alerts: {
    pendingBookings: number;
    unreadInquiries: number;
    pendingReviews: number;
  };
  revenue: Record<string, { revenue: number; deposits: number; count: number }>;
  topTours: Array<{ name: string; count: number }>;
  inquiriesByType: Array<{ inquiryType: string; count: number }>;
}

export interface DateRangeFilter {
  startDate?: Date;
  endDate?: Date;
}

export async function getDashboardStatsFast(
  months = 6,
  dateRange?: DateRangeFilter,
): Promise<DashboardStats> {
  const sixMonthsAgo =
    dateRange?.startDate ||
    (() => {
      const d = new Date();
      d.setMonth(d.getMonth() - months);
      return d;
    })();

  const endDate = dateRange?.endDate || new Date();

  const countsResult = await prisma.$transaction([
    prisma.tour.count(),
    prisma.destination.count(),
    prisma.accommodation.count(),
    prisma.vehicle.count(),
    prisma.blogPost.count(),
    prisma.review.count(),
    prisma.booking.count(),
    prisma.contactInquiry.count(),
    prisma.newsletter.count(),
    prisma.fAQ.count(),
    prisma.guide.count(),
  ]);

  const alertsResult = await prisma.$transaction([
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.contactInquiry.count({ where: { isRead: false } }),
    prisma.review.count({ where: { isApproved: false } }),
  ]);

  const bookingsForRevenue = await prisma.booking.findMany({
    where: {
      createdAt: { gte: sixMonthsAgo, lte: endDate },
      status: { not: "CANCELLED" },
    },
    select: { createdAt: true, totalPrice: true, depositPaid: true },
    orderBy: { createdAt: "asc" },
  });

  const topToursResult = await getTopToursByBookings(5);
  const inquiryTypesResult = await groupByInquiryType();

  const [
    tourCount,
    destinationCount,
    accommodationCount,
    vehicleCount,
    blogCount,
    reviewCount,
    bookingCount,
    inquiryCount,
    newsletterCount,
    faqCount,
    guideCount,
  ] = countsResult;

  const [pendingBookings, unreadInquiries, pendingReviews] = alertsResult;

  const revenue: Record<
    string,
    { revenue: number; deposits: number; count: number }
  > = {};
  for (const booking of bookingsForRevenue) {
    const month = booking.createdAt.toISOString().slice(0, 7);
    if (!revenue[month]) {
      revenue[month] = { revenue: 0, deposits: 0, count: 0 };
    }
    revenue[month].revenue += booking.totalPrice;
    revenue[month].deposits += booking.depositPaid;
    revenue[month].count += 1;
  }

  const topTours: { name: string; count: number }[] = topToursResult.map(
    (b: { tour?: { name?: string }; count: number }) => ({
      name: b.tour?.name || "Unknown",
      count: b.count as number,
    }),
  );

  const inquiriesByType: { inquiryType: string; count: number }[] =
    inquiryTypesResult.map((r: { inquiryType: string; _count: number }) => ({
      inquiryType: String(r.inquiryType),
      count: r._count,
    }));

  return {
    counts: {
      tours: tourCount,
      destinations: destinationCount,
      accommodations: accommodationCount,
      vehicles: vehicleCount,
      blogPosts: blogCount,
      reviews: reviewCount,
      bookings: bookingCount,
      inquiries: inquiryCount,
      newsletters: newsletterCount,
      faqs: faqCount,
      guides: guideCount,
    },
    alerts: {
      pendingBookings,
      unreadInquiries,
      pendingReviews,
    },
    revenue,
    topTours,
    inquiriesByType,
  };
}

export async function getBookingsByMonth(
  months = 12,
  dateRange?: DateRangeFilter,
) {
  const startDate =
    dateRange?.startDate ||
    (() => {
      const d = new Date();
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      d.setMonth(d.getMonth() - Math.max(months - 1, 0));
      return d;
    })();
  const endDate = dateRange?.endDate || new Date();

  const bookings = await prisma.booking.findMany({
    where: { createdAt: { gte: startDate, lte: endDate } },
    select: { createdAt: true, totalPrice: true, status: true },
    orderBy: { createdAt: "asc" },
  });

  const monthlyData: Record<string, { revenue: number; count: number }> = {};
  for (const monthKey of getMonthKeys(startDate, endDate)) {
    monthlyData[monthKey] = { revenue: 0, count: 0 };
  }

  for (const booking of bookings) {
    const monthKey = booking.createdAt.toISOString().slice(0, 7);
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { revenue: 0, count: 0 };
    }
    if (booking.status !== "CANCELLED") {
      monthlyData[monthKey].revenue += booking.totalPrice;
    }
    monthlyData[monthKey].count += 1;
  }

  return monthlyData;
}

export async function getRevenueByMonth(
  months = 12,
  dateRange?: DateRangeFilter,
) {
  const startDate =
    dateRange?.startDate ||
    (() => {
      const d = new Date();
      d.setMonth(d.getMonth() - months);
      return d;
    })();
  const endDate = dateRange?.endDate || new Date();

  const bookings = await prisma.booking.findMany({
    where: {
      createdAt: { gte: startDate, lte: endDate },
      paymentStatus: { in: ["FULLY_PAID", "DEPOSIT_PAID"] },
    },
    select: { createdAt: true, totalPrice: true, depositPaid: true },
    orderBy: { createdAt: "asc" },
  });

  const monthlyData: Record<
    string,
    { revenue: number; deposits: number; count: number }
  > = {};

  for (const booking of bookings) {
    const monthKey = booking.createdAt.toISOString().slice(0, 7);
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { revenue: 0, deposits: 0, count: 0 };
    }
    monthlyData[monthKey].revenue += booking.totalPrice;
    monthlyData[monthKey].deposits += booking.depositPaid;
    monthlyData[monthKey].count += 1;
  }

  return monthlyData;
}

export async function getTopToursByBookings(limit = 10) {
  const bookings = await groupByBookingTour(limit);

  const tours = await prisma.tour.findMany({
    where: {
      id: { in: bookings.map((b) => b.tourId).filter(Boolean) as string[] },
    },
    select: { id: true, name: true, slug: true },
  });

  return bookings
    .map((b) => {
      const tour = tours.find((t) => t.id === b.tourId);
      return {
        tour,
        count: b._count.id,
        revenue: b._sum.totalPrice || 0,
      };
    })
    .filter((b) => b.tour);
}

export async function getTopDestinations(limit = 10) {
  const tourDestinations = await groupByTourDestination(limit);

  const destinations = await prisma.destination.findMany({
    where: {
      id: {
        in: tourDestinations
          .map((d) => d.destinationId)
          .filter(Boolean) as string[],
      },
    },
    select: { id: true, name: true, slug: true },
  });

  return tourDestinations
    .map((d) => {
      const destination = destinations.find(
        (dest) => dest.id === d.destinationId,
      );
      return {
        destination,
        count: d._count.id,
      };
    })
    .filter((d) => d.destination);
}

export async function getBookingsByStatus() {
  const statuses = await prisma.$queryRaw<
    Array<{ status: string; count: bigint }>
  >`
        SELECT status, COUNT(*) as count
        FROM bookings
        GROUP BY status
    `;
  return statuses.map((s) => ({
    status: s.status,
    count: Number(s.count),
  }));
}

export async function getRecentBookings(limit = 10, options?: { daysBack?: number }) {
  const where: any = {};
  if (options?.daysBack) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - options.daysBack);
    where.createdAt = { gte: cutoff };
  }
  return prisma.booking.findMany({
    take: limit,
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      bookingRef: true,
      firstName: true,
      lastName: true,
      email: true,
      travelDate: true,
      numberOfTravelers: true,
      totalPrice: true,
      status: true,
      createdAt: true,
      tour: { select: { name: true, slug: true } },
    },
  });
}

export async function getCustomerGrowth(
  months = 12,
  dateRange?: DateRangeFilter,
) {
  const startDate =
    dateRange?.startDate ||
    (() => {
      const d = new Date();
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      d.setMonth(d.getMonth() - Math.max(months - 1, 0));
      return d;
    })();
  const endDate = dateRange?.endDate || new Date();

  const customers = await prisma.booking.groupBy({
    by: ["email"],
    where: { createdAt: { lte: endDate } },
    _min: { createdAt: true },
  });

  const monthlyData: Record<string, number> = {};
  for (const monthKey of getMonthKeys(startDate, endDate)) {
    monthlyData[monthKey] = 0;
  }
  const firstBookingByEmail = new Map<string, Date>();
  for (const customer of customers) {
    const firstBooking = customer._min.createdAt;
    if (!firstBooking) continue;
    const normalizedEmail = customer.email.trim().toLowerCase();
    const recordedFirstBooking = firstBookingByEmail.get(normalizedEmail);
    if (!recordedFirstBooking || firstBooking < recordedFirstBooking) {
      firstBookingByEmail.set(normalizedEmail, firstBooking);
    }
  }

  for (const firstBooking of firstBookingByEmail.values()) {
    if (firstBooking < startDate || firstBooking > endDate) continue;
    const monthKey = firstBooking.toISOString().slice(0, 7);
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
  }

  return monthlyData;
}

function getMonthKeys(startDate: Date, endDate: Date): string[] {
  const cursor = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), 1));
  const lastMonth = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), 1));
  const keys: string[] = [];

  while (cursor <= lastMonth && keys.length < 120) {
    keys.push(cursor.toISOString().slice(0, 7));
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }

  return keys;
}

export async function getRecentInquiries(limit = 5, options?: { daysBack?: number }) {
  const where: any = {};
  if (options?.daysBack) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - options.daysBack);
    where.createdAt = { gte: cutoff };
  }
  return prisma.contactInquiry.findMany({
    take: limit,
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      message: true,
      subject: true,
      isRead: true,
      createdAt: true,
      inquiryType: true,
      tourInterest: true,
      numberOfTravelers: true,
      travelDate: true,
    },
  });
}

export async function getBlogStats() {
  const total = await prisma.blogPost.count()
  const published = await prisma.blogPost.count({ where: { isPublished: true } })
  const drafts = await prisma.blogPost.count({ where: { isPublished: false } })
  return { total, published, drafts }
}

export async function getDestinationStats() {
  const total = await prisma.destination.count()
  const active = await prisma.destination.count({ where: { isActive: true } })
  const hidden = await prisma.destination.count({ where: { isActive: false } })
  return { total, active, hidden }
}

export async function getTourStats() {
  const total = await prisma.tour.count()
  const active = await prisma.tour.count({ where: { isActive: true } })
  const archived = await prisma.tour.count({ where: { isActive: false } })
  return { total, active, archived }
}

export async function getInquiryStats() {
  const total = await prisma.contactInquiry.count()
  const unread = await prisma.contactInquiry.count({ where: { isRead: false } })
  const byType = await groupByInquiryType()
  return { total, unread, byType }
}

export async function getPopularPages(limit = 10) {
  const result = await prisma.$queryRaw<Array<{ path: string; count: bigint }>>`
        SELECT path, COUNT(*)::bigint as count
        FROM page_views
        GROUP BY path
        ORDER BY count DESC
        LIMIT ${limit}
    `;
  return result.map((r) => ({ path: r.path, count: Number(r.count) }));
}

export async function getDeviceStats() {
  return await groupByPageViewDevice();
}

export async function getDashboardStats() {
  const totalBookings = await prisma.booking.count()
  const pendingBookings = await prisma.booking.count({ where: { status: "PENDING" } })
  const confirmedBookings = await prisma.booking.count({ where: { status: "CONFIRMED" } })
  const totalRevenueResult = await prisma.booking.aggregate({
    _sum: { totalPrice: true },
    where: { paymentStatus: "FULLY_PAID" },
  })
  const totalInquiries = await prisma.contactInquiry.count()
  const unreadInquiries = await prisma.contactInquiry.count({ where: { isRead: false } })
  const pendingReviews = await prisma.review.count({ where: { isApproved: false } })
  const totalTours = await prisma.tour.count({ where: { isActive: true } })
  const totalDestinations = await prisma.destination.count({ where: { isActive: true } })

  return {
    bookings: {
      total: totalBookings,
      pending: pendingBookings,
      confirmed: confirmedBookings,
    },
    revenue: totalRevenueResult._sum.totalPrice || 0,
    inquiries: { total: totalInquiries, unread: unreadInquiries },
    reviews: { pending: pendingReviews },
    content: { tours: totalTours, destinations: totalDestinations },
  }
}

export async function getConversionStats() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const inquiries = await prisma.contactInquiry.count({
    where: { createdAt: { gte: thirtyDaysAgo } },
  })
  const bookings = await prisma.booking.count({ where: { createdAt: { gte: thirtyDaysAgo } } })
  const confirmedBookings = await prisma.booking.count({
    where: {
      createdAt: { gte: thirtyDaysAgo },
      status: { in: ["CONFIRMED", "COMPLETED"] },
    },
  })

  const conversionRate =
    inquiries > 0 ? ((confirmedBookings / inquiries) * 100).toFixed(1) : "0"

  return {
    inquiries,
    bookings,
    confirmedBookings,
    conversionRate: parseFloat(conversionRate),
  }
}

export async function getBookingTrends() {
  const now = new Date()
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const last60Days = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  const thisMonth = await prisma.booking.count({ where: { createdAt: { gte: last30Days } } })
  const lastMonth = await prisma.booking.count({
    where: {
      createdAt: { gte: last60Days, lt: last30Days },
    },
  })

  const growth =
    lastMonth > 0
      ? (((thisMonth - lastMonth) / lastMonth) * 100).toFixed(1)
      : "0"

  return {
    thisMonth,
    lastMonth,
    growth: parseFloat(growth),
  }
}

export async function getCurrentMonthRevenue(dateRange?: DateRangeFilter) {
  const startOfMonth =
    dateRange?.startDate ||
    new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const endOfMonth = dateRange?.endDate || new Date();
  const result = await prisma.booking.aggregate({
    _sum: { totalPrice: true },
    where: { createdAt: { gte: startOfMonth, lte: endOfMonth } },
  });
  return result._sum.totalPrice || 0;
}

export async function getRevenueByMonthGrouped(months = 12) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const bookings = await prisma.booking.findMany({
    where: { createdAt: { gte: startDate } },
    select: { createdAt: true, totalPrice: true },
    orderBy: { createdAt: "asc" },
  });

  const monthlyData: Record<string, { revenue: number; count: number }> = {};

  for (const booking of bookings) {
    const monthKey = booking.createdAt.toISOString().slice(0, 7);
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { revenue: 0, count: 0 };
    }
    monthlyData[monthKey].revenue += booking.totalPrice;
    monthlyData[monthKey].count += 1;
  }

  return monthlyData;
}

export async function getKpiTrends() {
  const now = new Date()
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const bookingsThisMonth = await prisma.booking.count({
    where: { createdAt: { gte: startOfCurrentMonth } },
  })
  const bookingsLastMonth = await prisma.booking.count({
    where: { createdAt: { gte: startOfLastMonth, lt: startOfCurrentMonth } },
  })
  const revenueThisMonth = await prisma.booking.aggregate({
    _sum: { totalPrice: true },
    where: { createdAt: { gte: startOfCurrentMonth } },
  })
  const revenueLastMonth = await prisma.booking.aggregate({
    _sum: { totalPrice: true },
    where: { createdAt: { gte: startOfLastMonth, lt: startOfCurrentMonth } },
  })
  const customersThisMonth = await prisma.booking.count({
    where: { createdAt: { gte: startOfCurrentMonth } },
  })
  const customersLastMonth = await prisma.booking.count({
    where: { createdAt: { gte: startOfLastMonth, lt: startOfCurrentMonth } },
  })
  const inquiriesThisMonth = await prisma.contactInquiry.count({
    where: { createdAt: { gte: startOfCurrentMonth } },
  })
  const inquiriesLastMonth = await prisma.contactInquiry.count({
    where: { createdAt: { gte: startOfLastMonth, lt: startOfCurrentMonth } },
  })
  const blogThisMonth = await prisma.blogPost.count({
    where: { createdAt: { gte: startOfCurrentMonth } },
  })
  const blogLastMonth = await prisma.blogPost.count({
    where: { createdAt: { gte: startOfLastMonth, lt: startOfCurrentMonth } },
  })

  function calcTrend(
    thisVal: number,
    lastVal: number,
  ): { value: number | string; direction: "up" | "down" | "neutral" } {
    if (lastVal === 0) {
      return thisVal > 0
        ? { value: "New", direction: "up" }
        : { value: 0, direction: "neutral" }
    }
    const pct = ((thisVal - lastVal) / lastVal) * 100
    const rounded = Math.round(pct * 10) / 10
    return {
      value: rounded,
      direction: rounded > 0 ? "up" : rounded < 0 ? "down" : "neutral",
    }
  }

  return {
    bookings: calcTrend(bookingsThisMonth, bookingsLastMonth),
    revenue: calcTrend(
      revenueThisMonth._sum.totalPrice || 0,
      revenueLastMonth._sum.totalPrice || 0,
    ),
    customers: calcTrend(customersThisMonth, customersLastMonth),
    inquiries: calcTrend(inquiriesThisMonth, inquiriesLastMonth),
    blog: calcTrend(blogThisMonth, blogLastMonth),
  }
}

export async function runDataRetentionCleanup() {
  try {
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    const twoYearsAgo = new Date(Date.now() - 730 * 24 * 60 * 60 * 1000);

    // 1. Delete read notifications older than 90 days
    await prisma.adminNotification.deleteMany({
      where: { isRead: true, createdAt: { lt: ninetyDaysAgo } }
    });

    // 2. Delete all notifications older than 1 year
    await prisma.adminNotification.deleteMany({
      where: { createdAt: { lt: oneYearAgo } }
    });

    // 3. Delete audit logs older than 1 year
    await prisma.adminAuditLog.deleteMany({
      where: { timestamp: { lt: oneYearAgo } }
    });

    // 4. Hard-delete read + replied inquiries older than 2 years
    await prisma.contactInquiry.deleteMany({
      where: {
        isRead: true,
        isReplied: true,
        createdAt: { lt: twoYearsAgo }
      }
    });
  } catch (error) {
    console.error("Data retention cleanup failed:", error);
  }
}
