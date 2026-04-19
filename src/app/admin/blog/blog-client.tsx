'use client'

import { AdminPageHeader, DataTable, BoolBadge } from '../components'
import type { Column } from '../components'
import { deleteBlogPost } from './actions'

interface BlogRow {
    id: string
    title: string
    slug: string
    category: string
    author: string
    readingTime: number
    isPublished: boolean
    views: number
}

const columns: Column<BlogRow>[] = [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
    { key: 'author', label: 'Author' },
    { key: 'readingTime', label: 'Read Time', render: (p) => `${p.readingTime} min` },
    { key: 'isPublished', label: 'Status', render: (p) => <BoolBadge value={p.isPublished} trueLabel="Published" falseLabel="Draft" /> },
    { key: 'views', label: 'Views' },
]

export default function BlogClient({ data }: { data: BlogRow[] }) {
    return (
        <div className="space-y-6">
            <AdminPageHeader title="Blog Posts" description="Manage blog content" createHref="/admin/blog/new" createLabel="New Post" />
            <DataTable
                data={data}
                columns={columns}
                searchField="title"
                searchPlaceholder="Search posts..."
                editHref={(p) => `/admin/blog/${p.id}/edit`}
                deleteAction={deleteBlogPost}
            />
        </div>
    )
}
