'use client'

import { AdminPageHeader, DataTable, BoolBadge } from '../components'
import type { Column } from '../components'
import { deleteInquiry } from './actions'

type InquiryRow = {
    id: string
    name: string
    email: string
    subject: string
    inquiryType: string
    isRead: boolean
    isReplied: boolean
    createdAt: string
}

const columns: Column<InquiryRow>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'subject', label: 'Subject' },
    { key: 'inquiryType', label: 'Type', render: (i) => i.inquiryType.replace(/_/g, ' ') },
    { key: 'isRead', label: 'Read', render: (i) => <BoolBadge value={i.isRead} trueLabel="Read" falseLabel="Unread" /> },
    { key: 'isReplied', label: 'Replied', render: (i) => <BoolBadge value={i.isReplied} trueLabel="Replied" falseLabel="Pending" /> },
    { key: 'createdAt', label: 'Date' },
]

export default function InquiriesClient({ data }: { data: InquiryRow[] }) {
    return (
        <div className="space-y-6">
            <AdminPageHeader title="Contact Inquiries" description="Manage customer inquiries" />
            <DataTable
                data={data}
                columns={columns}
                searchField="name"
                searchPlaceholder="Search inquiries..."
                editHref={(i) => `/admin/inquiries/${i.id}/edit`}
                deleteAction={deleteInquiry}
            />
        </div>
    )
}
