"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarCheck,
  DollarSign,
  Map,
  Users,
  MessageSquare,
  FileText,
  PlusCircle,
  PenLine,
  Download,
  MapPin,
  Reply,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Star,
} from "lucide-react";
import Link from "next/link";

const CHART_COLORS = {
  green: 'var(--chart-green)',
  purple: 'var(--chart-violet)',
  gold: 'var(--chart-gold)',
  blue: 'var(--chart-blue)',
  red: 'var(--chart-coral)',
  slate: 'var(--tone-neutral-fg)',
};

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  color: "var(--popover-foreground)",
  boxShadow: "0 10px 30px rgb(0 0 0 / 0.14)",
};

function formatMonth(month: string): string {
  const [year, monthNumber] = month.split("-").map(Number);
  if (!year || !monthNumber) return month;
  return new Intl.DateTimeFormat("en", { month: "short", year: "2-digit" }).format(new Date(year, monthNumber - 1, 1));
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactMoney(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function ChartEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/25 px-6 text-center">
      <div className="admin-tone-neutral mb-3 grid size-10 place-items-center rounded-full border" aria-hidden="true">
        <Minus className="size-5" />
      </div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">{description}</p>
    </div>
  );
}

type IconName = "calendar" | "dollar" | "map" | "users" | "message" | "filetext" | "star";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: IconName;
  trend?: { value: number | string; direction: "up" | "down" | "neutral" };
  color: "teal" | "purple" | "gold" | "blue" | "red" | "slate" | "green";
  href?: string;
}

const iconMap = {
  calendar: CalendarCheck,
  dollar: DollarSign,
  map: Map,
  users: Users,
  message: MessageSquare,
  filetext: FileText,
  star: Star,
};

const colorMap = {
  teal: {
    icon: "admin-chart-teal",
    accent: "admin-chart-accent-teal",
  },
  purple: {
    icon: "admin-chart-violet",
    accent: "admin-chart-accent-violet",
  },
  gold: {
    icon: "admin-chart-gold",
    accent: "admin-chart-accent-gold",
  },
  blue: {
    icon: "admin-chart-blue",
    accent: "admin-chart-accent-blue",
  },
  red: {
    icon: "admin-chart-coral",
    accent: "admin-chart-accent-coral",
  },
  slate: {
    icon: "admin-tone-neutral",
    accent: "admin-chart-accent-neutral",
  },
  green: {
    icon: "admin-chart-green",
    accent: "admin-chart-accent-green",
  },
};

export function KPICard({ title, value, icon: iconName, trend, color, href }: KPICardProps) {
  const IconWrapper = href ? Link : "div";
  const Icon = iconMap[iconName];
  return (
    <IconWrapper
      href={href || "#"}
      className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label={`View ${title} details. Current value: ${value}${trend ? `, trend: ${trend.value === 'New' ? 'new' : `${trend.value} percent ${trend.direction}`}` : ''}`}
    >
      <Card className="relative h-full min-h-36 overflow-hidden transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md">
        <CardContent className="flex h-full flex-col p-4 sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-2">
            <div className={`grid size-10 shrink-0 place-items-center rounded-lg ${colorMap[color].icon}`}>
              <Icon className="size-5" aria-hidden="true" />
            </div>
            {trend && (
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  trend.value === "New"
                    ? "admin-tone-info"
                    : trend.direction === "up"
                    ? "admin-tone-success"
                    : trend.direction === "down"
                    ? "admin-tone-danger"
                    : "admin-tone-neutral"
                }`}
              >
                {trend.value === "New" ? (
                  "New"
                ) : (
                  <>
                    {trend.direction === "up" ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : trend.direction === "down" ? (
                      <ArrowDownRight className="h-3 w-3" />
                    ) : (
                      <Minus className="h-3 w-3" />
                    )}
                    {`${trend.value}%`}
                  </>
                )}
              </div>
            )}
          </div>
          <p className="mb-1 text-xs font-medium leading-5 text-muted-foreground">{title}</p>
          <p className="mt-auto truncate text-2xl font-semibold tabular-nums tracking-tight text-foreground" title={String(value)}>{value}</p>
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${colorMap[color].accent}`} />
        </CardContent>
      </Card>
    </IconWrapper>
  );
}

interface ChartToggleProps {
  options: string[];
  active: string;
  onChange: (option: string) => void;
}

