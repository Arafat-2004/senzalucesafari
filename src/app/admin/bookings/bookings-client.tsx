'use client'

import { AdminPageHeader, DataTable } from '../components'
import type { Column } from '../components'
import { deleteBooking } from './actions'
import { Badge } from '@/components/ui/badge'

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
    return (
        <div className="space-y-6">
            <AdminPageHeader title="Bookings" description="Manage safari bookings" />
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
