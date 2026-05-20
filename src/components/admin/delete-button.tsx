'use client';

import { canDelete } from '@/lib/rbac';
import { Trash2 } from 'lucide-react';

interface DeleteButtonProps {
  module: string;
  resourceId: string;
  onConfirm: () => Promise<void>;
  userRole: any; // Passed from parent
}

export function DeleteButton({ module, resourceId, onConfirm, userRole }: DeleteButtonProps) {
  const user = {
    id: 'unknown',
    email: '',
    role: userRole,
    name: '',
    isActive: true
  };

  if (!canDelete(user, module)) {
    return null;
  }

  const handleDelete = async () => {
    if (confirm('Are you sure? This action cannot be undone.')) {
      try {
        await onConfirm();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
      title="Delete (requires DELETE permission)"
    >
      <Trash2 className="w-4 h-4" />
      Delete
    </button>
  );
}