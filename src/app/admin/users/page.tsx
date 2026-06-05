'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Pencil, Trash2, Search, Plus, Users } from 'lucide-react';

const sampleUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', joined: '2024-01-15' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', joined: '2024-02-20' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Sales', joined: '2024-03-10' },
  { id: '4', name: 'Alice Williams', email: 'alice@example.com', role: 'Viewer', joined: '2024-04-05' },
];

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    Admin: 'bg-brand-green/10 text-brand-green dark:bg-brand-gold/10 dark:text-brand-gold-bright',
    Editor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    Sales: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    Viewer: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  };
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${styles[role] || 'bg-muted text-muted-foreground'}`}>
      {role}
    </span>
  );
}

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const filtered = sampleUsers.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Users
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage team members and permissions
          </p>
        </div>
        <Button variant="default" size="lg" className="w-full sm:w-auto min-h-[44px]">
          <Plus className="h-4 w-4 mr-2" />
          Create New User
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm min-h-[44px]"
        >
          <option value="All">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Editor">Editor</option>
          <option value="Sales">Sales</option>
          <option value="Viewer">Viewer</option>
        </select>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-3 lg:hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No users found</p>
          </div>
        ) : (
          filtered.map(user => (
            <div key={user.id} className="bg-card border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{user.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </div>
                <RoleBadge role={user.role} />
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
                <span>Joined {new Date(user.joined).toLocaleDateString()}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-6 py-4 font-semibold text-foreground text-sm">Name</th>
                <th className="text-left px-6 py-4 font-semibold text-foreground text-sm">Email</th>
                <th className="text-left px-6 py-4 font-semibold text-foreground text-sm">Role</th>
                <th className="text-left px-6 py-4 font-semibold text-foreground text-sm">Joined</th>
                <th className="text-right px-6 py-4 font-semibold text-foreground text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-muted-foreground">
                    <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-lg font-medium">No users found</p>
                  </td>
                </tr>
              ) : (
                filtered.map(user => (
                  <tr key={user.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4"><RoleBadge role={user.role} /></td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(user.joined).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="sm" className="h-9">
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="h-9 text-destructive">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}