'use client'

import { AdminPageHeader, DataTable, StatusBadge } from '../components'
import type { Column } from '../components'
import { deleteFAQ } from './actions'
import type { FAQ } from '@/generated/prisma/client'

const columns: Column<FAQ>[] = [
    { key: 'question', label: 'Question', render: (f) => f.question.length > 60 ? f.question.slice(0, 60) + '...' : f.question },
    { key: 'category', label: 'Category' },
    { key: 'displayOrder', label: 'Order' },
    { key: 'isActive', label: 'Status', render: (f) => <StatusBadge active={f.isActive} /> },
]

export default function FAQsClient({ data }: { data: FAQ[] }) {
    return (
        <div className="space-y-6">
            <AdminPageHeader title="FAQs" description="Manage frequently asked questions" createHref="/admin/faqs/new" createLabel="Add FAQ" />
            <DataTable
                data={data}
                columns={columns}
                searchField="question"
                searchPlaceholder="Search FAQs..."
                editHref={(f) => `/admin/faqs/${f.id}/edit`}
                deleteAction={deleteFAQ}
            />
        </div>
    )
}
