'use client';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white dark:bg-bg-dark-card border border-border-light dark:border-border-dark rounded-lg p-6">
          <h3 className="text-sm font-semibold text-text-secondary dark:text-text-light-secondary mb-2">
            Total Bookings
          </h3>
          <p className="text-3xl font-bold text-brand-green dark:text-brand-gold-bright">
            1,234
          </p>
        </div>
        {/* More cards */}
      </div>

      {/* Status Badges */}
      <div className="flex gap-4">
        <span className="px-3 py-1 bg-status-success/10 dark:bg-status-success/20 text-status-success dark:text-status-success-light rounded-full text-sm font-semibold">
          ✓ Active
        </span>
        <span className="px-3 py-1 bg-status-pending/10 dark:bg-status-pending/20 text-status-pending dark:text-brand-gold-bright rounded-full text-sm font-semibold">
          ⏱ Pending
        </span>
        <span className="px-3 py-1 bg-status-error/10 dark:bg-status-error/20 text-status-error dark:text-status-error-light rounded-full text-sm font-semibold">
          ✕ Inactive
        </span>
      </div>
    </div>
  );
}