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
import { Plus, Search, Pencil, Trash2, Download, CheckSquare, Square, ImageIcon, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { showToast } from '@/lib/ui/toast'
import Link from 'next/link'
import { useState, useTransition, useMemo, useCallback, useEffect, useRef } from 'react'
import { useHotkey } from '@/hooks/use-hotkey'
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
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h2>
                {description && <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{description}</p>}
            </div>
            {createHref && (
                <Link href={createHref} className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto min-h-[44px]">
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
    nameField,
    thumbnailField,
}: {
    data: T[]
    columns: Column<T>[]
    editHref?: (item: T) => string
    deleteAction?: (id: string) => Promise<void>
    searchField?: keyof T | (keyof T)[]
    searchPlaceholder?: string
    itemsPerPage?: number
    exportCsv?: boolean
    nameField?: keyof T
    thumbnailField?: keyof T
}) {
    const [search, setSearch] = useState('')
    const [sortKey, setSortKey] = useState<string | null>(null)
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
    const [isPending, startTransition] = useTransition()
    const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set())
    const searchRef = useRef<HTMLInputElement>(null)

    useHotkey([
        {
            key: "f",
            ctrl: true,
            handler: () => searchRef.current?.focus(),
            enabled: !!searchField,
        },
        {
            key: "Escape",
            handler: () => {
                if (search) setSearch('')
                searchRef.current?.blur()
            },
            enabled: !!searchField,
        },
    ])

    function handleSort(key: string) {
        if (sortKey === key) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        } else {
            setSortKey(key)
            setSortDir('asc')
        }
    }

    const searchFields = Array.isArray(searchField) ? searchField : (searchField ? [searchField] : [])

    const filtered = useMemo(() => {
        let result = data.filter((item) => !deletedIds.has(item.id))

        if (searchFields.length > 0 && search) {
            const q = search.toLowerCase()
            result = result.filter((item) =>
                searchFields.some((field) => {
                    const val = item[field]
                    return typeof val === 'string' && val.toLowerCase().includes(q)
                })
            )
        }

        if (sortKey) {
            result = [...result].sort((a, b) => {
                const aVal = (a as Record<string, unknown>)[sortKey]
                const bVal = (b as Record<string, unknown>)[sortKey]
                const aNum = Number(aVal), bNum = Number(bVal)
                if (!isNaN(aNum) && !isNaN(bNum)) {
                    return sortDir === 'asc' ? aNum - bNum : bNum - aNum
                }
                const aStr = String(aVal ?? ''), bStr = String(bVal ?? '')
                const cmp = aStr.localeCompare(bStr)
                return sortDir === 'asc' ? cmp : -cmp
            })
        }

        return result
    }, [data, searchFields, search, sortKey, sortDir, deletedIds])

    function extractText(val: unknown): string {
        if (val === null || val === undefined) return ''
        if (typeof val === 'string') return val
        if (typeof val === 'number' || typeof val === 'boolean') return String(val)
        if (typeof val === 'object' && 'props' in (val as Record<string, unknown>)) {
            const el = val as { props?: { children?: unknown } }
            if (el.props?.children) {
                if (typeof el.props.children === 'string') return el.props.children
                if (Array.isArray(el.props.children)) {
                    return el.props.children.map(c => extractText(c)).join(' ')
                }
                return extractText(el.props.children)
            }
        }
        return String(val)
    }

    const handleExportCsv = useCallback(() => {
        if (filtered.length === 0) return
        
        const headers = columns.map(col => col.label).join(',')
        const rows = filtered.map(item => 
            columns.map(col => {
                const val = col.render 
                    ? col.render(item)
                    : (item as Record<string, unknown>)[col.key]
                const str = extractText(val).replace(/"/g, '""')
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

    function getItemName(item: T): string {
        if (nameField) {
            const val = item[nameField]
            return typeof val === 'string' ? val : 'this record'
        }
        return 'this record'
    }

    function handleDelete(id: string) {
        if (!deleteAction) return
        startTransition(async () => {
            try {
                await deleteAction(id)
                setDeletedIds(prev => new Set(prev).add(id))
                showToast('Record deleted successfully', { type: 'success' })
            } catch {
                showToast('Failed to delete record', { type: 'error' })
            }
        })
    }

    function getThumbUrl(item: T): string | null {
        if (!thumbnailField) return null
        const val = item[thumbnailField]
        return typeof val === 'string' && val ? val : null
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
                {searchField && (
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            ref={searchRef}
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
            {/* Desktop Table View */}
            <div className="hidden md:block rounded-md border overflow-x-auto [&_table]:min-w-[600px]">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {thumbnailField && <TableHead className="w-[60px]">Image</TableHead>}
                            {columns.map((col) => (
                                <TableHead key={col.key}>
                                    <button
                                        onClick={() => handleSort(col.key)}
                                        className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {col.label}
                                        {sortKey === col.key ? (
                                            sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                                        ) : (
                                            <ArrowUpDown className="w-3 h-3 opacity-30" />
                                        )}
                                    </button>
                                </TableHead>
                            ))}
                            {(editHref || deleteAction) && <TableHead className="w-[100px]">Actions</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + (thumbnailField ? 1 : 0) + (editHref || deleteAction ? 1 : 0)} className="text-center text-muted-foreground py-8">
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
                                    {thumbnailField && (
                                        <TableCell>
                                            <div className="w-10 h-10 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                                                {getThumbUrl(item) ? (
                                                    <img
                                                        src={getThumbUrl(item)!}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                            (e.target as HTMLImageElement).parentElement!.classList.add('flex');
                                                        }}
                                                    />
                                                ) : (
                                                    <ImageIcon className="w-4 h-4 text-muted-foreground/50" />
                                                )}
                                            </div>
                                        </TableCell>
                                    )}
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
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Edit ${getItemName(item)}`}>
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </Link>
                                                )}
                                                {deleteAction && (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" aria-label={`Delete ${getItemName(item)}`}>
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete {getItemName(item)}?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. This will permanently delete &ldquo;{getItemName(item)}&rdquo;.
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

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
                {paginatedData.length === 0 ? (
                    <div className="text-center py-12">
                        <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-lg font-medium">No data available</p>
                        <p className="text-sm text-muted-foreground mt-1">There are no records to display at this time.</p>
                    </div>
                ) : (
                    paginatedData.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4 space-y-3 bg-card">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 space-y-1.5">
                                    {columns.slice(0, 2).map((col) => (
                                        <div key={col.key} className="text-sm">
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider mr-2">{col.label}:</span>
                                            <span className="font-medium">
                                                {col.render
                                                    ? col.render(item)
                                                    : String((item as Record<string, unknown>)[col.key] ?? '')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                {(editHref || deleteAction) && (
                                    <div className="flex items-center gap-1 shrink-0">
                                        {editHref && (
                                            <Link href={editHref(item)}>
                                                <Button variant="ghost" size="icon" className="h-10 w-10">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        )}
                                        {deleteAction && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-destructive hover:text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete {getItemName(item)}?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone.
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
                                )}
                            </div>
                            {columns.slice(2).map((col) => (
                                <div key={col.key} className="text-sm flex items-center justify-between border-t border-border/50 pt-2.5 mt-1">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{col.label}</span>
                                    <span className="font-medium text-right">
                                        {col.render
                                            ? col.render(item)
                                            : String((item as Record<string, unknown>)[col.key] ?? '')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))
                )}
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
