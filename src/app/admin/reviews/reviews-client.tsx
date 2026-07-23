'use client'

import { AdminPageHeader, DataTable, BoolBadge } from '../components'
import type { Column } from '../components'
import { deleteReview } from './actions'
import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BadgeCheck, CheckCircle2, Clock3, Megaphone, ShieldCheck, XCircle } from 'lucide-react'

type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

type ReviewWithTour = {
    id: string
    customerName: string
    title: string
    rating: number
    tourName: string
    status: ReviewStatus
    isFeatured: boolean
    verified: boolean
}

const columns: Column<ReviewWithTour>[] = [
    { key: 'customerName', label: 'Customer' },
    { key: 'title', label: 'Title' },
    { key: 'rating', label: 'Rating', render: (r) => `${r.rating}/5` },
    { key: 'tourName', label: 'Tour' },
    {
        key: 'status',
        label: 'Status',
        render: (review) => (
            <Badge variant={review.status === 'APPROVED' ? 'success' : review.status === 'REJECTED' ? 'danger' : 'warning'}>
                {review.status === 'APPROVED' ? 'Published' : review.status === 'REJECTED' ? 'Rejected' : 'Pending'}
            </Badge>
        ),
    },
    { key: 'verified', label: 'Verified', render: (r) => <BoolBadge value={r.verified} trueLabel="Verified" falseLabel="Unverified" /> },
    { key: 'isFeatured', label: 'Featured', render: (r) => <BoolBadge value={r.isFeatured} /> },
]

export default function ReviewsClient({ data }: { data: ReviewWithTour[] }) {
    const [statusFilter, setStatusFilter] = useState<'ALL' | ReviewStatus>('ALL')
    const counts = useMemo(() => ({
        ALL: data.length,
        PENDING: data.filter(review => review.status === 'PENDING').length,
        APPROVED: data.filter(review => review.status === 'APPROVED').length,
        REJECTED: data.filter(review => review.status === 'REJECTED').length,
    }), [data])
    const filteredData = statusFilter === 'ALL' ? data : data.filter(review => review.status === statusFilter)

    return (
        <div className="space-y-6">
            <AdminPageHeader title="Reviews" description="Verify genuine customer feedback, control publication, and choose the strongest testimonials to feature." createHref="/admin/reviews/new" createLabel="Add Review" />

            <section className="grid gap-3 rounded-xl border bg-card p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4" aria-label="Review workflow">
                <div className="flex gap-3">
                    <Clock3 className="mt-0.5 h-5 w-5 admin-text-warning" />
                    <div><p className="text-sm font-medium">1. Pending</p><p className="text-xs text-muted-foreground">Read and check the submission.</p></div>
                </div>
                <div className="flex gap-3">
                    <BadgeCheck className="mt-0.5 h-5 w-5 admin-text-info" />
                    <div><p className="text-sm font-medium">2. Verify</p><p className="text-xs text-muted-foreground">Match it to a real traveler.</p></div>
                </div>
                <div className="flex gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 admin-text-success" />
                    <div><p className="text-sm font-medium">3. Publish</p><p className="text-xs text-muted-foreground">Approval makes it public.</p></div>
                </div>
                <div className="flex gap-3">
                    <Megaphone className="mt-0.5 h-5 w-5 admin-text-featured" />
                    <div><p className="text-sm font-medium">4. Feature</p><p className="text-xs text-muted-foreground">Promote an approved review.</p></div>
                </div>
            </section>

            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter reviews by status">
                {([
                    ['ALL', 'All', CheckCircle2],
                    ['PENDING', 'Pending', Clock3],
                    ['APPROVED', 'Published', ShieldCheck],
                    ['REJECTED', 'Rejected', XCircle],
                ] as const).map(([value, label, Icon]) => (
                    <Button key={value} type="button" size="sm" variant={statusFilter === value ? 'default' : 'outline'} onClick={() => setStatusFilter(value)}>
                        <Icon className="h-4 w-4" /> {label} <span className="ml-1 opacity-70">{counts[value]}</span>
                    </Button>
                ))}
            </div>
            <DataTable
                data={filteredData}
                columns={columns}
                searchField={['customerName', 'title', 'tourName']}
                searchPlaceholder="Search customer, title, or safari..."
                editHref={(r) => `/admin/reviews/${r.id}/edit`}
                deleteAction={deleteReview}
                exportCsv
                nameField="title"
            />
        </div>
    )
}
