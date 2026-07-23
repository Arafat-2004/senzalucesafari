'use client'

import { AdminPageHeader, DataTable, BoolBadge } from '../components'
import type { Column } from '../components'
import { deleteInquiry, markAsRead } from './actions'
import { Button } from '@/components/ui/button'
import { Download, Loader2, Check, Mail, MessageSquare, Globe, Tent, Clock, MailCheck } from 'lucide-react'
import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'

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

export default function InquiriesClient({ data, dataUnavailable = false }: { data: InquiryRow[]; dataUnavailable?: boolean }) {
    const [exporting, setExporting] = useState(false)
    const [activeTab, setActiveTab] = useState('all')
    const router = useRouter()

    const handleMarkRead = async (id: string) => {
        try {
            await markAsRead(id)
            toast.success('Inquiry marked as read')
            router.refresh()
        } catch {
            toast.error('Failed to mark inquiry as read')
        }
    }

    const columns: Column<InquiryRow>[] = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'subject', label: 'Subject' },
        { key: 'inquiryType', label: 'Type', render: (i) => i.inquiryType.replace(/_/g, ' ') },
        { 
            key: 'isRead', 
            label: 'Read', 
            render: (i) => (
                <div className="flex items-center gap-2">
                    <BoolBadge value={i.isRead} trueLabel="Read" falseLabel="Unread" />
                    {!i.isRead && (
                        <Button 
                            variant="ghost" 
                            className="h-6 px-1.5 text-xs text-brand-green hover:bg-brand-green/10"
                            onClick={() => handleMarkRead(i.id)}
                        >
                            <Check className="h-3 w-3 mr-1" />
                            Mark Read
                        </Button>
                    )}
                </div>
            )
        },
        { key: 'isReplied', label: 'Replied', render: (i) => <BoolBadge value={i.isReplied} trueLabel="Replied" falseLabel="Pending" /> },
        { 
            key: 'createdAt', 
            label: 'Date',
            render: (i) => format(new Date(i.createdAt), 'MMM d, yyyy')
        },
    ]

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

    const filteredData = useMemo(() => {
        return data.filter(item => {
            if (activeTab === 'unread') return !item.isRead;
            if (activeTab === 'tour') return item.inquiryType === 'TOUR_INQUIRY';
            if (activeTab === 'custom') return item.inquiryType === 'CUSTOM_SAFARI';
            if (activeTab === 'replied') return item.isReplied;
            if (activeTab === 'pending') return !item.isReplied;
            return true;
        });
    }, [data, activeTab]);

    return (
        <div className="space-y-6">
            {dataUnavailable && <div role="status" className="admin-tone-warning rounded-xl border p-4 text-sm">Inquiries are temporarily unavailable while the database reconnects. Refresh this page shortly; no messages were lost.</div>}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <AdminPageHeader title="Contact Inquiries" description="Manage customer inquiries" />
                <Button variant="outline" onClick={handleExport} disabled={exporting}>
                    {exporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                    Export CSV
                </Button>
            </div>

            {/* Filter chip bar */}
            <div className="flex items-center gap-2 flex-wrap">
                {([
                    { value: 'all',     label: 'All',          icon: Mail,      count: data.length },
                    { value: 'unread',  label: 'Unread',       icon: MessageSquare, count: data.filter(i => !i.isRead).length },
                    { value: 'tour',    label: 'Tour Interest', icon: Globe,     count: data.filter(i => i.inquiryType === 'TOUR_INQUIRY').length },
                    { value: 'custom',  label: 'Custom Safari', icon: Tent,      count: data.filter(i => i.inquiryType === 'CUSTOM_SAFARI').length },
                    { value: 'replied', label: 'Replied',       icon: MailCheck, count: data.filter(i => i.isReplied).length },
                    { value: 'pending', label: 'Pending Reply', icon: Clock,     count: data.filter(i => !i.isReplied).length },
                ] as const).map(({ value, label, icon: Icon, count }) => (
                    <button
                        key={value}
                        onClick={() => setActiveTab(value)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-150 border ${
                            activeTab === value
                                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground hover:bg-muted/50'
                        }`}
                    >
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        {label}
                        <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[11px] font-bold px-1 ${
                            activeTab === value ? 'bg-white/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                            {count}
                        </span>
                    </button>
                ))}
            </div>

            <DataTable
                data={filteredData}
                columns={columns}
                searchField="name"
                searchPlaceholder="Search inquiries..."
                editHref={(i) => `/admin/inquiries/${i.id}/edit`}
                deleteAction={deleteInquiry}
            />
        </div>
    )
}
