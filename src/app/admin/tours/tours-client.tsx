'use client'

import { AdminPageHeader, DataTable, StatusBadge, BoolBadge } from '../components'
import type { Column } from '../components'
import { deleteTour } from './actions'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface TourRow {
    id: string
    name: string
    slug: string
    category?: string
    duration: string
    price: number
    rating?: number
    isActive: boolean
    isFeatured: boolean
}

const columns: Column<TourRow>[] = [
    { key: 'name', label: 'Name' },
    { key: 'duration', label: 'Duration' },
    { key: 'price', label: 'Price', render: (t) => t.price ? `$${t.price.toLocaleString()}` : '-' },
    { key: 'rating', label: 'Rating', render: (t) => (t.rating || 0) > 0 ? `${t.rating}/10` : <span className="text-muted-foreground text-xs">New</span> },
    { key: 'isActive', label: 'Status', render: (t) => <StatusBadge active={t.isActive} /> },
    { key: 'isFeatured', label: 'Featured', render: (t) => <BoolBadge value={t.isFeatured} /> },
]

export default function ToursClient({ data }: { data: TourRow[] }) {
    const [exporting, setExporting] = useState(false)
    const published = data.filter(tour => tour.isActive).length
    const featured = data.filter(tour => tour.isFeatured).length

    const handleExport = async () => {
        setExporting(true)
        try {
            const response = await fetch('/api/admin/export/tours')
            if (!response.ok) throw new Error('Export failed')
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            const disposition = response.headers.get('Content-Disposition')
            const filename = disposition?.split('filename="')[1]?.split('"')[0] || 'tours.csv'
            a.download = filename
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            toast.success('Tours exported successfully')
        } catch {
            toast.error('Failed to export tours')
        } finally {
            setExporting(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <AdminPageHeader title="Tours" description="Manage safari packages" createHref="/admin/tours/new" createLabel="Add Tour" />
                <Button variant="outline" onClick={handleExport} disabled={exporting}>
                    {exporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                    Export CSV
                </Button>
            </div>
        <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl border bg-card p-4"><p className="text-sm text-muted-foreground">All tours</p><p className="mt-1 text-2xl font-semibold">{data.length}</p></div><div className="rounded-xl border bg-card p-4"><p className="text-sm text-muted-foreground">Published</p><p className="mt-1 text-2xl font-semibold admin-text-success">{published}</p></div><div className="rounded-xl border bg-card p-4"><p className="text-sm text-muted-foreground">Featured</p><p className="mt-1 text-2xl font-semibold admin-text-featured">{featured}</p></div></div>
            <DataTable
                data={data}
                columns={columns}
                searchField={['name', 'category', 'duration']}
                searchPlaceholder="Search name, category, or duration..."
                editHref={(t) => `/admin/tours/${t.id}/edit`}
                deleteAction={deleteTour}
                nameField="name"
            />
        </div>
    )
}
