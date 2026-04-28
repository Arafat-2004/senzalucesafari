import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/admin-auth";
import { getDashboardStatsFast, getBookingsByStatus, getRecentBookings, getCustomerGrowth, getRecentInquiries, getBlogStats, getDestinationStats, getTourStats, getTopDestinations, getCurrentMonthRevenue, getKpiTrends, DateRangeFilter } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import {
    RevenueBookingsChart,
    BookingsStatusChart,
    TopPackagesChart,
    DestinationPopularityChart,
    CustomerGrowthChart,
    QuickActionsPanel,
    RecentInquiries,
    ContentSummaryCards,
    KPICard,
    StatusBadge,
    DashboardSkeleton,
} from "@/components/admin/dashboard-overview";
import { DashboardDateRangePicker } from "@/components/admin/DashboardDateRangePicker";
import {
    Map,
    Compass,
    Hotel,
    Car,
    FileText,
    Star,
    CalendarCheck,
    MessageSquare,
    Mail,
    HelpCircle,
    Users,
    Plus,
    Clock,
    ArrowRight,
    CheckCircle,
    DollarSign,
    Eye,
    Pencil,
} from "lucide-react";
import Link from "next/link";

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ElementType;
    href: string;
    description?: string;
    trend?: { value: number; direction: "up" | "down" | "neutral" };
    color: "teal" | "purple" | "amber" | "blue" | "red" | "slate";
}

const colorMap = {
    teal: {
        icon: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
        accent: "bg-teal-500",
    },
    purple: {
        icon: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
        accent: "bg-purple-500",
    },
    amber: {
        icon: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
        accent: "bg-amber-500",
    },
    blue: {
        icon: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
        accent: "bg-blue-500",
    },
    red: {
        icon: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
        accent: "bg-red-500",
    },
    slate: {
        icon: "bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400",
        accent: "bg-slate-500",
    },
};

function StatCard({ title, value, icon: Icon, href, description, trend, color }: StatCardProps) {
    return (
        <Link href={href}>
            <Card className="group relative overflow-hidden border bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg ${colorMap[color].icon} group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="h-5 w-5" />
                        </div>
                        {trend && (
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                trend.direction === "up"
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                    : trend.direction === "down"
                                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                    : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                            }`}>
                                {trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "→"}
                                {trend.value}%
                            </div>
                        )}
                    </div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
                    {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 ${colorMap[color].accent}`} />
                </CardContent>
            </Card>
        </Link>
    );
}

const quickActions = [
    { label: "Add Tour", href: "/admin/tours/new", icon: Plus, color: "bg-primary" },
    { label: "View Bookings", href: "/admin/bookings", icon: CalendarCheck, color: "bg-blue-500" },
    { label: "Check Inquiries", href: "/admin/inquiries", icon: MessageSquare, color: "bg-amber-500" },
    { label: "Write Blog Post", href: "/admin/blog/new", icon: FileText, color: "bg-purple-500" },
];

