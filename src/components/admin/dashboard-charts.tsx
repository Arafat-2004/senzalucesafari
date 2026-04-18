"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminChart } from "@/components/admin/charts";
import { BarChart, TrendingUp, Users, Globe, MessageSquare } from "lucide-react";

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
                        <TrendingUp className="h-4 w-4 text-green-500" />
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
                        <Users className="h-4 w-4 text-blue-500" />
                        Top Tours by Bookings
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <AdminChart data={toursData} type="bar" colors={["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"]} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Globe className="h-4 w-4 text-purple-500" />
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
                        <MessageSquare className="h-4 w-4 text-amber-500" />
                        Inquiry Types
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <AdminChart data={inquiryData} type="pie" colors={["#f59e0b", "#fbbf24", "#fcd34d", "#fef3c7", "#fffbeb"]} />
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