'use client'

import { AdminPageHeader, DataTable, StatusBadge } from '../components'
import type { Column } from '../components'
import { deleteVehicle } from './actions'

interface VehicleRow {
    id: string
    name: string
    category: string
    capacity: string
    priceRange: string
    rating: number
    isActive: boolean
}

const columns: Column<VehicleRow>[] = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'capacity', label: 'Capacity' },
    { key: 'priceRange', label: 'Price Range' },
    { key: 'rating', label: 'Rating', render: (v) => v.rating > 0 ? `${v.rating}/5` : '-' },
    { key: 'isActive', label: 'Status', render: (v) => <StatusBadge active={v.isActive} /> },
]

export default function VehiclesClient({ data }: { data: VehicleRow[] }) {
    const available=data.filter(item=>item.isActive).length
    return (
        <div className="space-y-6">
            <AdminPageHeader title="Vehicles" description="Manage safari vehicles" createHref="/admin/vehicles/new" createLabel="Add Vehicle" />
        <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl border bg-card p-4">Fleet size<div className="text-2xl font-semibold">{data.length}</div></div><div className="rounded-xl border bg-card p-4">Available<div className="text-2xl font-semibold admin-text-success">{available}</div></div><div className="rounded-xl border bg-card p-4">Unavailable<div className="text-2xl font-semibold admin-text-warning">{data.length-available}</div></div></div>
            <DataTable
                data={data}
                columns={columns}
                searchField={['name','category','capacity']}
                searchPlaceholder="Search vehicles..."
                editHref={(v) => `/admin/vehicles/${v.id}/edit`}
                deleteAction={deleteVehicle}
                nameField="name"
                exportCsv
            />
        </div>
    )
}
