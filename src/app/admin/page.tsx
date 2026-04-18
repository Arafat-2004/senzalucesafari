import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminChartsWrapper } from "@/components/admin/charts-wrapper";
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
    Eye,
} from "lucide-react";
import Link from "next/link";

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ElementType;
    href: string;
    description?: string;
    badge?: string;
}

function StatCard({ title, value, icon: Icon, href, description, badge }: StatCardProps) {
    return (
        <Link href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">{value}</span>
                        {badge && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{badge}</span>}
                    </div>
                    {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
                </CardContent>
            </Card>
        </Link>
    );
}

export default async function AdminDashboard() {
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
        pendingBookings,
        unreadInquiries,
        pendingReviews,
    ] = await Promise.all([
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
        prisma.booking.count({ where: { status: "PENDING" } }),
        prisma.contactInquiry.count({ where: { isRead: false } }),
        prisma.review.count({ where: { isApproved: false } }),
    ]);

    const stats: StatCardProps[] = [
        { title: "Tours", value: tourCount, icon: Map, href: "/admin/tours", description: "Safari packages" },
        { title: "Destinations", value: destinationCount, icon: Compass, href: "/admin/destinations", description: "National parks" },
        { title: "Accommodations", value: accommodationCount, icon: Hotel, href: "/admin/accommodations", description: "Lodges & camps" },
        { title: "Vehicles", value: vehicleCount, icon: Car, href: "/admin/vehicles", description: "Safari fleet" },
        { title: "Blog Posts", value: blogCount, icon: FileText, href: "/admin/blog", description: "Published articles" },
        { title: "Reviews", value: reviewCount, icon: Star, href: "/admin/reviews", badge: pendingReviews > 0 ? `${pendingReviews} pending` : undefined },
        { title: "Bookings", value: bookingCount, icon: CalendarCheck, href: "/admin/bookings", badge: pendingBookings > 0 ? `${pendingBookings} pending` : undefined },
        { title: "Inquiries", value: inquiryCount, icon: MessageSquare, href: "/admin/inquiries", badge: unreadInquiries > 0 ? `${unreadInquiries} unread` : undefined },
        { title: "Newsletters", value: newsletterCount, icon: Mail, href: "/admin/newsletters", description: "Subscribers" },
        { title: "FAQs", value: faqCount, icon: HelpCircle, href: "/admin/faqs" },
        { title: "Guides", value: guideCount, icon: Users, href: "/admin/guides", description: "Safari guides" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Overview of your safari business</p>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {stats.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>

            {(pendingBookings > 0 || unreadInquiries > 0 || pendingReviews > 0) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Attention Needed</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {pendingBookings > 0 && (
                            <Link href="/admin/bookings" className="flex items-center gap-2 text-sm text-amber-600 hover:underline">
                                <CalendarCheck className="h-4 w-4" />
                                {pendingBookings} booking{pendingBookings > 1 ? "s" : ""} awaiting confirmation
                            </Link>
                        )}
                        {unreadInquiries > 0 && (
                            <Link href="/admin/inquiries" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                                <MessageSquare className="h-4 w-4" />
                                {unreadInquiries} unread inquiry{unreadInquiries > 1 ? "ies" : "y"}
                            </Link>
                        )}
                        {pendingReviews > 0 && (
                            <Link href="/admin/reviews" className="flex items-center gap-2 text-sm text-purple-600 hover:underline">
                                <Star className="h-4 w-4" />
                                {pendingReviews} review{pendingReviews > 1 ? "s" : ""} awaiting approval
                            </Link>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Analytics Charts */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Analytics Overview</h3>
                <AdminChartsWrapper />
            </div>
        </div>
    );
}