'use client'

import { useState, useEffect } from 'react'
import {
  Bell,
  CalendarDays,
  PlusCircle,
  Clock,
} from 'lucide-react'
import {
  KPICard,
  RevenueBookingsChart,
  BookingsStatusChart,
  TopPackagesChart,
  CustomerGrowthChart,
  QuickActionsPanel,
  ContentSummaryCards,
  DashboardSkeleton,
} from '@/components/admin/dashboard-overview'
import { RecentActivityFeed } from '@/components/admin/RecentActivityFeed'
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
  viewer?: { firstName: string; role: string; permissions: Record<string, string[]> }
  isFallbackData?: boolean
  isStale?: boolean
  staleTimestamp?: number
  dataStatus?: 'live' | 'cached' | 'reconnecting'
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

const DASHBOARD_CACHE_KEY = 'senza-admin-dashboard:last-good'

const EMPTY_DASHBOARD_DATA: DashboardData = {
  isFallbackData: true,
  isStale: false,
  dataStatus: 'reconnecting',
  kpi: {
    bookings: { value: 0, trend: { value: 0, direction: 'neutral' } },
    revenue: { value: 0, trend: { value: 0, direction: 'neutral' } },
    pendingReviews: { value: 0 },
    unreadInquiries: { value: 0 },
    activeTours: { value: 0 },
    customers: { value: 0, trend: { value: 0, direction: 'neutral' } },
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

function isDashboardData(value: unknown): value is DashboardData {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Record<string, unknown>
  return Boolean(candidate.kpi)
    && Array.isArray(candidate.revenueData)
    && Array.isArray(candidate.bookingStatusData)
    && Array.isArray(candidate.topToursData)
    && Array.isArray(candidate.customerGrowthData)
    && Array.isArray(candidate.recentBookings)
    && Array.isArray(candidate.recentInquiries)
}

function readDashboardCache(): DashboardData | null {
  try {
    const cached = window.sessionStorage.getItem(DASHBOARD_CACHE_KEY)
    if (!cached) return null
    const parsed: unknown = JSON.parse(cached)
    return isDashboardData(parsed) ? parsed : null
  } catch {
    window.sessionStorage.removeItem(DASHBOARD_CACHE_KEY)
    return null
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

function GreetingHeader({ unread, firstName }: { unread: number; firstName?: string }) {
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr = format(now, 'EEEE, MMMM d, yyyy')

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {`${greeting}, ${firstName || 'Admin'}`}
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



export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const abortController = new AbortController()
    let active = true
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null

    queueMicrotask(() => {
      if (!active) return
      const cached = readDashboardCache()
      if (!cached) return
      setData({
        ...cached,
        isFallbackData: true,
        isStale: true,
        dataStatus: 'cached',
      })
      setLoading(false)
    })

    async function fetchDashboard() {
      try {
        const res = await fetch('/api/admin/dashboard', {
          signal: abortController.signal,
          cache: 'no-store',
        })
        if (res.status === 401) {
          window.location.replace('/admin/login?redirectedFrom=%2Fadmin')
          return
        }
        if (!res.ok) throw new Error(`Dashboard request returned ${res.status}`)
        const json: unknown = await res.json()
        if (!isDashboardData(json)) throw new Error('Dashboard response was incomplete')
        if (!active) return

        setData(json)
        if (!json.isFallbackData) {
          window.sessionStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify(json))
        }
        if (json.isFallbackData) {
          if (reconnectTimer) clearTimeout(reconnectTimer)
          reconnectTimer = setTimeout(() => setRefreshKey(key => key + 1), 15000)
        }
      } catch (err) {
        if (!active || abortController.signal.aborted || (err instanceof DOMException && err.name === 'AbortError')) return
        setData(current => ({
          ...(current ?? EMPTY_DASHBOARD_DATA),
          isFallbackData: true,
          isStale: Boolean(current),
          dataStatus: current ? 'cached' : 'reconnecting',
        }))
        if (reconnectTimer) clearTimeout(reconnectTimer)
        reconnectTimer = setTimeout(() => setRefreshKey(key => key + 1), 15000)
      } finally {
        if (active) setLoading(false)
      }
    }

    void fetchDashboard()
    const interval = setInterval(() => void fetchDashboard(), 60000)
    return () => {
      active = false
      clearInterval(interval)
      if (reconnectTimer) clearTimeout(reconnectTimer)
      abortController.abort()
    }
  }, [refreshKey])

  if (loading) return <DashboardSkeleton />

  const dashboardData = data ?? EMPTY_DASHBOARD_DATA
  const kpi = dashboardData.kpi

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      {/* Header */}
      <GreetingHeader unread={dashboardData.unreadNotifications} firstName={dashboardData.viewer?.firstName} />

      {dashboardData.isFallbackData && (
        <div className="admin-tone-warning flex items-start gap-3 rounded-xl border px-4 py-3" role="status">
          <Clock className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">
              {dashboardData.isStale ? 'Showing the latest saved dashboard summary' : 'Connecting to live dashboard data'}
            </p>
            <p className="mt-0.5 text-xs opacity-80">
              Your booking data is safe. Live figures will refresh automatically when the connection is restored.
            </p>
          </div>
          <button type="button" onClick={() => setRefreshKey(key => key + 1)} className="shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-background/20">
            Refresh now
          </button>
        </div>
      )}

      {/* KPI Cards - responsive: 1 col mobile, 2 col tablet, 3 col small desktop, 6 col large */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <KPICard
          title="Recorded Booking Value"
          value={Number(kpi.revenue.value) >= 1000 ? `$${(Number(kpi.revenue.value) / 1000).toFixed(1)}K` : formatCurrency(Number(kpi.revenue.value))}
          icon="dollar"
          trend={kpi.revenue.trend}
          color="purple"
          href="/admin/bookings"
        />
        <KPICard
          title="Total Bookings"
          value={kpi.bookings.value}
          icon="calendar"
          trend={kpi.bookings.trend}
          color="teal"
          href="/admin/bookings"
        />
        <KPICard
          title="Customers"
          value={kpi.customers.value}
          icon="users"
          trend={kpi.customers.trend}
          color="green"
          href="/admin/customers"
        />
        <KPICard
          title="Unread Inquiries"
          value={kpi.unreadInquiries.value}
          icon="message"
          color="blue"
          href="/admin/inquiries"
        />
        <KPICard
          title="Pending Reviews"
          value={kpi.pendingReviews.value}
          icon="star"
          color="gold"
          href="/admin/reviews"
        />
        <KPICard
          title="Active Tours"
          value={kpi.activeTours.value}
          icon="map"
          color="red"
          href="/admin/tours"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <RevenueBookingsChart data={dashboardData.revenueData} />
        <BookingsStatusChart data={dashboardData.bookingStatusData} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <TopPackagesChart data={dashboardData.topToursData} />
        <CustomerGrowthChart data={dashboardData.customerGrowthData} />
      </div>

      {/* Content Summary */}
      <ContentSummaryCards
        blog={dashboardData.contentSummary.blog}
        destinations={dashboardData.contentSummary.destinations}
        packages={dashboardData.contentSummary.packages}
      />

      {/* Bottom Section: Recent Bookings, Inquiries, Quick Actions */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Unified Recent Activity Logs (2 cols) */}
        <RecentActivityFeed 
          bookings={dashboardData.recentBookings}
          inquiries={dashboardData.recentInquiries}
          onRefresh={() => setRefreshKey(k => k + 1)}
        />

        {/* Quick Actions (1 col) */}
        <div className="lg:col-span-1">
          <QuickActionsPanel permissions={dashboardData.viewer?.permissions} role={dashboardData.viewer?.role} />
        </div>
      </div>
    </div>
  )
}
