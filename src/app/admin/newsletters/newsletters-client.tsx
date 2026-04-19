'use client'

import { AdminPageHeader, DataTable, StatusBadge } from '../components'
import type { Column } from '../components'
import { deleteNewsletter } from './actions'

type NewsletterRow = {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    country: string | null
    interests: string | null
    isActive: boolean
    subscribedAt: string
}

const columns: Column<NewsletterRow>[] = [
    { key: 'email', label: 'Email' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'country', label: 'Country' },
    { key: 'interests', label: 'Interests' },
    { key: 'isActive', label: 'Status', render: (n) => <StatusBadge active={n.isActive} /> },
    { key: 'subscribedAt', label: 'Subscribed' },
]

export default function NewslettersClient({ data }: { data: NewsletterRow[] }) {
    return (
        <div className="space-y-6">
            <AdminPageHeader title="Newsletter Subscribers" description="Manage newsletter subscriptions" />
            <DataTable
                data={data}
                columns={columns}
                searchField="email"
                searchPlaceholder="Search by email..."
                editHref={(n) => `/admin/newsletters/${n.id}/edit`}
                deleteAction={deleteNewsletter}
            />
        </div>
    )
}
