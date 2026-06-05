'use client'

import { useState, useEffect } from 'react'
import {
  CalendarCheck,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  CalendarDays,
  PlusCircle,
  AlertTriangle,
  Clock,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  KPICard,
  RevenueBookingsChart,
  BookingsStatusChart,
  TopPackagesChart,
  CustomerGrowthChart,
  RecentInquiries,
  QuickActionsPanel,
  ContentSummaryCards,
  DashboardSkeleton,
  StatusBadge,
} from '@/components/admin/dashboard-overview'
import Link from 'next/link'
import { format } from 'date-fns'

interface TrendData {
  value: number | string
  direction: 'up' | 'down' | 'neutral'
}

interface KPIItem {
  value: number | string
  trend?: TrendData
}

interface DashboardData {
  kpi: {
    bookings: KPIItem
    revenue: KPIItem
    pendingReviews: KPIItem
    unreadInquiries: KPIItem
    activeTours: KPIItem
    customers: KPIItem
  }
  revenueData: Array<{ month: string; revenue: number; bookings: number }>
  bookingStatusData: Array<{ name: string; value: number }>
  topToursData: Array<{ name: string; value: number }>
  customerGrowthData: Array<{ month: string; customers: number }>
  inquiriesByTypeData: Array<{ name: string; value: number }>
  contentSummary: {
    blog: { total: number; published: number; drafts: number }
    destinations: { total: number; active: number; hidden: number }
    packages: { total: number; active: number; archived: number }
  }
  recentBookings: Array<{
    id: string
    bookingRef: string
    firstName: string
    lastName: string
    email: string
    travelDate: string
    numberOfTravelers: number
    totalPrice: number
    status: string
    createdAt: string
    tour: { name: string; slug: string } | null
  }>
  recentInquiries: Array<{
    id: string
    name: string
    email: string
    message: string
    subject: string
    isRead: boolean
    createdAt: string
  }>
  unreadNotifications: number
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

function TrendBadge({ trend }: { trend?: TrendData }) {
  if (!trend) return null
  const isNew = trend.value === 'New'
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
        isNew
          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
          : trend.direction === 'up'
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
            : trend.direction === 'down'
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
              : 'bg-muted text-muted-foreground'
      }`}
    >
      {isNew ? (
        'New'
      ) : trend.direction === 'up' ? (
        <ArrowUpRight className="h-3 w-3" />
      ) : trend.direction === 'down' ? (
        <ArrowDownRight className="h-3 w-3" />
      ) : (
        <Minus className="h-3 w-3" />
      )}
      {!isNew && `${trend.value}% vs last month`}
    </span>
  )
}

function GreetingHeader({ unread }: { unread: number }) {
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr = format(now, 'EEEE, MMMM d, yyyy')

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {greeting}, Admin
        </h1>
        <p className="text-muted-foreground mt-1 text-sm flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5" />
          {dateStr}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {unread > 0 && (
          <Link
            href="/admin/notifications"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/10 text-brand-green dark:bg-brand-green/20 dark:text-brand-green-light rounded-xl text-sm font-medium hover:bg-brand-green/20 transition-colors"
          >
            <Bell className="h-4 w-4" />
            <span>{unread} unread</span>
          </Link>
        )}
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green text-white rounded-xl text-sm font-medium hover:bg-brand-green-dark transition-colors shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          New Booking
        </Link>
      </div>
    </div>
  )
}

function BookingRow({
  booking,
}: {
  booking: DashboardData['recentBookings'][number]
}) {
  return (
    <Link
      href={`/admin/bookings/${booking.id}/edit`}
      className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
    >
      <div className="h-10 w-10 rounded-full bg-brand-green/10 dark:bg-brand-green/20 flex items-center justify-center flex-shrink-0">
        <CalendarCheck className="h-5 w-5 text-brand-green" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-semibold text-foreground truncate">
            {booking.firstName} {booking.lastName}
          </p>
          <StatusBadge status={booking.status} />
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {booking.tour?.name || 'Unknown Tour'} &middot; {booking.bookingRef}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          <Clock className="h-3 w-3 inline mr-1" />
          {format(new Date(booking.createdAt), 'MMM d, yyyy')}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-brand-green">{formatCurrency(booking.totalPrice)}</p>
        <p className="text-xs text-muted-foreground">{booking.numberOfTravelers} guest{booking.numberOfTravelers > 1 ? 's' : ''}</p>
      </div>
    </Link>
  )
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/admin/dashboard')
        if (!res.ok) throw new Error('Failed to fetch dashboard data')
        const json = await res.json()
        setData(json)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
    const interval = setInterval(fetchDashboard, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <DashboardSkeleton />

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertTriangle className="h-12 w-12 text-status-warning mb-4" />
        <p className="text-lg font-semibold text-foreground mb-2">Unable to load dashboard</p>
        <p className="text-sm text-muted-foreground mb-6">{error || 'No data available'}</p>
        <button
          onClick={() => { setLoading(true); setError(null); fetch('/api/admin/dashboard').then(r => r.json()).then(setData).catch(e => setError(e.message)).finally(() => setLoading(false)) }}
          className="px-5 py-2.5 bg-brand-green text-white rounded-xl text-sm font-medium hover:bg-brand-green-dark transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  const kpi = data.kpi

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      {/* Header */}
      <GreetingHeader unread={data.unreadNotifications} />

      {/* KPI Cards - responsive: 1 col mobile, 2 col tablet, 3 col small desktop, 6 col large */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <KPICard
          title="Total Bookings"
          value={kpi.bookings.value}
          icon="calendar"
          trend={kpi.bookings.trend}
          color="teal"
          href="/admin/bookings"
        />
        <KPICard
          title="Revenue"
          value={Number(kpi.revenue.value) >= 1000 ? `$${(Number(kpi.revenue.value) / 1000).toFixed(1)}K` : formatCurrency(Number(kpi.revenue.value))}
          icon="dollar"
          trend={kpi.revenue.trend}
          color="purple"
          href="/admin/bookings"
        />
        <KPICard
          title="Pending Reviews"
          value={kpi.pendingReviews.value}
          icon="message"
          color="gold"
          href="/admin/reviews"
        />
        <KPICard
          title="Unread Inquiries"
          value={kpi.unreadInquiries.value}
          icon="message"
          color="blue"
          href="/admin/inquiries"
        />
        <KPICard
          title="Active Tours"
          value={kpi.activeTours.value}
          icon="map"
          color="red"
          href="/admin/tours"
        />
        <KPICard
          title="Customers"
          value={kpi.customers.value}
          icon="users"
          trend={kpi.customers.trend}
          color="teal"
          href="/admin/customers"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <RevenueBookingsChart data={data.revenueData} />
        <BookingsStatusChart data={data.bookingStatusData} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <TopPackagesChart data={data.topToursData} />
        <CustomerGrowthChart data={data.customerGrowthData} />
      </div>

      {/* Content Summary */}
      <ContentSummaryCards
        blog={data.contentSummary.blog}
        destinations={data.contentSummary.destinations}
        packages={data.contentSummary.packages}
      />

      {/* Bottom Section: Recent Bookings, Inquiries, Quick Actions */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Recent Bookings */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-brand-green" />
                Recent Bookings
              </CardTitle>
              <Link href="/admin/bookings" className="text-sm font-medium text-brand-green hover:underline">
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {data.recentBookings.length > 0 ? (
              data.recentBookings.map((b) => <BookingRow key={b.id} booking={b} />)
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No recent bookings</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Inquiries */}
        <div className="lg:col-span-1">
          <RecentInquiries data={data.recentInquiries.map((i) => ({ ...i, createdAt: new Date(i.createdAt) }))} />
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <QuickActionsPanel />
        </div>
      </div>
    </div>
  )
}