function ChartToggle({ options, active, onChange }: ChartToggleProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => (
        <button
          type="button"
          key={option}
          onClick={() => onChange(option)}
          aria-pressed={active === option}
          className={`min-h-9 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 ${
            active === option
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, string> = {
    CONFIRMED: "admin-tone-success border",
    PENDING: "admin-tone-warning border",
    CANCELLED: "admin-tone-danger border",
    COMPLETED: "admin-tone-info border",
    IN_PROGRESS: "admin-tone-info border",
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusMap[status] || "admin-tone-neutral border"}`}>
      {status.replace("_", " ")}
    </span>
  );
}

function AvatarInitials({ name, size = "sm" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  const colors = [
    "admin-chart-accent-teal",
    "admin-chart-accent-violet",
    "admin-chart-accent-blue",
    "bg-brand-gold-500",
    "admin-chart-accent-coral",
    "admin-chart-accent-neutral",
  ];
  const colorIndex = name.charCodeAt(0) % colors.length;

  return (
    <div
      className={`${sizeClasses[size]} ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-medium`}
    >
      {initials}
    </div>
  );
}

export function RevenueBookingsChart({
  data,
}: {
  data: Array<{ month: string; revenue: number; bookings: number }>;
}) {
  const [view, setView] = useState("Both");
  const totalValue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalBookings = data.reduce((sum, item) => sum + item.bookings, 0);
  const hasActivity = totalValue > 0 || totalBookings > 0;
  const period = data.length > 0 ? `${formatMonth(data[0].month)} to ${formatMonth(data[data.length - 1].month)}` : "Last six months";

  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-card-foreground">
              Booking Value & Volume
            </CardTitle>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Recorded booking value and bookings created during {period}. This is not online payment revenue.
            </p>
          </div>
          <ChartToggle options={["Booking value", "Bookings", "Both"]} active={view} onChange={setView} />
        </div>
      </CardHeader>
      <CardContent className="min-w-0">
        <div className="mb-4 grid grid-cols-2 gap-3" aria-label="Booking trend totals">
          <div className="rounded-lg border bg-muted/25 p-3">
            <p className="text-xs text-muted-foreground">Recorded value</p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">{formatMoney(totalValue)}</p>
          </div>
          <div className="rounded-lg border bg-muted/25 p-3">
            <p className="text-xs text-muted-foreground">Bookings created</p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">{totalBookings}</p>
          </div>
        </div>
        {!hasActivity ? (
          <ChartEmptyState title="No booking activity in this period" description="When a booking is recorded, its value and booking count will appear here automatically." />
        ) : (
        <div className="h-64 min-w-0 w-full" role="img" aria-label="Recorded booking value and booking count by month">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="month" tickFormatter={formatMonth} tick={{ fontSize: 11, fill: "var(--chart-axis)" }} stroke="var(--chart-grid)" tickLine={false} />
              <YAxis yAxisId="left" tickFormatter={formatCompactMoney} tick={{ fontSize: 11, fill: "var(--chart-axis)" }} stroke="var(--chart-grid)" width={56} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" allowDecimals={false} domain={[0, (maximum: number) => Math.max(1, maximum)]} tick={{ fontSize: 11, fill: "var(--chart-axis)" }} stroke="var(--chart-grid)" width={32} tickLine={false} />
              <Tooltip
                contentStyle={CHART_TOOLTIP_STYLE}
                labelStyle={{ color: "var(--popover-foreground)", fontWeight: 600 }}
                labelFormatter={(label) => formatMonth(String(label))}
                formatter={(value, name) => name === "revenue" ? [formatMoney(Number(value)), "Recorded value"] : [Number(value), "Bookings"]}
              />
              {(view === "Booking value" || view === "Both") && (
                <Bar yAxisId="left" dataKey="revenue" name="revenue" fill={CHART_COLORS.green} radius={[5, 5, 0, 0]} maxBarSize={38} />
              )}
              {(view === "Bookings" || view === "Both") && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="bookings"
                  stroke={CHART_COLORS.blue}
                  strokeWidth={3}
                  dot={{ fill: CHART_COLORS.blue, stroke: "var(--card)", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        )}
      </CardContent>
    </Card>
  );
}

export function BookingsStatusChart({
  data,
}: {
  data: Array<{ name: string; value: number }>;
}) {
  const COLORS = [CHART_COLORS.green, CHART_COLORS.gold, CHART_COLORS.red, CHART_COLORS.blue, CHART_COLORS.purple, CHART_COLORS.slate];
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const statusColor = (status: string, index: number) => {
    const colors: Record<string, string> = {
      CONFIRMED: CHART_COLORS.green,
      COMPLETED: "var(--chart-teal)",
      PENDING: CHART_COLORS.gold,
      CANCELLED: CHART_COLORS.red,
      IN_PROGRESS: CHART_COLORS.blue,
    };
    return colors[status.toUpperCase()] || COLORS[index % COLORS.length];
  };

  const statusLabel = (status: string) => status.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, letter => letter.toUpperCase());

  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Bookings by Status
        </CardTitle>
        <p className="text-xs leading-5 text-muted-foreground">Current distribution across all recorded bookings.</p>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <ChartEmptyState title="No bookings recorded yet" description="Status totals will appear after the first booking is created." />
        ) : (
          <div>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-3xl font-semibold tabular-nums text-foreground">{total}</p>
                <p className="text-xs text-muted-foreground">Total bookings</p>
              </div>
              <Link href="/admin/bookings" className="text-xs font-medium text-primary hover:underline">View bookings</Link>
            </div>
            <div className="mb-6 flex h-3 w-full overflow-hidden rounded-full bg-muted" role="img" aria-label="Booking status distribution">
              {data.map((item, index) => (
                <span key={item.name} style={{ width: `${(item.value / total) * 100}%`, backgroundColor: statusColor(item.name, index) }} title={`${statusLabel(item.name)}: ${item.value}`} />
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
            {data.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between rounded-lg border bg-muted/20 p-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: statusColor(item.name, index) }} />
                  <span className="text-sm text-foreground">{statusLabel(item.name)}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{((item.value / total) * 100).toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function TopPackagesChart({
  data,
}: {
  data: Array<{ name: string; value: number }>;
}) {
  const maximum = Math.max(...data.map(item => item.value), 0);

  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Most Booked Safari Packages
        </CardTitle>
        <p className="text-xs leading-5 text-muted-foreground">Packages ranked by the number of recorded bookings.</p>
      </CardHeader>
      <CardContent>
        {maximum === 0 ? (
          <ChartEmptyState title="No package bookings yet" description="This ranking will populate when bookings are linked to safari packages." />
        ) : (
          <ol className="space-y-4" aria-label="Most booked packages ranking">
            {data.map((item, index) => (
              <li key={`${item.name}-${index}`}>
                <div className="mb-2 flex min-w-0 items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="admin-tone-neutral grid size-7 shrink-0 place-items-center rounded-full border text-xs font-semibold">{index + 1}</span>
                    <span className="line-clamp-2 text-sm font-medium leading-5 text-foreground" title={item.name}>{item.name}</span>
                  </div>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">{item.value} {item.value === 1 ? "booking" : "bookings"}</span>
                </div>
                <div className="ml-10 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-[var(--chart-green)]" style={{ width: `${Math.max((item.value / maximum) * 100, 4)}%` }} />
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

export function DestinationPopularityChart({
  data,
}: {
  data: Array<{ name: string; value: number }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Destination Popularity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div role="img" aria-label="Chart: Destination Popularity">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" tick={{ fontSize: 12, fill: "var(--chart-axis)" }} stroke="var(--chart-grid)" />
              <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12, fill: "var(--chart-axis)" }} stroke="var(--chart-grid)" />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Bar dataKey="value" fill={CHART_COLORS.gold} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function CustomerGrowthChart({
  data,
}: {
  data: Array<{ month: string; customers: number }>;
}) {
  const totalNewCustomers = data.reduce((sum, item) => sum + item.customers, 0);
  const hasCustomers = totalNewCustomers > 0;
  const period = data.length > 0 ? `${formatMonth(data[0].month)} to ${formatMonth(data[data.length - 1].month)}` : "Last six months";

  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">
          New Booking Customers
        </CardTitle>
        <p className="text-xs leading-5 text-muted-foreground">First-time booking email addresses recorded each month during {period}.</p>
      </CardHeader>
      <CardContent className="min-w-0">
        <div className="mb-4 flex items-end justify-between rounded-lg border bg-muted/25 p-3">
          <div>
            <p className="text-xs text-muted-foreground">New customers in period</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{totalNewCustomers}</p>
          </div>
          <Link href="/admin/customers" className="text-xs font-medium text-primary hover:underline">View customers</Link>
        </div>
        {!hasCustomers ? (
          <ChartEmptyState title="No new booking customers in this period" description="A customer is counted once, in the month of their first recorded booking." />
        ) : (
        <div className="h-56 min-w-0 w-full" role="img" aria-label="New booking customers by month">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="month" tickFormatter={formatMonth} tick={{ fontSize: 11, fill: "var(--chart-axis)" }} stroke="var(--chart-grid)" tickLine={false} />
              <YAxis allowDecimals={false} domain={[0, (maximum: number) => Math.max(1, maximum)]} tick={{ fontSize: 11, fill: "var(--chart-axis)" }} stroke="var(--chart-grid)" width={28} tickLine={false} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} labelStyle={{ color: "var(--popover-foreground)", fontWeight: 600 }} labelFormatter={(label) => formatMonth(String(label))} formatter={(value) => [Number(value), "New customers"]} />
              <Area
                type="monotone"
                dataKey="customers"
                fill={CHART_COLORS.blue}
                fillOpacity={0.18}
                stroke={CHART_COLORS.blue}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="customers"
                stroke={CHART_COLORS.blue}
                strokeWidth={2}
                dot={{ fill: CHART_COLORS.blue, r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        )}
      </CardContent>
    </Card>
  );
}

export function QuickActionsPanel({ permissions, role }: { permissions?: Record<string, string[]>; role?: string }) {
  const actions = [
      { label: "Add New Safari Package", icon: PlusCircle, color: "admin-chart-teal hover:brightness-95", href: "/admin/tours/new", category: 'tours', action: 'CREATE' },
      { label: "Create Blog Post", icon: PenLine, color: "admin-chart-violet hover:brightness-95", href: "/admin/blog/new", category: 'tours', action: 'CREATE' },
      { label: "View All Inquiries", icon: MessageSquare, color: "admin-chart-blue hover:brightness-95", href: "/admin/inquiries", category: 'inquiries', action: 'VIEW' },
    { label: "Export Bookings CSV", icon: Download, color: "bg-brand-gold-100 text-brand-gold-700 hover:bg-brand-gold-200 dark:bg-brand-gold-900/30 dark:text-brand-gold-400 dark:hover:bg-brand-gold-900/50", href: "/admin/bookings", category: 'bookings', action: 'VIEW' },
      { label: "Add Destination", icon: MapPin, color: "admin-chart-coral hover:brightness-95", href: "/admin/destinations/new", category: 'destinations', action: 'CREATE' },
  ];
  const visibleActions = actions.filter(action => role === 'super_admin' || (permissions?.[action.category] || []).includes(action.action));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {visibleActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <div
                className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl ${action.color} transition-colors min-h-[44px]`}
              >
                <action.icon className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                <span className="text-xs sm:text-sm font-medium">{action.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function RecentInquiries({
  data,
}: {
  data: Array<{
    id: string;
    name: string;
    email: string;
    message: string;
    subject: string;
    isRead: boolean;
    createdAt: Date;
  }>;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Recent Inquiries
          </CardTitle>
          <Link
            href="/admin/inquiries"
            className="text-sm font-medium text-primary hover:underline"
          >
            View All
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((inquiry) => (
            <div
              key={inquiry.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <AvatarInitials name={inquiry.name} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {inquiry.name}
                  </p>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      inquiry.isRead
                        ? "bg-muted text-muted-foreground"
                        : "admin-tone-info border"
                    }`}
                  >
                    {inquiry.isRead ? "Read" : "Unread"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate mb-1">
                  {inquiry.subject}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {inquiry.message}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </p>
                  <button className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                    <Reply className="h-3 w-3" />
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ContentSummaryCards({
  blog,
  destinations,
  packages: packagesData,
}: {
  blog: { total: number; published: number; drafts: number };
  destinations: { total: number; active: number; hidden: number };
  packages: { total: number; active: number; archived: number };
}) {
  const cards = [
    {
      title: "Blog Posts",
      icon: FileText,
        color: "admin-tone-info border",
      stats: [
        { label: "Total", value: blog.total },
        { label: "Published", value: blog.published },
        { label: "Drafts", value: blog.drafts },
      ],
    },
    {
      title: "Destinations",
      icon: MapPin,
        color: "admin-tone-success border",
      stats: [
        { label: "Total", value: destinations.total },
        { label: "Active", value: destinations.active },
        { label: "Hidden", value: destinations.hidden },
      ],
    },
    {
      title: "Safari Packages",
      icon: Map,
        color: "admin-tone-warning border",
      stats: [
        { label: "Total", value: packagesData.total },
        { label: "Active", value: packagesData.active },
        { label: "Archived", value: packagesData.archived },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${card.color}`}>
                <card.icon className="h-4 w-4" />
              </div>
              <CardTitle className="text-base font-semibold text-card-foreground">
                {card.title}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {card.stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* KPI Cards Skeleton */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 sm:p-5 lg:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="h-11 w-11 bg-muted rounded-lg" />
                <div className="h-5 w-12 bg-muted rounded-full" />
              </div>
              <div className="h-4 w-24 bg-muted rounded mb-2" />
              <div className="h-8 w-16 bg-muted rounded" />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-muted rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded" />
        </CardContent>
      </Card>

      {/* Two Column Charts Skeleton */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-40 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-muted rounded" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 p-3">
                <div className="h-8 w-8 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
