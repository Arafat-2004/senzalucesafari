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
    return (
        <div className="space-y-6">
            <AdminPageHeader title="Vehicles" description="Manage safari vehicles" createHref="/admin/vehicles/new" createLabel="Add Vehicle" />
            <DataTable
                data={data}
                columns={columns}
                searchField="name"
                searchPlaceholder="Search vehicles..."
                editHref={(v) => `/admin/vehicles/${v.id}/edit`}
                deleteAction={deleteVehicle}
            />
        </div>
    )
}
