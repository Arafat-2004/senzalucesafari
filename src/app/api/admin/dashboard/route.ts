import { NextResponse } from 'next/server'
import { getSession } from '@/lib/admin-auth'
import {
  getDashboardStatsFast,
  getKpiTrends,
  getBookingsByStatus,
  getRecentBookings,
  getRecentInquiries,
  getBlogStats,
  getDestinationStats,
  getTourStats,
  getCustomerGrowth,
  getBookingsByMonth,
} from '@/lib/analytics'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/reliability/logger'

export const dynamic = 'force-dynamic'

let cachedDashboardData: { data: any; timestamp: number } | null = null;

function createEmptyDashboardPayload() {
  const neutralTrend = { value: 0, direction: 'neutral' as const }

  return {
    kpi: {
      bookings: { value: 0, trend: neutralTrend },
      revenue: { value: 0, trend: neutralTrend },
      pendingReviews: { value: 0 },
      unreadInquiries: { value: 0 },
      activeTours: { value: 0 },
      customers: { value: 0, trend: neutralTrend },
    },
    revenueData: [],
    bookingStatusData: [],
    topToursData: [],
    customerGrowthData: [],
    inquiriesByTypeData: [],
    contentSummary: {
      blog: { total: 0, published: 0, drafts: 0 },
      destinations: { total: 0, active: 0, hidden: 0 },
      packages: { total: 0, active: 0, archived: 0 },
    },
    recentBookings: [],
    recentInquiries: [],
    unreadNotifications: 0,
  }
}

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let stats: any = { counts: { bookings: 0, tours: 0 }, alerts: { pendingReviews: 0, unreadInquiries: 0 }, revenue: {}, topTours: [], inquiriesByType: [] };
    let trends: any = { bookings: { value: 0, direction: 'neutral' }, revenue: { value: 0, direction: 'neutral' }, customers: { value: 0, direction: 'neutral' } };
    let bookingStatuses: any[] = [];
    let recentBookings: any[] = [];
    let recentInquiries: any[] = [];
    let blogStats: any = { total: 0, published: 0, drafts: 0 };
    let destStats: any = { total: 0, active: 0 };
    let tourStats: any = { total: 0, active: 0 };
    let monthlyCustomerGrowth: Record<string, number> = {};
    let monthlyBookings: Record<string, { revenue: number; count: number }> = {};
    let unreadCount = 0;
    let totalCustomersCount = 0;
    let isDbOnline = true;

    try {
      const [
        statsRes,
        trendsRes,
        bookingStatusesRes,
        recentBookingsRes,
        recentInquiriesRes,
        blogStatsRes,
        destStatsRes,
        tourStatsRes,
        monthlyCustomerGrowthRes,
        monthlyBookingsRes,
        unreadCountRes,
        bookingEmails,
        inquiryEmails,
      ] = await Promise.all([
        getDashboardStatsFast(12),
        getKpiTrends(),
        getBookingsByStatus(),
        getRecentBookings(10, { daysBack: 7 }),
        getRecentInquiries(10, { daysBack: 7 }),
        getBlogStats(),
        getDestinationStats(),
        getTourStats(),
        getCustomerGrowth(6),
        getBookingsByMonth(6),
        prisma.adminNotification.count({ where: { isRead: false } }),
        prisma.booking.findMany({ select: { email: true }, distinct: ['email'] }),
        prisma.contactInquiry.findMany({ select: { email: true }, distinct: ['email'] }),
      ])

      stats = statsRes;
      trends = trendsRes;
      bookingStatuses = bookingStatusesRes;
      recentBookings = recentBookingsRes;
      recentInquiries = recentInquiriesRes;
      blogStats = blogStatsRes;
      destStats = destStatsRes;
      tourStats = tourStatsRes;
      monthlyCustomerGrowth = monthlyCustomerGrowthRes;
      monthlyBookings = monthlyBookingsRes;
      unreadCount = unreadCountRes;

      const uniqueEmails = new Set([
        ...bookingEmails.map(b => b.email.toLowerCase()),
        ...inquiryEmails.map(i => i.email.toLowerCase())
      ])
      totalCustomersCount = uniqueEmails.size;
    } catch (dbError) {
      isDbOnline = false;
      logger.error('Dashboard DB queries failed. Using offline fallback payload.', { error: dbError instanceof Error ? dbError.message : String(dbError) });
    }

    if (!isDbOnline) {
      if (cachedDashboardData) {
        return NextResponse.json({
          ...cachedDashboardData.data,
          isFallbackData: true,
          isStale: true,
          staleTimestamp: cachedDashboardData.timestamp,
          dataStatus: 'cached',
        })
      }
      return NextResponse.json({
        ...createEmptyDashboardPayload(),
        isFallbackData: true,
        isStale: false,
        dataStatus: 'reconnecting',
      })
    }

    const revenueData = Object.entries(monthlyBookings).map(([month, data]) => ({
      month,
      revenue: (data as { revenue: number; count: number }).revenue || 0,
      bookings: (data as { revenue: number; count: number }).count || 0,
    }))

    const bookingStatusData = bookingStatuses.map((s: { status: string; count: number }) => ({
      name: s.status,
      value: s.count,
    }))

    const customerGrowthData = Object.entries(monthlyCustomerGrowth).map(([month, count]) => ({
      month,
      customers: count as number,
    }))

    const topToursData = stats.topTours.map((t: { name: string; count: number }) => ({
      name: t.name,
      value: t.count,
    }))

    const inquiriesByTypeData = stats.inquiriesByType.map((i: { inquiryType: string; count: number }) => ({
      name: i.inquiryType,
      value: i.count,
    }))

    const totalRevenue = (Object.values(stats.revenue) as any[]).reduce(
      (sum: number, m: any) => sum + (m?.revenue || 0),
      0,
    )

    const dashboardPayload = {
      viewer: { firstName: session.firstName, permissions: session.role.permissions, role: session.role.name },
      kpi: {
        bookings: { value: stats.counts.bookings, trend: trends.bookings },
        revenue: { value: totalRevenue, trend: trends.revenue },
        pendingReviews: { value: stats.alerts.pendingReviews },
        unreadInquiries: { value: stats.alerts.unreadInquiries },
        activeTours: { value: stats.counts.tours },
        customers: { value: totalCustomersCount, trend: trends.customers },
      },
      revenueData,
      bookingStatusData,
      topToursData,
      customerGrowthData,
      inquiriesByTypeData,
      contentSummary: {
        blog: blogStats,
        destinations: destStats,
        packages: tourStats,
      },
      recentBookings: recentBookings.map((b: Record<string, unknown>) => ({
        id: b.id,
        bookingRef: b.bookingRef,
        firstName: b.firstName,
        lastName: b.lastName,
        email: b.email,
        travelDate: b.travelDate,
        numberOfTravelers: b.numberOfTravelers,
        totalPrice: b.totalPrice,
        status: b.status,
        createdAt: b.createdAt,
        tour: b.tour,
      })),
      recentInquiries: recentInquiries.map((i: Record<string, unknown>) => ({
        id: i.id,
        name: i.name,
        email: i.email,
        message: i.message,
        subject: i.subject,
        isRead: i.isRead,
        createdAt: i.createdAt,
        inquiryType: i.inquiryType,
        tourInterest: i.tourInterest,
        numberOfTravelers: i.numberOfTravelers,
        travelDate: i.travelDate,
      })),
      unreadNotifications: unreadCount,
      isFallbackData: false,
      isStale: false,
      dataStatus: 'live',
    }

    cachedDashboardData = { data: dashboardPayload, timestamp: Date.now() }

    return NextResponse.json(dashboardPayload)
  } catch (error) {
    logger.error('Dashboard API error', { error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json({ error: 'Failed to load dashboard data' }, { status: 500 })
  }
}
