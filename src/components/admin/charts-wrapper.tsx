"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCharts, DashboardChartsLoader } from "@/components/admin/dashboard-charts";

interface ChartData {
    name: string;
    value: number;
}

interface AdminChartsWrapperProps {
    initialData?: {
        revenueData: ChartData[];
        toursData: ChartData[];
        deviceData: ChartData[];
        inquiryData: ChartData[];
    };
}

export function AdminChartsWrapper({ initialData }: AdminChartsWrapperProps) {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(!initialData);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) return;

        async function fetchCharts() {
            try {
                const res = await fetch("/api/admin/analytics/charts");
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (err) {
                setError("Failed to load charts");
            } finally {
                setLoading(false);
            }
        }

        fetchCharts();
    }, [initialData]);

    if (loading) return <DashboardChartsLoader />;
    if (error || !data) return null;

    return (
        <DashboardCharts
            revenueData={data.revenueData}
            toursData={data.toursData}
            deviceData={data.deviceData}
            inquiryData={data.inquiryData}
        />
    );
}