export const revalidate = 60;

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ startDate?: string; endDate?: string }> }) {
    const session = await getSession();
    const params = await searchParams;

    let dateRange: DateRangeFilter | undefined;
    if (params.startDate && params.endDate) {
        dateRange = {
            startDate: new Date(params.startDate),
            endDate: new Date(params.endDate),
        };
    }

    const [dashboardStats, bookingsByStatus, recentBookings, customerGrowth, recentInquiries, blogStats, destinationStats, tourStats, topDestinationsData, currentMonthRevenue, kpiTrends] = await Promise.all([
        getDashboardStatsFast(6, dateRange),
        getBookingsByStatus(),
        getRecentBookings(10),
        getCustomerGrowth(12, dateRange),
        getRecentInquiries(5),
        getBlogStats(),
        getDestinationStats(),
        getTourStats(),
        getTopDestinations(6),
        getCurrentMonthRevenue(dateRange),
        getKpiTrends(),
    ]);

    const {
        counts,
        alerts,
        revenue: revenueData,
        topTours,
        inquiriesByType,
    } = dashboardStats;

    const {
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
    } = counts;

    const {
        pendingBookings,
        unreadInquiries,
        pendingReviews,
    } = alerts;

    // Prepare revenue and bookings trend data
    const revenueBookingsTrend = Object.entries(revenueData || {})
        .map(([month, data]) => ({
            month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
            revenue: data.revenue,
            bookings: data.count,
        }))
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-12);

    // Prepare bookings by status data
    const statusMap: Record<string, string> = {
        CONFIRMED: "Confirmed",
        PENDING: "Pending",
        CANCELLED: "Cancelled",
        COMPLETED: "Completed",
        IN_PROGRESS: "In Progress",
        NO_SHOW: "No Show",
    };
    const bookingsStatusData = bookingsByStatus.map((s) => ({
        name: statusMap[s.status] || s.status,
        value: s.count,
    }));

    // Prepare top packages data
    const topPackagesData = (topTours || []).slice(0, 8).map((t) => ({
        name: t.name || "Unknown",
        value: t.count,
    }));

    // Prepare destination popularity data
    const destinationPopularityData = (topDestinationsData || []).map((d: any) => ({
        name: d.destination?.name || "Unknown",
        value: d.count,
    }));

    // Prepare customer growth data
    const customerGrowthChartData = Object.entries(customerGrowth || {})
        .map(([month, count]) => ({
            month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
            customers: count,
        }))
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-12);

    const alertCount = pendingBookings + unreadInquiries + pendingReviews;
    const hasAlerts = alertCount > 0;

    const revenueFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    const formattedRevenue = revenueFormatter.format(currentMonthRevenue);

    // Fetch recent activity from audit logs
    const recentAuditLogs = await prisma.adminAuditLog.findMany({
        orderBy: { timestamp: 'desc' },
        take: 5,
        include: {
            user: {
                select: { firstName: true, lastName: true }
            }
        }
    }).catch(() => []);

    const recentActivities = recentAuditLogs.map(log => {
        const iconMap: Record<string, React.ElementType> = {
            'CREATE': Plus,
            'UPDATE': FileText,
            'DELETE': FileText,
            'LOGIN': CalendarCheck,
            'LOGOUT': CalendarCheck,
        };
        return {
            type: log.action.toLowerCase(),
            message: `${log.action} ${log.entityType} by ${log.user?.firstName || 'Admin'}`,
            time: new Date(log.timestamp).toLocaleString(),
            icon: iconMap[log.action] || FileText,
        };
    });

    if (recentActivities.length === 0) {
        recentActivities.push(
            { type: "system", message: "System initialized", time: "Recently", icon: CheckCircle },
        );
    }

    return (
        <div className="space-y-6">
            {/* Hero Header with Date Range Picker */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary/80 to-primary/60 p-6 md:p-8 text-primary-foreground">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOHptMC0zMmMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvZz48L3N2Zz4=')] opacity-50" />
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">
                                Welcome back{session?.firstName ? `, ${session.firstName}` : ''}
                            </h1>
                            <p className="text-primary-foreground/80 mt-1">
                                Here&apos;s what&apos;s happening with your safari business today.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <DashboardDateRangePicker />
                            {hasAlerts && (
                                <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                    </span>
                                    <span className="text-sm font-medium">
                                        {alertCount} item{alertCount > 1 ? 's' : ''} need{alertCount === 1 ? 's' : ''} attention
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 1: KPI Summary Cards */}
            <Suspense fallback={<DashboardSkeleton />}>
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <KPICard title="Total Bookings" value={bookingCount} icon={CalendarCheck} color="teal" href="/admin/bookings" trend={kpiTrends.bookings} />
                    <KPICard title="Total Revenue" value={formattedRevenue} icon={DollarSign} color="purple" href="/admin/bookings" trend={kpiTrends.revenue} />
                    <KPICard title="Active Safari Packages" value={tourCount} icon={Map} color="amber" href="/admin/tours" trend={{ value: 0, direction: "neutral" }} />
                    <KPICard title="New Customers" value={Object.values(customerGrowth || {}).reduce((a, b) => a + b, 0)} icon={Users} color="blue" href="/admin/customers" trend={kpiTrends.customers} />
                    <KPICard title="Pending Inquiries" value={unreadInquiries} icon={MessageSquare} color="red" href="/admin/inquiries" trend={kpiTrends.inquiries} />
                    <KPICard title="Published Blog Posts" value={blogStats.published} icon={FileText} color="slate" href="/admin/blog" trend={kpiTrends.blog} />
                </div>
            </Suspense>

            {/* Section 2: Revenue & Bookings Trend Chart */}
            <Suspense fallback={<DashboardSkeleton />}>
                <RevenueBookingsChart data={revenueBookingsTrend} />
            </Suspense>

            {/* Section 3 & 4: Bookings Status + Top Packages */}
            <Suspense fallback={<DashboardSkeleton />}>
                <div className="grid gap-6 lg:grid-cols-2">
                    <BookingsStatusChart data={bookingsStatusData} />
                    <TopPackagesChart data={topPackagesData} />
                </div>
            </Suspense>

            {/* Section 5: Destination Popularity */}
            <Suspense fallback={<DashboardSkeleton />}>
                <DestinationPopularityChart data={destinationPopularityData} />
            </Suspense>

            {/* Section 6: Recent Bookings Table */}
            <Suspense fallback={<DashboardSkeleton />}>
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                Recent Bookings
                            </CardTitle>
                            <Link href="/admin/bookings" className="text-sm font-medium text-primary hover:underline">
                                View All Bookings
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Safari Package</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Travel Date</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Guests</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total Price</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentBookings.map((booking: any) => (
                                        <tr key={booking.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-medium">
                                                        {booking.firstName[0]}{booking.lastName[0]}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {booking.firstName} {booking.lastName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{booking.tour?.name || "N/A"}</td>
                                            <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{new Date(booking.travelDate).toLocaleDateString()}</td>
                                            <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{booking.numberOfTravelers}</td>
                                            <td className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100">${booking.totalPrice.toLocaleString()}</td>
                                            <td className="py-3 px-4"><StatusBadge status={booking.status} /></td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/admin/bookings/${booking.id}`} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                                                        <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                    </Link>
                                                    <Link href={`/admin/bookings/${booking.id}/edit`} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                                                        <Pencil className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </Suspense>

            {/* Section 7: Customer Growth Chart */}
            <Suspense fallback={<DashboardSkeleton />}>
                <CustomerGrowthChart data={customerGrowthChartData} />
            </Suspense>

            {/* Section 8: Quick Actions Panel */}
            <QuickActionsPanel />

            {/* Section 9: Recent Inquiries */}
            <Suspense fallback={<DashboardSkeleton />}>
                <RecentInquiries data={recentInquiries} />
            </Suspense>

            {/* Section 10: Content Summary Cards */}
            <ContentSummaryCards blog={blogStats} destinations={destinationStats} packages={tourStats} />
        </div>
    );
}