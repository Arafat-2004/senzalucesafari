'use client'

import { AdminPageHeader, DataTable } from '../components'
import type { Column } from '../components'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { User, Mail, MapPin, DollarSign, Calendar, Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type CustomerRow = {
    id: string
    name: string
    email: string
    phone: string | null
    country: string | null
    totalSpent: number
    bookingCount: number
    inquiryCount: number
    lastActivity: string | null
    tours: string
    status: string
}

function statusBadge(s: string) {
    switch (s) {
        case 'CONFIRMED':
            return <Badge className="bg-green-500">Active Customer</Badge>
        case 'CANCELLED':
            return <Badge variant="destructive">Cancelled</Badge>
        case 'INQUIRY_ONLY':
            return <Badge variant="outline">Prospect</Badge>
        default:
            return <Badge variant="secondary">{s}</Badge>
    }
}

const columns: Column<CustomerRow>[] = [
    { 
        key: 'name', 
        label: 'Customer',
        render: (c) => (
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.email}</p>
                </div>
            </div>
        )
    },
    { 
        key: 'country', 
        label: 'Location',
        render: (c) => c.country ? (
            <div className="flex items-center gap-1 text-sm">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                {c.country}
            </div>
        ) : '-'
    },
    { 
        key: 'totalSpent', 
        label: 'Revenue',
        render: (c) => (
            <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-green-600" />
                <span className="font-medium">${c.totalSpent.toLocaleString()}</span>
            </div>
        )
    },
    { 
        key: 'bookingCount', 
        label: 'Bookings',
        render: (c) => (
            <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                {c.bookingCount}
            </div>
        )
    },
    { 
        key: 'inquiryCount', 
        label: 'Inquiries',
        render: (c) => c.inquiryCount > 0 ? c.inquiryCount : '-'
    },
    { 
        key: 'status', 
        label: 'Status',
        render: (c) => statusBadge(c.status)
    },
]

export default function CustomersClient({ data }: { data: CustomerRow[] }) {
    const [exporting, setExporting] = useState(false)

    const handleExport = async () => {
        setExporting(true)
        try {
            const response = await fetch('/api/admin/export/customers')
            if (!response.ok) throw new Error('Export failed')
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            const disposition = response.headers.get('Content-Disposition')
            const filename = disposition?.split('filename="')[1]?.split('"')[0] || 'customers.csv'
            a.download = filename
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            toast.success('Customers exported successfully')
        } catch {
            toast.error('Failed to export customers')
        } finally {
            setExporting(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <AdminPageHeader 
                    title="Customers" 
                    description="Manage customer relationships and view booking history"
                />
                <Button variant="outline" onClick={handleExport} disabled={exporting}>
                    {exporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                    Export CSV
                </Button>
            </div>
            <DataTable
                data={data}
                columns={columns}
                searchField="name"
                searchPlaceholder="Search customers..."
                editHref={(c) => `/admin/customers/${encodeURIComponent(c.email)}`}
            />
        </div>
    )
}
