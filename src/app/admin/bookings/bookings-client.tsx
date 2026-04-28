'use client'

import { AdminPageHeader, DataTable } from '../components'
import type { Column } from '../components'
import { deleteBooking } from './actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type BookingRow = {
    id: string
    bookingRef: string
    customerName: string
    tourName: string
    travelDate: string
    status: string
    paymentStatus: string
    totalPrice: string
}

function statusColor(s: string) {
    switch (s) {
        case 'CONFIRMED': return 'default'
        case 'IN_PROGRESS': return 'default'
        case 'COMPLETED': return 'default'
        case 'CANCELLED': return 'destructive'
        case 'NO_SHOW': return 'secondary'
        default: return 'outline'
    }
}

const columns: Column<BookingRow>[] = [
    { key: 'bookingRef', label: 'Ref' },
    { key: 'customerName', label: 'Customer' },
    { key: 'tourName', label: 'Tour' },
    { key: 'travelDate', label: 'Travel Date' },
    { key: 'status', label: 'Status', render: (b) => <Badge variant={statusColor(b.status) as 'default' | 'destructive' | 'outline' | 'secondary'}>{b.status.replace(/_/g, ' ')}</Badge> },
    { key: 'paymentStatus', label: 'Payment', render: (b) => <Badge variant="outline">{b.paymentStatus.replace(/_/g, ' ')}</Badge> },
    { key: 'totalPrice', label: 'Total' },
]

export default function BookingsClient({ data }: { data: BookingRow[] }) {
    const [exporting, setExporting] = useState(false)

    const handleExport = async () => {
        setExporting(true)
        try {
            const response = await fetch('/api/admin/export/bookings')
            if (!response.ok) throw new Error('Export failed')
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            const disposition = response.headers.get('Content-Disposition')
            const filename = disposition?.split('filename="')[1]?.split('"')[0] || 'bookings.csv'
            a.download = filename
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            toast.success('Bookings exported successfully')
        } catch {
            toast.error('Failed to export bookings')
        } finally {
            setExporting(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <AdminPageHeader title="Bookings" description="Manage safari bookings" />
                <Button variant="outline" onClick={handleExport} disabled={exporting}>
                    {exporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                    Export CSV
                </Button>
            </div>
            <DataTable
                data={data}
                columns={columns}
                searchField="customerName"
                searchPlaceholder="Search bookings..."
                editHref={(b) => `/admin/bookings/${b.id}/edit`}
                deleteAction={deleteBooking}
            />
        </div>
    )
}
