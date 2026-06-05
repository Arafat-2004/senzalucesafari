"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
  Eye,
  Pencil,
  Reply,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import Link from "next/link";

const CHART_COLORS = {
  green: '#2D9B5E',
  purple: '#7c3aed',
  gold: '#C8A84B',
  blue: '#2563eb',
  red: '#dc2626',
  slate: '#64748b',
};

type IconName = "calendar" | "dollar" | "map" | "users" | "message" | "filetext";

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
};

const colorMap = {
  teal: {
    icon: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
    accent: "bg-teal-500",
  },
  purple: {
    icon: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    accent: "bg-purple-500",
  },
  gold: {
    icon: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
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
  green: {
    icon: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    accent: "bg-green-500",
  },
};

export function KPICard({ title, value, icon: iconName, trend, color, href }: KPICardProps) {
  const IconWrapper = href ? Link : "div";
  const Icon = iconMap[iconName];
  return (
    <IconWrapper href={href || "#"} className="block">
      <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardContent className="p-4 sm:p-5 lg:p-6">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className={`p-2 sm:p-3 rounded-lg ${colorMap[color].icon}`}>
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            {trend && (
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  trend.value === "New"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : trend.direction === "up"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : trend.direction === "down"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                }`}
              >
                {trend.value === "New" ? (
                  "New"
                ) : trend.direction === "up" ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : trend.direction === "down" ? (
                  <ArrowDownRight className="h-3 w-3" />
                ) : (
                  <Minus className="h-3 w-3" />
                )}
                {trend.value === "New" ? "New" : `${trend.value}%`}
              </div>
            )}
          </div>
          <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{value}</p>
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
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
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
    CONFIRMED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    COMPLETED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    IN_PROGRESS: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusMap[status] || "bg-gray-100 text-gray-700"}`}>
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
    "bg-teal-500",
    "bg-purple-500",
    "bg-blue-500",
    "bg-brand-gold-500",
    "bg-red-500",
    "bg-slate-500",
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Revenue & Booking Trends
          </CardTitle>
          <ChartToggle options={["Revenue", "Bookings", "Both"]} active={view} onChange={setView} />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis yAxisId="left" className="text-xs" />
            <YAxis yAxisId="right" orientation="right" className="text-xs" />
            <Tooltip />
            {(view === "Revenue" || view === "Both") && (
              <Bar yAxisId="left" dataKey="revenue" fill={CHART_COLORS.purple} radius={[4, 4, 0, 0]} />
            )}
            {(view === "Bookings" || view === "Both") && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="bookings"
                stroke={CHART_COLORS.blue}
                strokeWidth={2}
                dot={{ fill: CHART_COLORS.blue }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Bookings by Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center -mt-16">
              <p className="text-2xl font-bold text-foreground">{total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            {data.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-sm text-foreground">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{((item.value / total) * 100).toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TopPackagesChart({
  data,
}: {
  data: Array<{ name: string; value: number }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Most Booked Safari Packages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis type="number" className="text-xs" />
            <YAxis type="category" dataKey="name" width={150} className="text-xs" />
            <Tooltip />
            <Bar dataKey="value" fill={CHART_COLORS.green} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
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
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis type="number" className="text-xs" />
            <YAxis type="category" dataKey="name" width={150} className="text-xs" />
            <Tooltip />
            <Bar dataKey="value" fill={CHART_COLORS.gold} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function CustomerGrowthChart({
  data,
}: {
  data: Array<{ month: string; customers: number }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Customer Growth
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="customers"
              fill={CHART_COLORS.blue}
              fillOpacity={0.1}
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
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function QuickActionsPanel() {
  const actions = [
    { label: "Add New Safari Package", icon: PlusCircle, color: "bg-teal-100 text-teal-700 hover:bg-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:hover:bg-teal-900/50", href: "/admin/tours/new" },
    { label: "Create Blog Post", icon: PenLine, color: "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50", href: "/admin/blog/new" },
    { label: "View All Inquiries", icon: MessageSquare, color: "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50", href: "/admin/inquiries" },
    { label: "Export Bookings CSV", icon: Download, color: "bg-brand-gold-100 text-brand-gold-700 hover:bg-brand-gold-200 dark:bg-brand-gold-900/30 dark:text-brand-gold-400 dark:hover:bg-brand-gold-900/50", href: "/admin/bookings" },
    { label: "Add Destination", icon: MapPin, color: "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50", href: "/admin/destinations/new" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action) => (
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
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
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
      color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30",
      stats: [
        { label: "Total", value: blog.total },
        { label: "Published", value: blog.published },
        { label: "Drafts", value: blog.drafts },
      ],
    },
    {
      title: "Destinations",
      icon: MapPin,
      color: "text-teal-600 bg-teal-100 dark:text-teal-400 dark:bg-teal-900/30",
      stats: [
        { label: "Total", value: destinations.total },
        { label: "Active", value: destinations.active },
        { label: "Hidden", value: destinations.hidden },
      ],
    },
    {
      title: "Safari Packages",
      icon: Map,
      color: "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30",
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
                <div className="h-11 w-11 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
        </CardContent>
      </Card>

      {/* Two Column Charts Skeleton */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 p-3">
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
