'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-neutral-dark dark:text-neutral-light">
          Users
        </h1>
        <Button variant="primary">Create New User</Button>
      </div>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark">
                <th className="text-left py-4 px-6 font-semibold text-neutral-dark dark:text-neutral-light">
                  Name
                </th>
                <th className="text-left py-4 px-6 font-semibold text-neutral-dark dark:text-neutral-light">
                  Email
                </th>
                <th className="text-left py-4 px-6 font-semibold text-neutral-dark dark:text-neutral-light">
                  Role
                </th>
                <th className="text-right py-4 px-6 font-semibold text-neutral-dark dark:text-neutral-light">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Users rows */}
              <tr className="border-b border-border-light dark:border-border-dark hover:bg-neutral-light dark:hover:bg-bg-dark-light transition-colors">
                <td className="py-4 px-6 text-neutral-dark dark:text-neutral-light">
                  John Doe
                </td>
                <td className="py-4 px-6 text-text-secondary dark:text-text-light-secondary">
                  john@example.com
                </td>
                <td className="py-4 px-6">
                  <span className="px-2 py-1 bg-brand-green/10 dark:bg-brand-gold/10 text-brand-green dark:text-brand-gold-bright rounded text-sm font-semibold">
                    Admin
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <Button variant="secondary" size="sm">
                    Edit
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}