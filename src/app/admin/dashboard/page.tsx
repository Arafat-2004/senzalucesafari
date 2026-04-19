import React from 'react'
import { prisma } from '@/lib/prisma'

export default async function AdminDashboard() {
  // Gather basic metrics for the admin dashboard
  const [tourCount, bookingCount, destinationCount] = await Promise.all([
    prisma.tour.count({ where: { /* isActive filter assumed */ } }).catch(() => 0),
    prisma.booking.count().catch(() => 0),
    prisma.destination.count().catch(() => 0)
  ])

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="text-sm text-muted-foreground">Tours</div>
          <div className="text-2xl font-semibold">{tourCount}</div>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="text-sm text-muted-foreground">Bookings</div>
          <div className="text-2xl font-semibold">{bookingCount}</div>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="text-sm text-muted-foreground">Destinations</div>
          <div className="text-2xl font-semibold">{destinationCount}</div>
        </div>
      </div>
    </main>
  )
}
