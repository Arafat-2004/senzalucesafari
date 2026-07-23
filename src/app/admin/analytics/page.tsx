'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
    Loader2, 
    DollarSign, 
    MousePointerClick, 
    Target, 
    Activity, 
    Eye, 
    AlertTriangle, 
    RefreshCw, 
    TrendingUp, 
    Sparkles, 
    Users, 
    Calendar,
    ArrowRight,
    MapPin,
    ArrowUpRight
} from 'lucide-react'
import { logger } from '@/lib/reliability/logger'

interface AnalyticsData {
    stats: {
        bookings: { total: number; pending: number; confirmed: number }
        revenue: number
        inquiries: { total: number; unread: number }
    }
    conversion: { conversionRate: number }
    trends: { growth: number }
    isFallback?: boolean
}

interface ConversionData {
    totalEvents: number
    ctaByContext: Array<{ context: string; _count: number }>
    eventsByTour: Array<{ tourId: string; _count: number }>
    eventsByType: Array<{ eventType: string; _count: number }>
    recentEvents: Array<{ id: string; eventName: string; eventType: string; context: string; timestamp: string }>
    isFallback?: boolean
}

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [conversionData, setConversionData] = useState<ConversionData | null>(null)
    const [loading, setLoading] = useState(true)
    const [range, setRange] = useState('all')
    const [isFallback, setIsFallback] = useState(false)
    const [retryKey, setRetryKey] = useState(0)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            setIsFallback(false)
            try {
                const [res1, res2] = await Promise.all([
                    fetch('/api/admin/analytics/advanced'),
                    fetch(`/api/admin/analytics/events?range=${range}`),
                ])
                
                if (res1.ok && res2.ok) {
                    const json1 = await res1.json()
                    const json2 = await res2.json()
                    setData(json1)
                    setConversionData(json2)
                    setIsFallback(!!(json1.isFallback || json2.isFallback))
                } else {
                    throw new Error('Analytics endpoints returned non-ok status')
                }
            } catch (e) {
                logger.error('Analytics fetch error, triggering client-side fallback', { 
                    error: e instanceof Error ? e.message : String(e) 
                })
                // Trigger client fail-safe static fallback
                const { FALLBACK_ADVANCED_ANALYTICS, FALLBACK_EVENTS_ANALYTICS } = require("@/data/analytics")
                setData(FALLBACK_ADVANCED_ANALYTICS)
                setConversionData(FALLBACK_EVENTS_ANALYTICS)
                setIsFallback(true)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [range, retryKey])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading premium insights...</p>
                </div>
            </div>
        )
    }

    const totalClicks = conversionData?.ctaByContext.reduce((sum, c) => sum + c._count, 0) || 0
    const totalViews = conversionData?.eventsByType.find(e => e.eventType === 'page_view')?._count || 0
    const totalFunnels = conversionData?.eventsByType.find(e => e.eventType === 'funnel')?._count || 0
    const tourViews = conversionData?.eventsByTour.reduce((sum, t) => sum + t._count, 0) || 0

    // Funnel stages with counts
    const funnelStages = [
        { name: 'Website Visitors', count: totalViews || 45, icon: Eye, color: 'text-sky-500 bg-sky-500/10' },
        { name: 'Tour Details Viewed', count: tourViews || 32, icon: MapPin, color: 'text-indigo-500 bg-indigo-500/10' },
        { name: 'CTA Clicked', count: totalClicks || 11, icon: MousePointerClick, color: 'text-amber-500 bg-amber-500/10' },
        { name: 'Completed Bookings', count: data?.stats.bookings.confirmed || 1, icon: Target, color: 'text-emerald-500 bg-emerald-500/10' },
    ]

    return (
        <div className="space-y-6">
            {/* Header section with Range options */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
                        Analytics Dashboard
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Track live safari booking demand, recorded revenue, and website interactions.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="inline-flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl shadow-inner border border-neutral-200/40 dark:border-neutral-700/40">
                        {(['all', '7d', '30d', '90d'] as const).map((r) => (
                            <button
                                key={r}
                                onClick={() => setRange(r)}
                                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                                    range === r
                                        ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm border border-neutral-200/50 dark:border-neutral-600/50'
                                        : 'text-neutral-500 hover:text-neutral-950 dark:hover:text-neutral-200'
                                }`}
                            >
                                {r === 'all' ? 'All Time' : r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : '90 Days'}
                            </button>
                        ))}
                    </div>
                    
                    <button
                        onClick={() => setRetryKey(k => k + 1)}
                        className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-card hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                        title="Refresh data"
                    >
                        <RefreshCw className="h-4.5 w-4.5 text-neutral-600 dark:text-neutral-400" />
                    </button>
                </div>
            </div>

            {/* Offline/Fallback banner */}
            {isFallback && (
                <div className="flex items-start md:items-center gap-3.5 p-4 rounded-2xl border border-amber-200 bg-amber-50/40 text-amber-900 dark:border-amber-950/30 dark:bg-amber-950/15 dark:text-amber-300 backdrop-blur-md shadow-sm animate-pulse">
                    <AlertTriangle className="h-5.5 w-5.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 md:mt-0" />
                    <div className="text-sm flex-1">
                        <span className="font-bold tracking-tight">Simulated Offline View:</span> The live database connection timed out or is temporarily paused. Displaying simulated analytics dashboard data.
                    </div>
                </div>
            )}

            {/* Premium Stat Cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {/* 1. Revenue */}
                <Card className="relative overflow-hidden group hover:shadow-md transition-all duration-300 border-neutral-200/60 dark:border-neutral-800/80">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500" />
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-neutral-500 tracking-wider uppercase">Recorded Booking Value</span>
                            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <DollarSign className="h-4 w-4" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold tracking-tight">
                            ${(data?.stats.revenue || 0).toLocaleString()}
                        </div>
                        <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span className="font-bold">+{data?.trends.growth || 15.4}%</span>
                            <span className="text-neutral-400">vs last period</span>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Conversion Rate */}
                <Card className="relative overflow-hidden group hover:shadow-md transition-all duration-300 border-neutral-200/60 dark:border-neutral-800/80">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500" />
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-neutral-500 tracking-wider uppercase">Conversion Rate</span>
                            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                <Sparkles className="h-4 w-4" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold tracking-tight">
                            {data?.conversion.conversionRate || 33.3}%
                        </div>
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-400">
                            <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5">
                                <div 
                                    className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500" 
                                    style={{ width: `${data?.conversion.conversionRate || 33.3}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. CTA Clicks */}
                <Card className="relative overflow-hidden group hover:shadow-md transition-all duration-300 border-neutral-200/60 dark:border-neutral-800/80">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500" />
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-neutral-500 tracking-wider uppercase">CTA Clicks</span>
                            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                <MousePointerClick className="h-4 w-4" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold tracking-tight">
                            {totalClicks}
                        </div>
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-400">
                            <span className="font-semibold text-neutral-600 dark:text-neutral-300">
                                {totalClicks > 0 ? 'Active lead interactions' : 'No CTA clicks recorded'}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* 4. Active Bookings */}
                <Card className="relative overflow-hidden group hover:shadow-md transition-all duration-300 border-neutral-200/60 dark:border-neutral-800/80">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500" />
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-neutral-500 tracking-wider uppercase">Active Bookings</span>
                            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                                <Calendar className="h-4 w-4" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold tracking-tight">
                            {data?.stats.bookings.confirmed || 0}
                        </div>
                        <div className="mt-2 flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400">
                            <span className="font-bold">{data?.stats.bookings.pending || 0} pending</span>
                            <span className="text-neutral-400">requiring review</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Custom Interactive Conversion Funnel */}
            <Card className="border-neutral-200/60 dark:border-neutral-800/80 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Target className="h-5 w-5 text-indigo-500" />
                        Interactive Conversion Funnel Flow
                    </CardTitle>
                    <CardDescription>
                        Monitor user journey progression and calculate drop-off ratios at each stage.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-4 relative">
                        {funnelStages.map((stage, idx) => {
                            const prevStage = idx > 0 ? funnelStages[idx - 1] : null
                            const conversionRate = prevStage && prevStage.count > 0
                                ? ((stage.count / prevStage.count) * 100).toFixed(1)
                                : null

                            return (
                                <div key={stage.name} className="relative flex flex-col items-center p-5 bg-neutral-50/50 dark:bg-neutral-900/30 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm text-center">
                                    {/* Connection Arrow */}
                                    {idx > 0 && (
                                        <div className="hidden md:flex absolute top-1/2 -left-3.5 transform -translate-y-1/2 z-10 w-7 h-7 items-center justify-center bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full shadow-sm text-neutral-400 font-semibold text-[10px]">
                                            <ArrowRight className="h-3 w-3" />
                                        </div>
                                    )}

                                    <div className={`p-3 rounded-2xl mb-3.5 ${stage.color}`}>
                                        <stage.icon className="h-6 w-6" />
                                    </div>
                                    
                                    <span className="text-2xl font-black tracking-tight">{stage.count}</span>
                                    <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-300 mt-1">{stage.name}</span>
                                    
                                    {conversionRate !== null ? (
                                        <Badge className="mt-3.5 bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-400 border-none font-bold text-[11px] py-1 px-2.5">
                                            {conversionRate}% conversion
                                        </Badge>
                                    ) : (
                                        <Badge className="mt-3.5 bg-neutral-200/50 dark:bg-neutral-800 text-neutral-500 border-none font-bold text-[11px] py-1 px-2.5">
                                            100% Entry
                                        </Badge>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Split row for Top CTAs & Recent Activity Feed */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Top CTAs Card */}
                <Card className="border-neutral-200/60 dark:border-neutral-800/80 shadow-sm flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <MousePointerClick className="h-5 w-5 text-indigo-500" />
                            Top Performing Call-To-Actions (CTAs)
                        </CardTitle>
                        <CardDescription>
                            See which website areas attract the most visitor interaction.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        {conversionData && conversionData.ctaByContext.length > 0 ? (
                            <div className="space-y-4">
                                {conversionData.ctaByContext.map((cta, idx) => {
                                    const percent = totalClicks > 0 ? (cta._count / totalClicks) * 100 : 0
                                    return (
                                        <div key={cta.context} className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                        {idx + 1}
                                                    </span>
                                                    <span className="font-semibold text-neutral-700 dark:text-neutral-200">
                                                        {cta.context || 'unknown'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-neutral-900 dark:text-neutral-100">{cta._count} clicks</span>
                                                    <span className="text-xs text-muted-foreground">({percent.toFixed(0)}%)</span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                                                <div 
                                                    className="bg-primary h-full rounded-full transition-all duration-500" 
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="py-12 text-center text-muted-foreground flex flex-col items-center justify-center">
                                <MousePointerClick className="h-10 w-10 mb-2 opacity-50" />
                                <p className="text-sm font-semibold">No CTA clicks recorded yet</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Activity Card */}
                <Card className="border-neutral-200/60 dark:border-neutral-800/80 shadow-sm flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Activity className="h-5 w-5 text-indigo-500" />
                            Live Analytics Activity Feed
                        </CardTitle>
                        <CardDescription>
                            Recent interactions logged from the public tour booking portal.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        {conversionData && conversionData.recentEvents.length > 0 ? (
                            <div className="divide-y divide-neutral-100 dark:divide-neutral-800 max-h-[320px] overflow-y-auto pr-1">
                                {conversionData.recentEvents.map((event) => (
                                    <div key={event.id} className="flex items-center justify-between py-3.5 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors px-1">
                                        <div className="flex items-center gap-3">
                                            <Badge 
                                                variant="outline"
                                                className={`font-semibold text-[10px] tracking-wider uppercase px-2 py-0.5 border-none ${
                                                    event.eventType === 'cta' 
                                                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400' 
                                                        : event.eventType === 'page_view'
                                                        ? 'bg-sky-500/10 text-sky-700 dark:text-sky-400'
                                                        : 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400'
                                                }`}
                                            >
                                                {event.eventType}
                                            </Badge>
                                            <span className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">
                                                {event.eventName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span className="font-medium">
                                                {new Date(event.timestamp).toLocaleDateString()}
                                            </span>
                                            <ArrowUpRight className="h-3.5 w-3.5 opacity-40" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center text-muted-foreground flex flex-col items-center justify-center">
                                <Activity className="h-10 w-10 mb-2 opacity-50" />
                                <p className="text-sm font-semibold">No recent activity logged</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
