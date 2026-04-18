'use client'

import { AdminPageHeader, DataTable, BoolBadge } from '../components'
import type { Column } from '../components'
import { deleteReview } from './actions'

type ReviewWithTour = {
    id: string
    customerName: string
    title: string
    rating: number
    tourName: string
    isApproved: boolean
    isFeatured: boolean
    verified: boolean
}

const columns: Column<ReviewWithTour>[] = [
    { key: 'customerName', label: 'Customer' },
    { key: 'title', label: 'Title' },
    { key: 'rating', label: 'Rating', render: (r) => `${r.rating}/5` },
    { key: 'tourName', label: 'Tour' },
    { key: 'isApproved', label: 'Approved', render: (r) => <BoolBadge value={r.isApproved} trueLabel="Approved" falseLabel="Pending" /> },
    { key: 'verified', label: 'Verified', render: (r) => <BoolBadge value={r.verified} trueLabel="Verified" falseLabel="Unverified" /> },
    { key: 'isFeatured', label: 'Featured', render: (r) => <BoolBadge value={r.isFeatured} /> },
]

export default function ReviewsClient({ data }: { data: ReviewWithTour[] }) {
    return (
        <div className="space-y-6">
            <AdminPageHeader title="Reviews" description="Moderate customer reviews" createHref="/admin/reviews/new" createLabel="Add Review" />
            <DataTable
                data={data}
                columns={columns}
                searchField="customerName"
                searchPlaceholder="Search by customer..."
                editHref={(r) => `/admin/reviews/${r.id}/edit`}
                deleteAction={deleteReview}
            />
        </div>
    )
}
