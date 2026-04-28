'use client'

import { AdminPageHeader, DataTable, BoolBadge } from '../components'
import type { Column } from '../components'
import { deleteInquiry } from './actions'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

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
    const [exporting, setExporting] = useState(false)

    const handleExport = async () => {
        setExporting(true)
        try {
            const response = await fetch('/api/admin/export/inquiries')
            if (!response.ok) throw new Error('Export failed')
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            const disposition = response.headers.get('Content-Disposition')
            const filename = disposition?.split('filename="')[1]?.split('"')[0] || 'inquiries.csv'
            a.download = filename
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            toast.success('Inquiries exported successfully')
        } catch {
            toast.error('Failed to export inquiries')
        } finally {
            setExporting(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <AdminPageHeader title="Contact Inquiries" description="Manage customer inquiries" />
                <Button variant="outline" onClick={handleExport} disabled={exporting}>
                    {exporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                    Export CSV
                </Button>
            </div>
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
