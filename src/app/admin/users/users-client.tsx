'use client';

import { useState } from 'react';
import { UserForm, UserFormData } from '@/components/admin/user-form';
import { ROLE_METADATA } from '@/lib/roles';

interface AdminUserSummary {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: string;
  isActive?: boolean;
}

export function UsersPageClient({ initialUsers }: { initialUsers: AdminUserSummary[] }) {
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

      if (!response.ok) {
         const data = await response.json();
         throw new Error(data.error || 'Failed to create user');
      }
      
      const newUser = await response.json();
      setUsers([newUser.user, ...users]);
      setShowForm(false);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold"
        >
          {showForm ? 'Cancel' : 'Create New User'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border shadow-sm">
          <h2 className="text-xl font-bold mb-4">Create New User</h2>
          <UserForm onSubmit={handleCreateUser} loading={loading} />
        </div>
      )}

      <div className="space-y-4">
        {users.length === 0 ? (
          <p className="text-gray-500">No users yet</p>
        ) : (
          users.map(u => (
            <div key={u.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between border shadow-sm">
              <div>
                <h3 className="font-semibold">{u.firstName} {u.lastName}</h3>
                <p className="text-sm text-gray-500">{u.email}</p>
                {u.phone && <p className="text-sm text-gray-500">{u.phone}</p>}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${ROLE_METADATA[u.role as keyof typeof ROLE_METADATA]?.color || 'bg-gray-100 text-gray-800'}`}>
                {ROLE_METADATA[u.role as keyof typeof ROLE_METADATA]?.label || u.role}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}