'use client'

import { AdminPageHeader, DataTable, StatusBadge } from '../components'
import type { Column } from '../components'
import { deleteTeamMember } from './actions'
import Image from 'next/image'

type TeamRow = {
    id: string
    name: string
    role: string
    displayOrder: number
    isVisible: boolean
    hasPhoto: boolean
}

const columns: Column<TeamRow>[] = [
    {
        key: 'name',
        label: 'Name',
        render: (m) => (
            <div className="flex items-center gap-3">
                {m.hasPhoto ? (
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-muted shrink-0">
                        <div className="h-full w-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {m.name.charAt(0)}
                        </div>
                    </div>
                ) : (
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                        {m.name.charAt(0)}
                    </div>
                )}
                <span className="font-medium">{m.name}</span>
            </div>
        )
    },
    { key: 'role', label: 'Role / Title' },
    { key: 'displayOrder', label: 'Order' },
    {
        key: 'hasPhoto',
        label: 'Photo',
        render: (m) => (
            <span className={`text-xs font-medium ${m.hasPhoto ? 'text-green-600' : 'text-muted-foreground'}`}>
                {m.hasPhoto ? '✓ Uploaded' : '— None'}
            </span>
        )
    },
    { key: 'isVisible', label: 'Visible', render: (m) => <StatusBadge active={m.isVisible} /> },
]

export default function TeamClient({ data }: { data: TeamRow[] }) {
    const visible = data.filter(m => m.isVisible).length
    const withPhoto = data.filter(m => m.hasPhoto).length

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="About Page — Team"
                description="Manage the company leadership shown on the public About page"
                createHref="/admin/team/new"
                createLabel="Add Team Member"
            />

            <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Total members</p>
                    <p className="mt-1 text-2xl font-semibold">{data.length}</p>
                </div>
                <div className="rounded-xl border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Visible on site</p>
                    <p className="mt-1 text-2xl font-semibold admin-text-success">{visible}</p>
                </div>
                <div className="rounded-xl border bg-card p-4">
                    <p className="text-sm text-muted-foreground">With photo</p>
                    <p className="mt-1 text-2xl font-semibold">{withPhoto}</p>
                </div>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
                <span className="font-medium">Tip:</span> Team members are shown on the public{' '}
                <a href="/about" target="_blank" className="text-primary underline-offset-2 hover:underline">/about</a>{' '}
                page in ascending display order. Upload a real photo for each member for the best impression.
            </div>

            <DataTable
                data={data}
                columns={columns}
                searchField={['name', 'role']}
                searchPlaceholder="Search by name or role..."
                editHref={(m) => `/admin/team/${m.id}/edit`}
                deleteAction={deleteTeamMember}
                nameField="name"
            />
        </div>
    )
}
