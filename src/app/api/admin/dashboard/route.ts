import { NextResponse } from 'next/server'
import { getSession, canAccess } from '@/lib/admin-auth'
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

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!canAccess(session, 50)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const [
      stats,
      trends,
      bookingStatuses,
      recentBookings,
      recentInquiries,
      blogStats,
      destStats,
      tourStats,
      monthlyCustomerGrowth,
      monthlyBookings,
      unreadCount,
    ] = await Promise.all([
      getDashboardStatsFast(12),
      getKpiTrends(),
      getBookingsByStatus(),
      getRecentBookings(5),
      getRecentInquiries(5),
      getBlogStats(),
      getDestinationStats(),
      getTourStats(),
      getCustomerGrowth(6),
      getBookingsByMonth(12),
      prisma.adminNotification.count({ where: { isRead: false } }),
    ])

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

    const totalRevenue = Object.values(stats.revenue).reduce(
      (sum: number, m: { revenue: number; deposits: number; count: number }) => sum + m.revenue,
      0,
    )

    return NextResponse.json({
      kpi: {
        bookings: { value: stats.counts.bookings, trend: trends.bookings },
        revenue: { value: totalRevenue, trend: trends.revenue },
        pendingReviews: { value: stats.alerts.pendingReviews },
        unreadInquiries: { value: stats.alerts.unreadInquiries },
        activeTours: { value: stats.counts.tours },
        customers: { value: trends.customers.value },
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
      })),
      unreadNotifications: unreadCount,
    })
  } catch (error) {
    logger.error('Dashboard API error', { error: error instanceof Error ? error.message : String(error) })
    return NextResponse.json({ error: 'Failed to load dashboard data' }, { status: 500 })
  }
}
