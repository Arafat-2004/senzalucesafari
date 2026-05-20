'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Bell, CalendarCheck, MessageSquare, Star, AlertCircle,
    CheckCircle, Filter
} from 'lucide-react'
import Link from 'next/link'
import { logger } from '@/lib/reliability/logger'

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

    useEffect(() => {
        async function fetchNotifications() {
            try {
                const res = await fetch('/api/admin/notifications/all')
                if (res.ok) {
                    const data = await res.json()
                    setNotifications(data)
                }
            } catch (error) {
                logger.error('Failed to fetch notifications', { error: error instanceof Error ? error.message : String(error) })
            } finally {
                setLoading(false)
            }
        }
        fetchNotifications()
    }, [])

    async function markAsRead(id: string) {
        try {
            await fetch(`/api/admin/notifications/${id}/read`, { method: 'POST' })
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            )
        } catch (error) {
            logger.error('Failed to mark as read', { error: error instanceof Error ? error.message : String(error) })
        }
    }

    function getIcon(type: string) {
        switch (type) {
            case 'NEW_BOOKING':
                return <CalendarCheck className="h-5 w-5 text-orange-500" />
            case 'NEW_INQUIRY':
                return <MessageSquare className="h-5 w-5 text-blue-500" />
            case 'NEW_REVIEW':
                return <Star className="h-5 w-5 text-yellow-500" />
            default:
                return <Bell className="h-5 w-5 text-muted-foreground" />
        }
    }

    const unreadCount = notifications.filter(n => !n.isRead).length
    const bookingNotifications = notifications.filter(n => n.type.includes('BOOKING'))
    const inquiryNotifications = notifications.filter(n => n.type.includes('INQUIRY'))
    const reviewNotifications = notifications.filter(n => n.type.includes('REVIEW'))

    const filtered = activeTab === 'all'
        ? notifications
        : activeTab === 'unread'
            ? notifications.filter(n => !n.isRead)
            : notifications.filter(n => n.type.includes(activeTab))

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
                    <p className="text-muted-foreground">
                        {unreadCount} unread notifications
                    </p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">
                        All ({notifications.length})
                    </TabsTrigger>
                    <TabsTrigger value="unread">
                        Unread ({unreadCount})
                    </TabsTrigger>
                    <TabsTrigger value="BOOKING">
                        Bookings ({bookingNotifications.length})
                    </TabsTrigger>
                    <TabsTrigger value="INQUIRY">
                        Inquiries ({inquiryNotifications.length})
                    </TabsTrigger>
                    <TabsTrigger value="REVIEW">
                        Reviews ({reviewNotifications.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4">
                    <Card>
                        <CardContent className="p-0">
                            {loading ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    Loading notifications...
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No notifications</p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {filtered.map(notification => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 hover:bg-muted/50 transition-colors ${!notification.isRead ? 'bg-primary/5' : ''
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="mt-1">
                                                    {getIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold">{notification.title}</p>
                                                        {!notification.isRead && (
                                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-2">
                                                        {new Date(notification.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {!notification.isRead && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => markAsRead(notification.id)}
                                                        >
                                                            Mark read
                                                        </Button>
                                                    )}
                                                    {notification.actionUrl && (
                                                        <Link href={notification.actionUrl}>
                                                            <Button variant="outline" size="sm">
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
                </TabsContent>
            </Tabs>
        </div>
    )
}