'use client'

import { useEffect, useState } from 'react'
import { BellRing, Loader2, Smartphone } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

function urlBase64ToUint8Array(value: string) {
  const padding = '='.repeat((4 - value.length % 4) % 4)
  const base64 = (value + padding).replace(/-/g, '+').replace(/_/g, '/')
  return Uint8Array.from(atob(base64), character => character.charCodeAt(0))
}

export function PushNotificationSettings() {
  const supported = typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
  const [configured, setConfigured] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(supported)

  useEffect(() => {
    if (!supported) return

    Promise.all([
      fetch('/api/admin/push-subscriptions').then(response => {
        if (!response.ok) throw new Error('Unable to load push status')
        return response.json()
      }),
      navigator.serviceWorker.ready.then(registration => registration.pushManager.getSubscription()),
    ])
      .then(([status, subscription]) => {
        setConfigured(Boolean(status.configured))
        setPublicKey(status.publicKey || null)
        setSubscribed(Boolean(subscription))
      })
      .catch(() => toast.error('Unable to load push notification status'))
      .finally(() => setLoading(false))
  }, [supported])

  async function changeSubscription(enabled: boolean) {
    setLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const existing = await registration.pushManager.getSubscription()

      if (!enabled) {
        if (existing) {
          const response = await fetch('/api/admin/push-subscriptions', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint: existing.endpoint }),
          })
          if (!response.ok) throw new Error('Unable to remove this device subscription.')
          await existing.unsubscribe()
        }
        setSubscribed(false)
        toast.success('Push notifications disabled on this device')
        return
      }

      if (!configured || !publicKey) throw new Error('Push delivery is not configured on this deployment.')
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') throw new Error('Notification permission was not granted by the browser.')
      const subscription = existing || await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })
      const response = await fetch('/api/admin/push-subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription.toJSON()),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Unable to save this device subscription.')
      setSubscribed(true)
      toast.success('Push notifications enabled on this device')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update push notifications')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 rounded-xl border p-4">
        <div className="flex gap-3">
          <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <Label>Push alerts on this device</Label>
            <p className="text-sm text-muted-foreground">Receive booking, inquiry, review, and system alerts even when the dashboard is not open.</p>
          </div>
        </div>
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Switch checked={subscribed} onCheckedChange={changeSubscription} disabled={!supported || !configured} />}
      </div>
            {!supported && <p className="admin-tone-warning rounded-lg border p-3 text-sm">This browser does not support installable push notifications.</p>}
            {supported && !configured && <p className="admin-tone-warning rounded-lg border p-3 text-sm">Push code is installed, but the deployment must configure NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, and VAPID_SUBJECT before devices can subscribe.</p>}
      <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
        <p className="flex items-center gap-2 font-medium text-foreground"><BellRing className="h-4 w-4" />Device-specific control</p>
        <p className="mt-1">Enable each phone or computer separately. Disabling a device does not delete dashboard inbox records or affect another administrator&apos;s devices.</p>
      </div>
    </div>
  )
}
