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
    const active = data.filter(item => item.isActive).length
    return (
        <div className="space-y-6">
            <AdminPageHeader title="Destinations" description="Manage national parks & locations" createHref="/admin/destinations/new" createLabel="Add Destination" />
        <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl border bg-card p-4"><p className="text-sm text-muted-foreground">All destinations</p><p className="text-2xl font-semibold">{data.length}</p></div><div className="rounded-xl border bg-card p-4"><p className="text-sm text-muted-foreground">Published</p><p className="text-2xl font-semibold admin-text-success">{active}</p></div><div className="rounded-xl border bg-card p-4"><p className="text-sm text-muted-foreground">Drafts</p><p className="text-2xl font-semibold admin-text-warning">{data.length-active}</p></div></div>
            <DataTable
                data={data}
                columns={columns}
                searchField={['name','region']}
                searchPlaceholder="Search destinations..."
                editHref={(d) => `/admin/destinations/${d.id}/edit`}
                deleteAction={deleteDestination}
                nameField="name"
                exportCsv
            />
        </div>
    )
}
