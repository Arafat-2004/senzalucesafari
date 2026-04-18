'use client'

import { AdminPageHeader, DataTable } from '../components'
import type { Column } from '../components'
import { deleteSetting } from './actions'
import type { SiteSettings } from '@/generated/prisma/client'

const columns: Column<SiteSettings>[] = [
    { key: 'key', label: 'Key' },
    { key: 'value', label: 'Value', render: (s) => s.value.length > 50 ? s.value.slice(0, 50) + '...' : s.value },
    { key: 'description', label: 'Description', render: (s) => s.description ?? '\u2014' },
]

export default function SettingsClient({ data }: { data: SiteSettings[] }) {
    return (
        <div className="space-y-6">
            <AdminPageHeader title="Site Settings" description="Manage global configuration" createHref="/admin/settings/new" createLabel="Add Setting" />
            <DataTable
                data={data}
                columns={columns}
                searchField="key"
                searchPlaceholder="Search settings..."
                editHref={(s) => `/admin/settings/${s.id}/edit`}
                deleteAction={deleteSetting}
            />
        </div>
    )
}
