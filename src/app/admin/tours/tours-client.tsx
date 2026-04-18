'use client'

import { AdminPageHeader, DataTable, StatusBadge, BoolBadge } from '../components'
import type { Column } from '../components'
import { deleteTour } from './actions'
import type { Tour } from '@/generated/prisma/client'

const columns: Column<Tour>[] = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'priceFrom', label: 'Price', render: (t) => `$${t.priceFrom.toLocaleString()}` },
    { key: 'rating', label: 'Rating', render: (t) => t.rating > 0 ? `${t.rating}/10` : <span className="text-muted-foreground text-xs">New</span> },
    { key: 'isActive', label: 'Status', render: (t) => <StatusBadge active={t.isActive} /> },
    { key: 'isFeatured', label: 'Featured', render: (t) => <BoolBadge value={t.isFeatured} /> },
]

export default function ToursClient({ data }: { data: Tour[] }) {
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
