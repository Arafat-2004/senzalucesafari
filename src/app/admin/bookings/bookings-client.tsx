'use client'

import { AdminPageHeader, DataTable } from '../components'
import type { Column } from '../components'
import { deleteBooking } from './actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, Loader2, Filter } from 'lucide-react'
import { useState, useMemo } from 'react'
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

const statusOptions = ['ALL', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']
const paymentOptions = ['ALL', 'PENDING', 'DEPOSIT_PAID', 'PARTIALLY_PAID', 'FULLY_PAID', 'REFUNDED', 'CANCELLED']

export default function BookingsClient({ data }: { data: BookingRow[] }) {
    const [exporting, setExporting] = useState(false)
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [paymentFilter, setPaymentFilter] = useState('ALL')

    const filteredData = useMemo(() => {
        return data.filter((b) => {
            if (statusFilter !== 'ALL' && b.status !== statusFilter) return false
            if (paymentFilter !== 'ALL' && b.paymentStatus !== paymentFilter) return false
            return true
        })
    }, [data, statusFilter, paymentFilter])

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
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-9 rounded-md border border-input bg-background text-foreground px-3 text-sm"
                    >
                        {statusOptions.map(s => (
                            <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s.replace(/_/g, ' ')}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Payment:</span>
                    <select
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value)}
                        className="h-9 rounded-md border border-input bg-background text-foreground px-3 text-sm"
                    >
                        {paymentOptions.map(s => (
                            <option key={s} value={s}>{s === 'ALL' ? 'All Payments' : s.replace(/_/g, ' ')}</option>
                        ))}
                    </select>
                </div>
                {(statusFilter !== 'ALL' || paymentFilter !== 'ALL') && (
                    <Button variant="ghost" size="sm" onClick={() => { setStatusFilter('ALL'); setPaymentFilter('ALL') }}>
                        Clear Filters
                    </Button>
                )}
                <span className="text-sm text-muted-foreground ml-auto">
                        Showing <span className="font-semibold text-foreground">{filteredData.length}</span> of {data.length} bookings
                </span>
            </div>
            <DataTable
                data={filteredData}
                columns={columns}
                searchField={['customerName', 'bookingRef', 'tourName']}
                searchPlaceholder="Search by name, ref, or tour..."
                editHref={(b) => `/admin/bookings/${b.id}/edit`}
                deleteAction={deleteBooking}
            />
        </div>
    )
}
