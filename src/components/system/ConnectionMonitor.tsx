'use client'

import { useEffect, useState } from 'react'
import { Wifi, WifiOff, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ConnectionMonitor() {
    const [status, setStatus] = useState<'online' | 'offline' | 'slow'>('online')
    const [visible, setVisible] = useState(false)
    const [lastStatus, setLastStatus] = useState<'online' | 'offline' | 'slow'>('online')

    useEffect(() => {
        if (typeof window === 'undefined') return

        const handleOnline = () => {
            setStatus('online')
            setLastStatus('online')
            setVisible(true)
            // Auto hide "back online" after 4 seconds
            const timer = setTimeout(() => setVisible(false), 4000)
            return () => clearTimeout(timer)
        }

        const handleOffline = () => {
            setStatus('offline')
            setLastStatus('offline')
            setVisible(true)
        }

        // Check navigator connection speed (Slow Network)
        const checkConnectionSpeed = () => {
            const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
            if (conn) {
                const isSlow = conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g' || conn.downlink < 0.5
                if (isSlow && navigator.onLine) {
                    setStatus('slow')
                    setLastStatus('slow')
                    setVisible(true)
                } else if (navigator.onLine) {
                    setStatus('online')
                }
            }
        }

        // Add listeners
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
        if (conn) {
            conn.addEventListener('change', checkConnectionSpeed)
        }

        // Initial check
        setTimeout(() => {
            if (!navigator.onLine) {
                setStatus('offline')
                setLastStatus('offline')
                setVisible(true)
            } else {
                checkConnectionSpeed()
            }
        }, 0)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
            if (conn) {
                conn.removeEventListener('change', checkConnectionSpeed)
            }
        }
    }, [])

    if (!visible) return null

    return (
        <div
            className={cn(
                "fixed top-4 md:top-auto md:bottom-4 left-4 right-4 md:left-auto md:right-4 z-[100] max-w-sm rounded-xl border p-4 shadow-xl transition-all duration-300 transform translate-y-0",
                status === 'offline' && "border-destructive/30 bg-destructive/10 text-destructive dark:bg-destructive/20",
                status === 'slow' && "border-warning/30 bg-warning/10 text-warning dark:bg-warning/20",
                status === 'online' && "border-success/30 bg-success/10 text-success dark:bg-success/20"
            )}
            role="alert"
        >
            <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                    {status === 'offline' && <WifiOff className="h-5 w-5 animate-pulse text-destructive" />}
                    {status === 'slow' && <AlertTriangle className="h-5 w-5 animate-bounce text-warning" />}
                    {status === 'online' && <Wifi className="h-5 w-5 text-success" />}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-tight">
                        {status === 'offline' && "No Internet Connection"}
                        {status === 'slow' && "Slow Network Detected"}
                        {status === 'online' && "Connection Restored"}
                    </p>
                    <p className="text-xs opacity-90 mt-1 leading-relaxed">
                        {status === 'offline' && "You are currently working offline. Safari updates will sync when connection is restored."}
                        {status === 'slow' && "Your network latency is high. Images and pages might take longer to load."}
                        {status === 'online' && "You are back online. All features are fully operational."}
                    </p>
                </div>
                <button
                    onClick={() => setVisible(false)}
                    className="shrink-0 text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
                    aria-label="Dismiss alert"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
