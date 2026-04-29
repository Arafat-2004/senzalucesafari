'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Bell, CalendarCheck, MessageSquare, Star, CheckCheck, X, ChevronRight, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface NotificationItem {
  id: string
  type: 'inquiry' | 'booking' | 'review'
  title: string
  description: string
  meta?: string
  tourInterest?: string | null
  createdAt: string
  isRead: boolean
  href: string
}

interface NotificationData {
  unreadCount: number
  inquiries: Array<{
    id: string
    name: string
    subject: string
    tourInterest: string | null
    createdAt: string
  }>
  bookings: Array<{
    id: string
    firstName: string
    lastName: string
    bookingRef: string
    createdAt: string
  }>
  reviews: Array<{
    id: string
    customerName: string
    title: string
    createdAt: string
    tour: { name: string } | null
  }>
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHour < 24) return `${diffHour}h ago`
  if (diffDay < 7) return `${diffDay}d ago`
  return date.toLocaleDateString()
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'inquiry':
      return <MessageSquare className="h-4 w-4" />
    case 'booking':
      return <CalendarCheck className="h-4 w-4" />
    case 'review':
      return <Star className="h-4 w-4" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

function getNotificationColor(type: string) {
  switch (type) {
    case 'inquiry':
      return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
    case 'booking':
      return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30'
    case 'review':
      return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30'
    default:
      return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30'
  }
}

function getNotificationLabel(type: string) {
  switch (type) {
    case 'inquiry':
      return 'New Inquiry'
    case 'booking':
      return 'New Booking'
    case 'review':
      return 'Pending Review'
    default:
      return 'Notification'
  }
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<NotificationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/notifications', {
        cache: 'no-store',
        next: { revalidate: 0 }
      })
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [isOpen, fetchNotifications])

  const handleMarkAllRead = async () => {
    setIsMarkingAllRead(true)
    try {
      const res = await fetch('/api/admin/notifications/mark-read', {
        method: 'POST'
      })
      if (res.ok) {
        setData(prev => prev ? { ...prev, unreadCount: 0 } : null)
      }
    } catch (error) {
      console.error('Failed to mark all read:', error)
    } finally {
      setIsMarkingAllRead(false)
    }
  }

  const totalUnread = data?.unreadCount || 0

  const notifications: NotificationItem[] = [
    ...(data?.inquiries?.map(item => ({
      id: item.id,
      type: 'inquiry' as const,
      title: item.name,
      description: item.subject,
      meta: item.tourInterest ? `Re: ${item.tourInterest}` : undefined,
      createdAt: item.createdAt,
      isRead: false,
      href: `/admin/inquiries/${item.id}/edit`
    })) || []),
    ...(data?.bookings?.map(item => ({
      id: item.id,
      type: 'booking' as const,
      title: `${item.firstName} ${item.lastName}`,
      description: `Booking #${item.bookingRef}`,
      createdAt: item.createdAt,
      isRead: false,
      href: `/admin/bookings/${item.id}/edit`
    })) || []),
    ...(data?.reviews?.map(item => ({
      id: item.id,
      type: 'review' as const,
      title: item.customerName,
      description: item.title,
      meta: item.tour?.name,
      createdAt: item.createdAt,
      isRead: false,
      href: `/admin/reviews/${item.id}/edit`
    })) || [])
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Notifications${totalUnread > 0 ? `, ${totalUnread} unread` : ''}`}
        >
          <Bell className="h-5 w-5" />
          {totalUnread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-h-[1.125rem] min-w-[1.125rem] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
              {totalUnread > 99 ? '99+' : totalUnread}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[380px] max-w-[calc(100vw-2rem)] sm:max-w-none max-h-[480px] p-0 overflow-hidden"
        align="end"
        sideOffset={8}
        collisionPadding={8}
      >
        <div className="flex items-center justify-between p-3 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {totalUnread > 0 && (
              <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                {totalUnread}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={handleMarkAllRead}
            disabled={isMarkingAllRead || totalUnread === 0}
          >
            <CheckCheck className="h-3 w-3" />
            {isMarkingAllRead ? 'Marking...' : 'Mark all read'}
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[360px]">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
              <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full mr-2" />
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground text-sm p-4">
              <Inbox className="h-10 w-10 mb-3 opacity-30" />
              <p className="font-medium">No new notifications</p>
              <p className="text-xs text-muted-foreground/60 mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.slice(0, 10).map((notification) => (
                <Link
                  key={notification.id}
                  href={notification.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className={`p-2 rounded-lg shrink-0 ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={`h-5 text-[10px] px-1.5 ${getNotificationColor(notification.type)}`}
                      >
                        {getNotificationLabel(notification.type)}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium truncate leading-tight">
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate leading-tight">
                      {notification.description}
                    </p>
                    {notification.meta && (
                      <p className="text-xs text-muted-foreground/70 truncate leading-tight">
                        {notification.meta}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground/50">
                      {formatRelativeTime(notification.createdAt)}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0 mt-1" />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="p-2 border-t bg-muted/30">
          <Link
            href="/admin/notifications"
            className="flex items-center justify-center gap-2 w-full py-2 text-sm text-primary hover:bg-muted rounded-md transition-colors"
            onClick={() => setIsOpen(false)}
          >
            View all notifications
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}