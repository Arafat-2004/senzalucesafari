'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, TrendingUp, TrendingDown, DollarSign, CalendarCheck, MousePointerClick, Target, Activity, Eye, BarChart3 } from 'lucide-react'

interface AnalyticsData {
    stats: {
        bookings: { total: number; pending: number; confirmed: number }
        revenue: number
        inquiries: { total: number; unread: number }
    }
    conversion: { conversionRate: number }
    trends: { growth: number }
}

interface ConversionData {
    totalEvents: number
    ctaByContext: Array<{ context: string; _count: number }>
    eventsByTour: Array<{ tourId: string; _count: number }>
    eventsByType: Array<{ eventType: string; _count: number }>
    recentEvents: Array<{ id: string; eventName: string; eventType: string; context: string; timestamp: string }>
}

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [conversionData, setConversionData] = useState<ConversionData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const [res1, res2] = await Promise.all([
                    fetch('/api/admin/analytics/advanced'),
                    fetch('/api/admin/analytics/events'),
                ])
                if (res1.ok) setData(await res1.json())
                if (res2.ok) setConversionData(await res2.json())
            } catch (e) {
                console.error('Analytics fetch error:', e)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    const totalClicks = conversionData?.ctaByContext.reduce((sum, c) => sum + c._count, 0) || 0
    const totalEngagements = conversionData?.eventsByTour.reduce((sum, t) => sum + t._count, 0) || 0

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
                <p className="text-muted-foreground">Business insights and conversion tracking</p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${(data?.stats.revenue || 0).toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.conversion.conversionRate || 0}%</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">CTA Clicks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold flex items-center gap-2">
                            <MousePointerClick className="h-5 w-5" />
                            {totalClicks}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.stats.bookings.confirmed || 0}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Conversion Funnel */}
            {conversionData && conversionData.totalEvents > 0 && (
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                Conversion Funnel
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-4">
                                <div className="text-center p-4 bg-muted/30 rounded-lg">
                                    <Eye className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                                    <p className="text-2xl font-bold">
                                        {conversionData.eventsByType.find(e => e.eventType === 'page_view')?._count || 0}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Page Views</p>
                                </div>
                                <div className="text-center p-4 bg-muted/30 rounded-lg">
                                    <MousePointerClick className="h-8 w-8 mx-auto mb-2 text-green-600" />
                                    <p className="text-2xl font-bold">{totalClicks}</p>
                                    <p className="text-sm text-muted-foreground">CTA Clicks</p>
                                </div>
                                <div className="text-center p-4 bg-muted/30 rounded-lg">
                                    <Activity className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                                    <p className="text-2xl font-bold">
                                        {conversionData.eventsByType.find(e => e.eventType === 'funnel')?._count || 0}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Funnel Steps</p>
                                </div>
                                <div className="text-center p-4 bg-muted/30 rounded-lg">
                                    <DollarSign className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                                    <p className="text-2xl font-bold">{totalEngagements}</p>
                                    <p className="text-sm text-muted-foreground">Tour Views</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top CTAs */}
                    {conversionData.ctaByContext.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MousePointerClick className="h-5 w-5" />
                                    Top Performing CTAs
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {conversionData.ctaByContext.map((cta, idx) => (
                                        <div key={cta.context} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                                                    {idx + 1}
                                                </div>
                                                <Badge variant="outline">{cta.context || 'unknown'}</Badge>
                                            </div>
                                            <span className="font-bold">{cta._count}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Recent Activity */}
                    {conversionData.recentEvents.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="max-h-64 overflow-y-auto space-y-2">
                                    {conversionData.recentEvents.slice(0, 10).map((event) => (
                                        <div key={event.id} className="flex items-center justify-between text-sm p-2 rounded hover:bg-muted/30">
                                            <div className="flex items-center gap-2">
                                                <Badge variant={event.eventType === 'cta' ? 'default' : 'secondary'}>
                                                    {event.eventType}
                                                </Badge>
                                                <span className="font-medium">{event.eventName}</span>
                                            </div>
                                            <span className="text-muted-foreground text-xs">
                                                {new Date(event.timestamp).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}

            {/* Empty State */}
            {(!conversionData || conversionData.totalEvents === 0) && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-lg font-medium">No conversion data yet</p>
                        <p className="text-muted-foreground">
                            CTA clicks and funnel events will appear here once users start interacting with the site.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}