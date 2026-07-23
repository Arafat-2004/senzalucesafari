"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminChart } from "@/components/admin/charts";
import { TrendingUp, Users, Globe, MessageSquare } from "lucide-react";
import { ADMIN_CHART_COLORS } from '@/lib/admin-colors';

interface ChartData {
    name: string;
    value: number;
}

interface DashboardChartsProps {
    revenueData: ChartData[];
    toursData: ChartData[];
    deviceData: ChartData[];
    inquiryData: ChartData[];
}

export function DashboardCharts({
    revenueData,
    toursData,
    deviceData,
    inquiryData,
}: DashboardChartsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 admin-text-success" />
                        Revenue Trend
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <AdminChart data={revenueData} type="bar" />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Users className="h-4 w-4 admin-text-info" />
                        Top Tours by Bookings
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <AdminChart data={toursData} type="bar" colors={[...ADMIN_CHART_COLORS]} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Globe className="h-4 w-4 admin-chart-violet bg-transparent" />
                        Device Distribution
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <AdminChart data={deviceData} type="pie" />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 admin-text-warning" />
                        Inquiry Types
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <AdminChart data={inquiryData} type="pie" colors={[...ADMIN_CHART_COLORS]} />
                </CardContent>
            </Card>
        </div>
    );
}

export function DashboardChartsLoader() {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
                <Card key={i}>
                    <CardHeader className="pb-2">
                        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-48 bg-muted rounded animate-pulse" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
