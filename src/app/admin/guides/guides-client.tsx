'use client'

import { AdminPageHeader, DataTable, StatusBadge } from '../components'
import type { Column } from '../components'
import { deleteGuide } from './actions'

type GuideRow = {
    id: string
    name: string
    email: string
    experience: string
    languages: string
    rating: number
    isActive: boolean
}

const columns: Column<GuideRow>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'experience', label: 'Experience' },
    { key: 'languages', label: 'Languages' },
    { key: 'rating', label: 'Rating', render: (g) => `${g.rating}/5` },
    { key: 'isActive', label: 'Status', render: (g) => <StatusBadge active={g.isActive} /> },
]

export default function GuidesClient({ data }: { data: GuideRow[] }) {
    return (
        <div className="space-y-6">
            <AdminPageHeader title="Guides" description="Manage safari guides" createHref="/admin/guides/new" createLabel="Add Guide" />
            <DataTable
                data={data}
                columns={columns}
                searchField="name"
                searchPlaceholder="Search guides..."
                editHref={(g) => `/admin/guides/${g.id}/edit`}
                deleteAction={deleteGuide}
            />
        </div>
    )
}
