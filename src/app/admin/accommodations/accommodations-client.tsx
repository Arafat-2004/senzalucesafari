'use client'

import { AdminPageHeader, DataTable, StatusBadge } from '../components'
import type { Column } from '../components'
import { deleteAccommodation } from './actions'

interface AccommodationRow {
    id: string
    name: string
    type: string
    location: string
    pricePerNight: string
    rating: number
    isActive: boolean
}

const columns: Column<AccommodationRow>[] = [
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'location', label: 'Location' },
    { key: 'pricePerNight', label: 'Price/Night' },
    { key: 'rating', label: 'Rating', render: (a) => a.rating > 0 ? `${a.rating}/5` : '-' },
    { key: 'isActive', label: 'Status', render: (a) => <StatusBadge active={a.isActive} /> },
]

export default function AccommodationsClient({ data }: { data: AccommodationRow[] }) {
    const active=data.filter(item=>item.isActive).length
    return (
        <div className="space-y-6">
            <AdminPageHeader title="Accommodations" description="Manage lodges, camps, and hotels" createHref="/admin/accommodations/new" createLabel="Add Accommodation" />
        <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl border bg-card p-4">All properties<div className="text-2xl font-semibold">{data.length}</div></div><div className="rounded-xl border bg-card p-4">Published<div className="text-2xl font-semibold admin-text-success">{active}</div></div><div className="rounded-xl border bg-card p-4">Drafts<div className="text-2xl font-semibold admin-text-warning">{data.length-active}</div></div></div>
            <DataTable
                data={data}
                columns={columns}
                searchField={['name','type','location']}
                searchPlaceholder="Search accommodations..."
                editHref={(a) => `/admin/accommodations/${a.id}/edit`}
                deleteAction={deleteAccommodation}
                nameField="name"
                exportCsv
            />
        </div>
    )
}
