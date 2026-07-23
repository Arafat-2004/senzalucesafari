'use client'

import { AdminPageHeader, DataTable } from '../components'
import type { Column } from '../components'
import { deleteBooking, updateBooking } from './actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, Loader2, Filter, CalendarCheck, CheckCircle2, Clock, DollarSign } from 'lucide-react'
import { useState, useMemo, useTransition } from 'react'
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

function statusClass(s: string) {
    switch (s) {
        case 'CONFIRMED': return 'admin-tone-success border'
        case 'IN_PROGRESS': return 'admin-tone-info border'
        case 'COMPLETED': return 'admin-tone-info border'
        case 'PENDING': return 'admin-tone-warning border'
        case 'CANCELLED': return 'admin-tone-danger border'
        case 'NO_SHOW': return 'admin-tone-neutral border'
        default: return 'admin-tone-neutral border'
    }
}

const bookingStatuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']

const statusOptions = ['ALL', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']
const paymentOptions = ['ALL', 'PENDING', 'DEPOSIT_PAID', 'PARTIALLY_PAID', 'FULLY_PAID', 'REFUNDED', 'CANCELLED']

export default function BookingsClient({ data, dataUnavailable = false }: { data: BookingRow[]; dataUnavailable?: boolean }) {
    const [exporting, setExporting] = useState(false)
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [paymentFilter, setPaymentFilter] = useState('ALL')
    const [localData, setLocalData] = useState(data)
    const [isPending, startTransition] = useTransition()

    const filteredData = useMemo(() => {
        return localData.filter((b) => {
            if (statusFilter !== 'ALL' && b.status !== statusFilter) return false
            if (paymentFilter !== 'ALL' && b.paymentStatus !== paymentFilter) return false
            return true
        })
    }, [localData, statusFilter, paymentFilter])

    function handleQuickStatusChange(bookingId: string, newStatus: string) {
        startTransition(async () => {
            try {
                const fd = new FormData()
                fd.append('status', newStatus)
                await updateBooking(bookingId, fd)
                setLocalData(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b))
                toast.success(`Status updated to ${newStatus.replace(/_/g, ' ')}`)
            } catch {
                toast.error('Failed to update status')
            }
        })
    }

    const columns: Column<BookingRow>[] = [
        { key: 'bookingRef', label: 'Ref' },
        { key: 'customerName', label: 'Customer' },
        { key: 'tourName', label: 'Tour' },
        { key: 'travelDate', label: 'Travel Date' },
        {
            key: 'status', label: 'Status', render: (b) => (
                <select
                    value={b.status}
                    onChange={(e) => handleQuickStatusChange(b.id, e.target.value)}
                    disabled={isPending}
                    aria-label="Change booking status"
                    className={`h-8 rounded-full text-xs font-semibold px-3 py-1 cursor-pointer transition-colors focus:ring-2 focus:ring-primary focus:outline-none appearance-none pr-8 relative bg-no-repeat bg-[right_0.5rem_center] ${statusClass(b.status)}`}
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundSize: '1.25rem',
                    }}
                >
                    {bookingStatuses.map(s => (
                        <option key={s} value={s} className="bg-background text-foreground">{s.replace(/_/g, ' ')}</option>
                    ))}
                </select>
            )
        },
        { key: 'paymentStatus', label: 'Payment record', render: (b) => <Badge variant="outline">{b.paymentStatus.replace(/_/g, ' ')}</Badge> },
        { key: 'totalPrice', label: 'Total' },
    ]

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

    // Calculate mini KPI summary stats
    const totalBookings = data.length
    const confirmedBookings = data.filter(b => b.status === 'CONFIRMED').length
    const pendingBookings = data.filter(b => b.status === 'PENDING').length
    const totalRevenue = data.reduce((sum, b) => {
        // Strip out currency prefix, e.g. "USD 1500.00" -> 1500
        const val = parseFloat(b.totalPrice.replace(/[A-Z\s]/g, '') || '0')
        return sum + val
    }, 0)

    return (
        <div className="space-y-6">
            {dataUnavailable && <div role="status" className="admin-tone-warning rounded-xl border p-4 text-sm">Bookings are temporarily unavailable while the database reconnects. Refresh this page shortly; no records were changed.</div>}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <AdminPageHeader title="Bookings" description="Manage safari bookings" />
                <Button variant="outline" onClick={handleExport} disabled={exporting}>
                    {exporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                    Export CSV
                </Button>
            </div>

            {/* mini KPI strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Bookings</p>
                            <p className="text-xl font-bold mt-1">{totalBookings}</p>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <CalendarCheck className="h-4 w-4 text-primary" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confirmed</p>
                    <p className="text-xl font-bold mt-1 admin-text-success">{confirmedBookings}</p>
                        </div>
                    <div className="admin-tone-success h-8 w-8 rounded-full border flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pending</p>
                    <p className="text-xl font-bold mt-1 admin-text-warning">{pendingBookings}</p>
                        </div>
                    <div className="admin-tone-warning h-8 w-8 rounded-full border flex items-center justify-center">
                        <Clock className="h-4 w-4" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Booking Value</p>
                            <p className="text-xl font-bold mt-1">${totalRevenue.toLocaleString()}</p>
                        </div>
                    <div className="admin-tone-info h-8 w-8 rounded-full border flex items-center justify-center">
                        <DollarSign className="h-4 w-4" />
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        aria-label="Filter by status"
                        className="h-9 rounded-md border border-input bg-background text-foreground px-3 text-sm"
                    >
                        {statusOptions.map(s => (
                            <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s.replace(/_/g, ' ')}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Payment record:</span>
                    <select
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value)}
                        aria-label="Filter by externally recorded payment status"
                        className="h-9 rounded-md border border-input bg-background text-foreground px-3 text-sm"
                    >
                        {paymentOptions.map(s => (
                            <option key={s} value={s}>{s === 'ALL' ? 'All payment records' : s.replace(/_/g, ' ')}</option>
                        ))}
                    </select>
                </div>
                {(statusFilter !== 'ALL' || paymentFilter !== 'ALL') && (
                    <Button variant="ghost" size="sm" onClick={() => { setStatusFilter('ALL'); setPaymentFilter('ALL') }}>
                        Clear Filters
                    </Button>
                )}
                <span className="text-sm text-muted-foreground ml-auto">
                        Showing <span className="font-semibold text-foreground">{filteredData.length}</span> of {localData.length} bookings
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
