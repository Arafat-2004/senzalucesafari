"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { ADMIN_CHART_COLORS } from '@/lib/admin-colors';

interface ChartProps {
    data: Array<{ name: string; value: number }>;
    title?: string;
    type?: "bar" | "line" | "pie";
    colors?: string[];
}

const DEFAULT_COLORS: string[] = [...ADMIN_CHART_COLORS];

export function AdminChart({
    data,
    title,
    type = "bar",
    colors = DEFAULT_COLORS,
}: ChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
                No data available
            </div>
        );
    }

    const renderChart = () => {
        switch (type) {
            case "pie":
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) =>
                                    `${name} ${((percent || 0) * 100).toFixed(0)}%`
                                }
                                outerRadius={80}
                                fill={colors[0]}
                                dataKey="value"
                            >
                                {data.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={colors[index % colors.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                );

            case "line":
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--chart-axis)' }} stroke="var(--chart-grid)" />
                            <YAxis tick={{ fontSize: 12, fill: 'var(--chart-axis)' }} stroke="var(--chart-grid)" />
                            <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={colors[0]}
                                strokeWidth={2}
                                dot={{ fill: colors[0] }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                );

            default:
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--chart-axis)' }} stroke="var(--chart-grid)" />
                            <YAxis tick={{ fontSize: 12, fill: 'var(--chart-axis)' }} stroke="var(--chart-grid)" />
                            <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
                            <Bar dataKey="value" fill={colors[0]} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                );
        }
    };

    return (
        <div className="w-full">
            {title && (
                <h3 className="text-sm font-medium mb-4 text-muted-foreground">
                    {title}
                </h3>
            )}
            {renderChart()}
        </div>
    );
}

export function MiniStatCard({
    title,
    value,
    icon: Icon,
    trend,
    change,
}: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: "up" | "down";
    change?: string;
}) {
    const trendColor = trend === "up" ? "admin-text-success" : trend === "down" ? "admin-text-danger" : "text-muted-foreground";

    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-muted-foreground">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
                {change && (
                    <p className={`text-xs ${trendColor}`}>
                        {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {change}
                    </p>
                )}
            </div>
            {Icon && <Icon className="h-8 w-8 text-muted-foreground opacity-50" />}
        </div>
    );
}
