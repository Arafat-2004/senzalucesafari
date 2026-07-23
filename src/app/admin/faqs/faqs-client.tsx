'use client'

import { AdminPageHeader, DataTable, StatusBadge } from '../components'
import type { Column } from '../components'
import { deleteFAQ } from './actions'

interface FAQRow {
    id: string
    question: string
    answer?: string
    category: string
    displayOrder: number
    isActive: boolean
    viewCount: number
    helpfulCount: number
    notHelpfulCount: number
}

const columns: Column<FAQRow>[] = [
    { key: 'question', label: 'Question', render: (f) => f.question.length > 60 ? f.question.slice(0, 60) + '...' : f.question },
    { key: 'category', label: 'Category' },
    { key: 'displayOrder', label: 'Order' },
    { key: 'isActive', label: 'Status', render: (f) => <StatusBadge active={f.isActive} /> },
    { key: 'viewCount', label: 'Views' },
    { key: 'helpfulCount', label: 'Helpful' },
]

export default function FAQsClient({ data }: { data: FAQRow[] }) {
    const published = data.filter(faq => faq.isActive).length
    const helpfulVotes = data.reduce((total, faq) => total + faq.helpfulCount, 0)
    const unhelpfulVotes = data.reduce((total, faq) => total + faq.notHelpfulCount, 0)
    const totalVotes = helpfulVotes + unhelpfulVotes
    return (
        <div className="space-y-6">
            <AdminPageHeader title="Frequently Asked Questions" description="Give travellers clear answers before they need to contact your team" createHref="/admin/faqs/new" createLabel="Add FAQ" />
        <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl border bg-card p-4"><p className="text-sm text-muted-foreground">Published</p><p className="mt-1 text-2xl font-semibold admin-text-success">{published}</p></div><div className="rounded-xl border bg-card p-4"><p className="text-sm text-muted-foreground">Drafts</p><p className="mt-1 text-2xl font-semibold admin-text-warning">{data.length - published}</p></div><div className="rounded-xl border bg-card p-4"><p className="text-sm text-muted-foreground">Helpful rating</p><p className="mt-1 text-2xl font-semibold">{totalVotes ? `${Math.round(helpfulVotes / totalVotes * 100)}%` : 'No votes yet'}</p></div></div>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm"><span className="font-medium">Content flow:</span> save a draft, review the wording and category, then publish it from the edit page.</div>
            <DataTable
                data={data}
                columns={columns}
                searchField={['question', 'answer', 'category']}
                searchPlaceholder="Search questions, answers, or categories..."
                editHref={(f) => `/admin/faqs/${f.id}/edit`}
                deleteAction={deleteFAQ}
                nameField="question"
                exportCsv
            />
        </div>
    )
}
