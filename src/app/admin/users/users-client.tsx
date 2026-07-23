'use client';

import { useState } from 'react';
import { UserForm, UserFormData } from '@/components/admin/user-form';
import { ROLE_METADATA } from '@/lib/roles';
import { AdminPageHeader, DataTable, StatusBadge } from '../components';
import type { Column } from '../components';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserCog, Users, ShieldAlert, Plus, Power } from 'lucide-react';
import { toast } from 'sonner';

interface AdminUserSummary {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: string;
  isActive?: boolean;
}

export function UsersPageClient({ initialUsers, roles }: { initialUsers: AdminUserSummary[]; roles: Array<{ name: string; displayName: string }> }) {
  const [users, setUsers] = useState<AdminUserSummary[]>(initialUsers);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleCreateUser = async (formData: UserFormData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) {
         throw new Error(data.error || 'Failed to create user');
      }
      
      toast.success('Admin user created successfully');
      setUsers([data.user, ...users]);
      setShowForm(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create user');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user: AdminUserSummary) => {
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !user.isActive })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update user');

      toast.success(`User ${!user.isActive ? 'activated' : 'deactivated'}`);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: !u.isActive } : u));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update user');
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete user');

      toast.success('User removed');
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete user');
    }
  };

  const columns: Column<AdminUserSummary>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (u) => (
        <div>
          <span className="font-semibold text-foreground">{u.firstName} {u.lastName}</span>
          <p className="text-xs text-muted-foreground">{u.email}</p>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      render: (u) => {
        const meta = ROLE_METADATA[u.role as keyof typeof ROLE_METADATA];
        return (
          <Badge className={meta?.color || 'bg-muted text-muted-foreground'}>
            {meta?.label || u.role}
          </Badge>
        );
      }
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (u) => u.phone ? <span className="text-xs text-muted-foreground">{u.phone}</span> : <span className="text-xs text-muted-foreground">-</span>
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (u) => (
        <div className="flex items-center gap-2">
          <StatusBadge active={u.isActive ?? true} />
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs"
            onClick={() => handleToggleStatus(u)}
            title={u.isActive ? 'Deactivate user' : 'Activate user'}
          >
                            <Power className={`h-3.5 w-3.5 ${u.isActive ? 'admin-text-warning' : 'admin-text-success'}`} />
          </Button>
        </div>
      )
    }
  ];

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive ?? true).length;
  const superAdmins = users.filter(u => u.role === 'super_admin').length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Admin Users"
        description="Manage system administration team members, credentials, and access roles."
      />

      {/* Summary KPI Strip */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Admin Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Accounts</CardTitle>
                    <UserCog className="h-4 w-4 admin-text-success" />
          </CardHeader>
          <CardContent>
                    <div className="text-2xl font-bold admin-text-success">{activeUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Super Administrators</CardTitle>
                    <ShieldAlert className="h-4 w-4 admin-text-featured" />
          </CardHeader>
          <CardContent>
                    <div className="text-2xl font-bold admin-text-featured">{superAdmins}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Team Members</h2>
        <Button onClick={() => setShowForm(!showForm)} className="min-h-[40px]">
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? 'Cancel' : 'Create New User'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 border shadow-sm">
          <UserForm onSubmit={handleCreateUser} loading={loading} roles={roles} />
        </Card>
      )}

      <DataTable
        data={users}
        columns={columns}
        searchField="email"
        searchPlaceholder="Search by email or name..."
        deleteAction={handleDeleteUser}
      />
    </div>
  );
}
