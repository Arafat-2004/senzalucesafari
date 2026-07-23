'use client'

import { useEffect, useState } from 'react'
import { AdminPageHeader } from '../components'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Bell, CalendarCheck, MessageSquare, Star, AlertCircle, CheckCircle2, Search, ChevronLeft, ChevronRight, Trash2
} from 'lucide-react'
import Link from 'next/link'
import { logger } from '@/lib/reliability/logger'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'

interface NotificationItem {
    id: string
    type: string
    title: string
    message: string
    isRead: boolean
    createdAt: string
    actionUrl?: string
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<string>('all')
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        const controller = new AbortController()
        const timer = setTimeout(async function fetchNotifications() {
            setLoading(true)
            try {
                const params = new URLSearchParams({ page: String(page), limit: '20', filter: activeTab.toLowerCase(), search })
                const res = await fetch(`/api/admin/notifications/all?${params}`, { signal: controller.signal })
                if (res.ok) {
                    const data = await res.json()
                    setNotifications(Array.isArray(data) ? data : (data.notifications ?? []))
                    setTotalPages(data.pagination?.pages || 1)
                    setTotal(data.pagination?.total || 0)
                }
            } catch (error) {
                if (!(error instanceof DOMException && error.name === 'AbortError')) logger.error('Failed to fetch notifications', { error: error instanceof Error ? error.message : String(error) })
            } finally {
                setLoading(false)
            }
        }, 250)
        return () => { clearTimeout(timer); controller.abort() }
    }, [activeTab, page, search, refreshKey])

    async function clearOldReadNotifications() {
        if (!confirm('Delete read notifications older than 30 days? Unread alerts will be kept.')) return
        const response = await fetch('/api/admin/notifications/all?olderThanDays=30', { method: 'DELETE' })
        const data = await response.json()
        if (!response.ok) return toast.error(data.error || 'Unable to clean up notifications')
        toast.success(`${data.deleted} old read notifications removed`); setPage(1); setRefreshKey(value => value + 1)
    }

    async function markAsRead(id: string) {
        try {
            await fetch(`/api/admin/notifications/${id}/read`, { method: 'POST' })
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            )
            toast.success('Notification marked as read')
        } catch (error) {
            logger.error('Failed to mark as read', { error: error instanceof Error ? error.message : String(error) })
        }
    }

    async function markAllAsRead() {
        try {
            const res = await fetch('/api/admin/notifications/mark-read', { method: 'POST' })
            if (!res.ok) throw new Error('API failed')
            setNotifications(prev =>
                prev.map(n => ({ ...n, isRead: true }))
            )
            toast.success('All notifications marked as read')
        } catch (error) {
            logger.error('Failed to mark all as read', { error: error instanceof Error ? error.message : String(error) })
            toast.error('Failed to mark all as read')
        }
    }

    function getIcon(type: string) {
        switch (type) {
            case 'NEW_BOOKING':
                return <CalendarCheck className="h-5 w-5 admin-text-warning shrink-0" />
            case 'NEW_INQUIRY':
                return <MessageSquare className="h-5 w-5 admin-text-info shrink-0" />
            case 'NEW_REVIEW':
                return <Star className="h-5 w-5 admin-text-featured shrink-0" />
            default:
                return <Bell className="h-5 w-5 text-primary shrink-0" />
        }
    }

    const unreadCount = notifications.filter(n => !n.isRead).length
    const bookingNotifications = notifications.filter(n => n.type.includes('BOOKING'))
    const inquiryNotifications = notifications.filter(n => n.type.includes('INQUIRY'))
    const reviewNotifications = notifications.filter(n => n.type.includes('REVIEW'))

    const filtered = notifications

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <AdminPageHeader
                    title="Notifications"
                    description={`Operational alerts and activity requiring attention • ${total} matching records`}
                />
                {unreadCount > 0 && (
                    <Button variant="outline" onClick={markAllAsRead} className="min-h-[40px] shrink-0">
                        <CheckCircle2 className="mr-2 h-4 w-4 admin-text-success" />
                        Mark all as read
                    </Button>
                )}
                <Button variant="ghost" onClick={clearOldReadNotifications} className="min-h-[40px] shrink-0"><Trash2 className="mr-2 h-4 w-4"/>Clean up old read</Button>
            </div>

            {/* Filter chip bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {([
                    { value: 'all',     label: 'All',       count: notifications.length,         icon: Bell },
                    { value: 'unread',  label: 'Unread',    count: unreadCount,                  icon: AlertCircle },
                    { value: 'BOOKING', label: 'Bookings',  count: bookingNotifications.length,  icon: CalendarCheck },
                    { value: 'INQUIRY', label: 'Inquiries', count: inquiryNotifications.length,  icon: MessageSquare },
                    { value: 'REVIEW',  label: 'Reviews',   count: reviewNotifications.length,   icon: Star },
                ] as const).map(({ value, label, count, icon: Icon }) => (
                    <button
                        key={value}
                        onClick={() => { setActiveTab(value); setPage(1) }}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-150 border ${
                            activeTab === value
                                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground hover:bg-muted/50'
                        }`}
                    >
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        {label}
                        {count > 0 && (
                            <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[11px] font-bold px-1 ${
                                activeTab === value ? 'bg-white/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
                            }`}>
                                {count}
                            </span>
                        )}
                    </button>
                ))}
            </div>
            <div className="relative max-w-lg"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input value={search} onChange={event=>{setSearch(event.target.value);setPage(1)}} placeholder="Search notification title or message…" className="pl-9"/></div>

            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-12 text-center text-muted-foreground">
                            Loading notifications...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                            <p className="font-semibold text-foreground">No notifications found</p>
                            <p className="text-xs text-muted-foreground mt-1">There are no notifications under this category right now.</p>
                        </div>
                    ) : (
                        <div className="divide-y border-t border-border">
                            {filtered.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`p-4 hover:bg-muted/50 transition-colors ${!notification.isRead ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1">
                                            {getIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-foreground">{notification.title}</p>
                                                {!notification.isRead && (
                                                    <span className="h-2 w-2 rounded-full bg-primary" />
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-2 font-medium">
                                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {!notification.isRead && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="h-8 text-xs"
                                                >
                                                    Mark read
                                                </Button>
                                            )}
                                            {notification.actionUrl && (
                                                <Link href={notification.actionUrl}>
                                                    <Button variant="outline" size="sm" className="h-8 text-xs">
                                                        View
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
            {totalPages > 1 && <div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p><div className="flex gap-2"><Button variant="outline" disabled={page===1} onClick={()=>setPage(value=>value-1)}><ChevronLeft className="h-4 w-4"/>Previous</Button><Button variant="outline" disabled={page===totalPages} onClick={()=>setPage(value=>value+1)}>Next<ChevronRight className="h-4 w-4"/></Button></div></div>}
        </div>
    )
}
