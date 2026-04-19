'use client'

import { AdminPageHeader, DataTable, StatusBadge } from '../components'
import type { Column } from '../components'
import { deleteDestination } from './actions'

interface DestinationRow {
    id: string
    name: string
    slug: string
    region?: string
    wildlifeRating?: number
    isActive: boolean
}

const columns: Column<DestinationRow>[] = [
    { key: 'name', label: 'Name' },
    { key: 'region', label: 'Region' },
    { key: 'wildlifeRating', label: 'Wildlife', render: (d) => d.wildlifeRating ? `${d.wildlifeRating}/5` : '-' },
    { key: 'isActive', label: 'Status', render: (d) => <StatusBadge active={d.isActive} /> },
]

export default function DestinationsClient({ data }: { data: DestinationRow[] }) {
    return (
        <div className="space-y-6">
            <AdminPageHeader title="Destinations" description="Manage national parks & locations" createHref="/admin/destinations/new" createLabel="Add Destination" />
            <DataTable
                data={data}
                columns={columns}
                searchField="name"
                searchPlaceholder="Search destinations..."
                editHref={(d) => `/admin/destinations/${d.id}/edit`}
                deleteAction={deleteDestination}
            />
        </div>
    )
}
