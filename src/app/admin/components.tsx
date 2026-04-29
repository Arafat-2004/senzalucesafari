'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Pencil, Trash2, Download, CheckSquare, Square } from 'lucide-react'
import Link from 'next/link'
import { useState, useTransition, useMemo, useCallback, useEffect } from 'react'
import { Pagination } from './components/Pagination'

// ===================== Column Definition =====================

export interface Column<T> {
    key: string
    label: string
    render?: (item: T) => React.ReactNode
}

// ===================== Admin Page Header =====================

export function AdminPageHeader({
    title,
    description,
    createHref,
    createLabel = 'Create new',
}: {
    title: string
    description?: string
    createHref?: string
    createLabel?: string
}) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                {description && <p className="text-muted-foreground text-sm">{description}</p>}
            </div>
            {createHref && (
                <Link href={createHref}>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        {createLabel}
                    </Button>
                </Link>
            )}
        </div>
    )
}

// ===================== Data Table =====================

export function DataTable<T extends { id: string }>({
    data,
    columns,
    editHref,
    deleteAction,
    searchField,
    searchPlaceholder = 'Search...',
    itemsPerPage = 10,
    exportCsv,
}: {
    data: T[]
    columns: Column<T>[]
    editHref?: (item: T) => string
    deleteAction?: (id: string) => Promise<void>
    searchField?: keyof T
    searchPlaceholder?: string
    itemsPerPage?: number
    exportCsv?: boolean
}) {
    const [search, setSearch] = useState('')
    const [isPending, startTransition] = useTransition()

    const filtered = useMemo(() => {
        if (!searchField) return data
        return data.filter((item) => {
            const val = item[searchField]
            return typeof val === 'string' && val.toLowerCase().includes(search.toLowerCase())
        })
    }, [data, searchField, search])

    const handleExportCsv = useCallback(() => {
        if (filtered.length === 0) return
        
        const headers = columns.map(col => col.label).join(',')
        const rows = filtered.map(item => 
            columns.map(col => {
                const val = col.render 
                    ? col.render(item)
                    : (item as Record<string, unknown>)[col.key]
                const str = String(val ?? '').replace(/"/g, '""')
                return str.includes(',') || str.includes('"') || str.includes('\n')
                    ? `"${str}"`
                    : str
            }).join(',')
        ).join('\n')
        
        const csv = `${headers}\n${rows}`
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `export-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }, [filtered, columns])

    const totalPages = Math.ceil(filtered.length / itemsPerPage)
    const [currentPage, setCurrentPage] = useState(1)

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filtered.slice(start, start + itemsPerPage)
    }, [filtered, currentPage, itemsPerPage])

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page)
    }, [])

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        setCurrentPage(1)
    }, [search])
    /* eslint-enable react-hooks/set-state-in-effect */

    function handleDelete(id: string) {
        if (!deleteAction) return
        startTransition(async () => {
            await deleteAction(id)
        })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
                {searchField && (
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                )}
                {exportCsv && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportCsv}
                        disabled={filtered.length === 0}
                        className="shrink-0"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                    </Button>
                )}
            </div>
            <div className="rounded-md border overflow-x-auto [&_table]:min-w-[600px]">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((col) => (
                                <TableHead key={col.key}>{col.label}</TableHead>
                            ))}
                            {(editHref || deleteAction) && <TableHead className="w-[100px]">Actions</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + (editHref || deleteAction ? 1 : 0)} className="text-center text-muted-foreground py-8">
                                    <div className="flex flex-col items-center justify-center py-6">
                                        <Search className="h-10 w-10 text-muted-foreground/30 mb-3" />
                                        <p className="text-lg font-medium">No data available</p>
                                        <p className="text-sm mt-1">There are no records to display at this time.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedData.map((item) => (
                                <TableRow key={item.id}>
                                    {columns.map((col) => (
                                        <TableCell key={col.key}>
                                            {col.render
                                                ? col.render(item)
                                                : String((item as Record<string, unknown>)[col.key] ?? '')}
                                        </TableCell>
                                    ))}
                                    {(editHref || deleteAction) && (
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                {editHref && (
                                                    <Link href={editHref(item)}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </Link>
                                                )}
                                                {deleteAction && (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete this record?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. This will permanently delete this record.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(item.id)}
                                                                    disabled={isPending}
                                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                >
                                                                    {isPending ? 'Deleting...' : 'Delete'}
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filtered.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
            />
        </div>
    )
}

// ===================== Status Badge =====================

export function StatusBadge({ active }: { active: boolean }) {
    return (
        <Badge variant={active ? 'default' : 'secondary'}>
            {active ? 'Active' : 'Inactive'}
        </Badge>
    )
}

export function BoolBadge({ value, trueLabel = 'Yes', falseLabel = 'No' }: { value: boolean; trueLabel?: string; falseLabel?: string }) {
    return (
        <Badge variant={value ? 'default' : 'outline'}>
            {value ? trueLabel : falseLabel}
        </Badge>
    )
}
