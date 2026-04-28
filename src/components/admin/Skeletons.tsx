'use client';

/**
 * Reusable loading skeleton components for admin pages
 */

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-md border overflow-hidden">
      {/* Header */}
      <div className="bg-muted/50 px-4 py-3 border-b">
        <div className="flex gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 w-24 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
      {/* Rows */}
      <div className="divide-y">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="px-4 py-3 flex gap-4">
            {[...Array(5)].map((_, j) => (
              <div key={j} className="h-4 flex-1 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="h-12 w-12 bg-muted animate-pulse rounded-lg" />
        <div className="h-5 w-16 bg-muted animate-pulse rounded-full" />
      </div>
      <div className="h-4 w-24 bg-muted animate-pulse rounded mb-2" />
      <div className="h-8 w-32 bg-muted animate-pulse rounded mb-1" />
      <div className="h-3 w-20 bg-muted animate-pulse rounded" />
    </div>
  );
}

export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="h-6 w-48 bg-muted animate-pulse rounded mb-4" />
      <div
        className="w-full bg-muted animate-pulse rounded"
        style={{ height: `${height}px` }}
      />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="h-8 w-48 bg-muted animate-pulse rounded" />
      {/* Metric Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      {/* Table */}
      <TableSkeleton rows={5} />
    </div>
  );
}
