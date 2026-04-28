'use client'

import { AdminPageHeader, DataTable } from '../components'
import type { Column } from '../components'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { User, Mail, MapPin, DollarSign, Calendar, Download, Loader2, Filter, X } from 'lucide-react'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

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

export default function CustomersClient({ data, countries }: { data: CustomerRow[]; countries: string[] }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [exporting, setExporting] = useState(false)

    const currentCountry = searchParams.get('country') || ''
    const currentBookingRange = searchParams.get('bookingRange') || ''
    const currentDateFrom = searchParams.get('dateFrom') || ''
    const currentDateTo = searchParams.get('dateTo') || ''

    const hasActiveFilters = currentCountry || currentBookingRange || currentDateFrom || currentDateTo

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        router.push(`/admin/customers?${params.toString()}`)
    }

    const handleClearFilters = () => {
        router.push('/admin/customers')
        toast.info('Filters cleared')
    }

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

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center p-4 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-2 text-sm font-medium">
                    <Filter className="h-4 w-4" />
                    Filters
                </div>
                
                <Select value={currentCountry} onValueChange={(value) => handleFilterChange('country', value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Countries" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Countries</SelectItem>
                        {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                                {country}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={currentBookingRange} onValueChange={(value) => handleFilterChange('bookingRange', value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Bookings" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Bookings</SelectItem>
                        <SelectItem value="0">0 bookings</SelectItem>
                        <SelectItem value="1-3">1-3 bookings</SelectItem>
                        <SelectItem value="4+">4+ bookings</SelectItem>
                    </SelectContent>
                </Select>

                <Input
                    type="date"
                    value={currentDateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    placeholder="From date"
                    className="w-[160px]"
                />

                <Input
                    type="date"
                    value={currentDateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    placeholder="To date"
                    className="w-[160px]"
                />

                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                        <X className="h-4 w-4 mr-1" />
                        Clear filters
                    </Button>
                )}
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
