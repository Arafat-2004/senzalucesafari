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
    reviewCount: number
}

const columns: Column<GuideRow>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'experience', label: 'Experience' },
    { key: 'languages', label: 'Languages' },
    { key: 'rating', label: 'Rating', render: (g) => g.reviewCount ? `${g.rating.toFixed(1)}/5 (${g.reviewCount})` : 'No reviews' },
    { key: 'isActive', label: 'Status', render: (g) => <StatusBadge active={g.isActive} /> },
]

export default function GuidesClient({ data }: { data: GuideRow[] }) {
    const available = data.filter(guide => guide.isActive).length
    const reviewed = data.filter(guide => guide.reviewCount > 0)
    const averageRating = reviewed.length ? reviewed.reduce((sum, guide) => sum + guide.rating, 0) / reviewed.length : null
    return (
        <div className="space-y-6">
            <AdminPageHeader title="Safari Guides" description="Maintain your guide roster, qualifications, and booking availability" createHref="/admin/guides/new" createLabel="Add Guide" />
        <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl border bg-card p-4"><p className="text-sm text-muted-foreground">All guides</p><p className="mt-1 text-2xl font-semibold">{data.length}</p></div><div className="rounded-xl border bg-card p-4"><p className="text-sm text-muted-foreground">Available</p><p className="mt-1 text-2xl font-semibold admin-text-success">{available}</p></div><div className="rounded-xl border bg-card p-4"><p className="text-sm text-muted-foreground">Average rating</p><p className="mt-1 text-2xl font-semibold">{averageRating === null ? 'No reviews yet' : `${averageRating.toFixed(1)}/5`}</p></div></div>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm"><span className="font-medium">Roster flow:</span> create and review the guide profile, then make the guide available when they can be assigned to bookings.</div>
            <DataTable
                data={data}
                columns={columns}
                searchField={['name', 'email', 'languages']}
                searchPlaceholder="Search name, email, or language..."
                editHref={(g) => `/admin/guides/${g.id}/edit`}
                deleteAction={deleteGuide}
                nameField="name"
                exportCsv
            />
        </div>
    )
}
