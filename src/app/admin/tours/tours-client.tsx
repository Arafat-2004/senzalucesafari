'use client'

import { AdminPageHeader, DataTable, StatusBadge, BoolBadge } from '../components'
import type { Column } from '../components'
import { deleteTour } from './actions'

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
    return (
        <div className="space-y-6">
            <AdminPageHeader title="Tours" description="Manage safari packages" createHref="/admin/tours/new" createLabel="Add Tour" />
            <DataTable
                data={data}
                columns={columns}
                searchField="name"
                searchPlaceholder="Search tours..."
                editHref={(t) => `/admin/tours/${t.id}/edit`}
                deleteAction={deleteTour}
            />
        </div>
    )
}
