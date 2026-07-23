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
    updatedAt: string
}

const columns: Column<BlogRow>[] = [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
    { key: 'author', label: 'Author' },
    { key: 'readingTime', label: 'Read Time', render: (p) => `${p.readingTime} min` },
    { key: 'isPublished', label: 'Status', render: (p) => <BoolBadge value={p.isPublished} trueLabel="Published" falseLabel="Draft" /> },
    { key: 'views', label: 'Views' },
    { key: 'updatedAt', label: 'Last updated' },
]

export default function BlogClient({ data }: { data: BlogRow[] }) {
    const published = data.filter(post => post.isPublished).length
    const drafts = data.length - published
    return (
        <div className="space-y-6">
            <AdminPageHeader title="Blog Posts" description="Write, review, and publish helpful stories for your customers" createHref="/admin/blog/new" createLabel="New Post" />
            <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border bg-card p-4"><p className="text-sm text-muted-foreground">All posts</p><p className="mt-1 text-2xl font-semibold">{data.length}</p></div>
            <div className="rounded-xl border bg-card p-4"><p className="text-sm text-muted-foreground">Published</p><p className="mt-1 text-2xl font-semibold admin-text-success">{published}</p></div>
            <div className="rounded-xl border bg-card p-4"><p className="text-sm text-muted-foreground">Drafts to review</p><p className="mt-1 text-2xl font-semibold admin-text-warning">{drafts}</p></div>
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
                <span className="font-medium">Editorial flow:</span> create a draft, check the content and image, then publish from the edit page. Editing never changes publication status accidentally.
            </div>
            <DataTable
                data={data}
                columns={columns}
                searchField={['title', 'category', 'author']}
                searchPlaceholder="Search title, category, or author..."
                editHref={(p) => `/admin/blog/${p.id}/edit`}
                deleteAction={deleteBlogPost}
                nameField="title"
                exportCsv
            />
        </div>
    )
}
