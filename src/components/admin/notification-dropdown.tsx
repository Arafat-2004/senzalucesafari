'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bell, CalendarCheck, MessageSquare, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { markAllNotificationsRead } from '@/app/admin/notifications'

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

export function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const [data, setData] = useState<NotificationData | null>(null)
    const [loading, setLoading] = useState(true)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    useEffect(() => {
        async function fetchNotifications() {
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
        }
        
        if (isOpen) {
            fetchNotifications()
            const interval = setInterval(fetchNotifications, 30000)
            return () => clearInterval(interval)
        }
    }, [isOpen])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    async function handleMarkAllRead() {
        try {
            await fetch('/api/admin/notifications/mark-read', { method: 'POST' })
            setData(prev => prev ? { ...prev, unreadCount: 0 } : null)
        } catch (error) {
            console.error('Failed to mark all read:', error)
        }
    }

    function formatTime(dateString: string) {
        const date = new Date(dateString)
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (minutes < 1) return 'Just now'
        if (minutes < 60) return `${minutes}m ago`
        if (hours < 24) return `${hours}h ago`
        return `${days}d ago`
    }

    const totalUnread = data?.unreadCount || 0

    return (
        <div ref={dropdownRef} className="relative">
            <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className="h-5 w-5" />
                {totalUnread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {totalUnread > 9 ? '9+' : totalUnread}
                    </span>
                )}
            </Button>
            
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-background border rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between p-3 border-b bg-muted/30">
                        <h3 className="font-semibold">Notifications</h3>
                        {totalUnread > 0 && (
                            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleMarkAllRead}>
                                Mark all read
                            </Button>
                        )}
                    </div>
                    
                    <div className="max-h-[60vh] overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-muted-foreground">
                                Loading...
                            </div>
                        ) : totalUnread === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>No new notifications</p>
                            </div>
                        ) : (
                            <>
                                {data?.inquiries?.map((item) => (
                                    <Link 
                                        key={item.id}
                                        href={`/admin/inquiries/${item.id}/edit`}
                                        onClick={() => setIsOpen(false)}
                                        className="block p-3 border-b hover:bg-muted"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <MessageSquare className="h-3 w-3 text-primary" />
                                                    <span className="text-xs text-primary font-medium">New Inquiry</span>
                                                </div>
                                                <p className="text-sm font-medium truncate">{item.name}</p>
                                                {item.tourInterest && (
                                                    <p className="text-xs text-muted-foreground truncate">Re: {item.tourInterest}</p>
                                                )}
                                                <p className="text-xs text-muted-foreground truncate">{item.subject}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{formatTime(item.createdAt)}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}

                                {data?.bookings?.map((item) => (
                                    <Link 
                                        key={item.id}
                                        href={`/admin/bookings/${item.id}/edit`}
                                        onClick={() => setIsOpen(false)}
                                        className="block p-3 border-b hover:bg-muted"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <CalendarCheck className="h-3 w-3 text-orange-500" />
                                                    <span className="text-xs text-orange-500 font-medium">New Booking</span>
                                                </div>
                                                <p className="text-sm font-medium truncate">{item.firstName} {item.lastName}</p>
                                                <p className="text-xs text-muted-foreground truncate">Ref: {item.bookingRef}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{formatTime(item.createdAt)}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}

                                {data?.reviews?.map((item) => (
                                    <Link 
                                        key={item.id}
                                        href={`/admin/reviews/${item.id}/edit`}
                                        onClick={() => setIsOpen(false)}
                                        className="block p-3 border-b hover:bg-muted"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="h-2 w-2 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <Star className="h-3 w-3 text-yellow-500" />
                                                    <span className="text-xs text-yellow-500 font-medium">Pending Review</span>
                                                </div>
                                                <p className="text-sm font-medium truncate">{item.customerName}</p>
                                                <p className="text-xs text-muted-foreground truncate">{item.tour?.name || 'Unknown Tour'}</p>
                                                <p className="text-xs text-muted-foreground truncate">{item.title}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{formatTime(item.createdAt)}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </>
                        )}
                    </div>
                    
                    <div className="p-2 border-t bg-muted/30">
                        <Link 
                            href="/admin/inquiries" 
                            className="block text-center text-sm text-primary hover:underline"
                            onClick={() => setIsOpen(false)}
                        >
                            View all notifications
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}