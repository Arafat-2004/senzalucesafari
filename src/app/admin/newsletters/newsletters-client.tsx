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
    const active = data.filter(subscriber => subscriber.isActive).length
    const unsubscribed = data.length - active
    return (
        <div className="space-y-6">
            <AdminPageHeader title="Newsletter Subscribers" description="Review the people who asked to receive travel news and updates" />
            <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border bg-card p-4"><p className="text-sm text-muted-foreground">All subscribers</p><p className="mt-1 text-2xl font-semibold">{data.length}</p></div>
            <div className="rounded-xl border bg-card p-4"><p className="text-sm text-muted-foreground">Active consent</p><p className="mt-1 text-2xl font-semibold admin-text-success">{active}</p></div>
                <div className="rounded-xl border bg-card p-4"><p className="text-sm text-muted-foreground">Unsubscribed</p><p className="mt-1 text-2xl font-semibold text-muted-foreground">{unsubscribed}</p></div>
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
                This page manages subscription consent and contact details. Campaign emails are sent through your external email service, not from this dashboard.
            </div>
            <DataTable
                data={data}
                columns={columns}
                searchField={['email', 'firstName', 'lastName', 'country', 'interests']}
                searchPlaceholder="Search email, name, country, or interests..."
                editHref={(n) => `/admin/newsletters/${n.id}/edit`}
                deleteAction={deleteNewsletter}
                nameField="email"
                exportCsv
            />
        </div>
    )
}
