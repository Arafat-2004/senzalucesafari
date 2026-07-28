'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { X, Filter } from 'lucide-react'

interface FilterProps {
  users: Array<{ id: string; name: string }>;
  actions: string[];
  entities: string[];
}

export function AuditLogsFilter({ users, actions, entities }: FilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentUser = searchParams.get('user') || ''
  const currentAction = searchParams.get('action') || ''
  const currentEntity = searchParams.get('entity') || ''
  const currentFrom = searchParams.get('from') || ''
  const currentTo = searchParams.get('to') || ''

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/admin/audit-logs?${params.toString()}`)
  }

  const handleClearFilters = () => {
    router.push('/admin/audit-logs')
  }

  const hasActiveFilters = currentUser || currentAction || currentEntity || currentFrom || currentTo

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground sm:mr-2">
        <Filter className="h-4 w-4" />
        <span>Filters</span>
      </div>

      <Select value={currentUser} onValueChange={(val) => handleFilterChange('user', val ?? '')}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="All Users" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Users</SelectItem>
          {users.map(u => (
            <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={currentAction} onValueChange={(val) => handleFilterChange('action', val ?? '')}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="All Actions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Actions</SelectItem>
          {actions.map(a => (
            <SelectItem key={a} value={a}>{a}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={currentEntity} onValueChange={(val) => handleFilterChange('entity', val ?? '')}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="All Entities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Entities</SelectItem>
          {entities.map(e => (
            <SelectItem key={e} value={e}>{e}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <label className="flex w-full items-center gap-2 text-sm text-muted-foreground sm:w-auto">
        From
        <input
          type="date"
          value={currentFrom}
          onChange={(event) => handleFilterChange('from', event.target.value)}
          className="h-10 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm text-foreground sm:w-auto sm:flex-none"
          aria-label="Audit logs from date"
        />
      </label>

      <label className="flex w-full items-center gap-2 text-sm text-muted-foreground sm:w-auto">
        To
        <input
          type="date"
          value={currentTo}
          onChange={(event) => handleFilterChange('to', event.target.value)}
          className="h-10 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm text-foreground sm:w-auto sm:flex-none"
          aria-label="Audit logs to date"
        />
      </label>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-xs">
          <X className="h-4 w-4 mr-1" />
          Clear filters
        </Button>
      )}
    </div>
  )
}
