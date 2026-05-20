// Role definitions
export const AVAILABLE_ROLES = [
  'super_admin',
  'editor',
  'sales',
  'viewer'
] as const;

export type UserRole = typeof AVAILABLE_ROLES[number];

// Role metadata for UI
export const ROLE_METADATA = {
  super_admin: {
    label: 'Super Admin',
    description: 'Full system access and control',
    color: 'bg-red-100 text-red-800',
    icon: '👑',
    canCreateUsers: true,
    canDeleteUsers: true,
    canManageRoles: true,
    canViewAnalytics: true,
    isSystemRole: true
  },
  editor: {
    label: 'Editor',
    description: 'Can create and edit content',
    color: 'bg-blue-100 text-blue-800',
    icon: '✏️',
    canCreateUsers: false,
    canDeleteUsers: false,
    canManageRoles: false,
    canViewAnalytics: true,
    isSystemRole: true
  },
  sales: {
    label: 'Sales Manager',
    description: 'Can manage bookings and inquiries',
    color: 'bg-green-100 text-green-800',
    icon: '💰',
    canCreateUsers: false,
    canDeleteUsers: false,
    canManageRoles: false,
    canViewAnalytics: true,
    isSystemRole: true
  },
  viewer: {
    label: 'Viewer',
    description: 'Read-only access',
    color: 'bg-gray-100 text-gray-800',
    icon: '👁️',
    canCreateUsers: false,
    canDeleteUsers: false,
    canManageRoles: false,
    canViewAnalytics: false,
    isSystemRole: true
  }
} as const;

// Permission definitions
export const PERMISSIONS = {
  super_admin: {
    tours: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
    destinations: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
    bookings: ['VIEW', 'EDIT', 'CONFIRM', 'CANCEL'],
    reviews: ['VIEW', 'EDIT', 'APPROVE'],
    inquiries: ['VIEW', 'REPLY'],
    users: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
    settings: ['VIEW', 'EDIT'],
    reports: ['VIEW', 'EXPORT'],
    analytics: ['VIEW'],
    roles: ['VIEW', 'CREATE', 'EDIT', 'DELETE']
  },
  editor: {
    tours: ['VIEW', 'CREATE', 'EDIT'],
    destinations: ['VIEW', 'CREATE', 'EDIT'],
    bookings: ['VIEW'],
    reviews: ['VIEW', 'EDIT', 'APPROVE'],
    inquiries: ['VIEW', 'REPLY'],
    reports: ['VIEW', 'EXPORT'],
    analytics: ['VIEW']
  },
  sales: {
    tours: ['VIEW'],
    destinations: ['VIEW'],
    bookings: ['VIEW', 'EDIT', 'CONFIRM', 'CANCEL'],
    inquiries: ['VIEW', 'REPLY'],
    reports: ['VIEW', 'EXPORT'],
    analytics: ['VIEW']
  },
  viewer: {
    tours: ['VIEW'],
    destinations: ['VIEW'],
    bookings: ['VIEW'],
    reviews: ['VIEW'],
    inquiries: ['VIEW'],
    reports: ['VIEW'],
    analytics: ['VIEW']
  }
} as const;

export function getPermissions(role: UserRole) {
  return PERMISSIONS[role] || PERMISSIONS.viewer;
}

export function hasPermission(
  userRole: UserRole,
  module: string,
  action: string
): boolean {
  const permissions = getPermissions(userRole);
  const modulePermissions = permissions[module as keyof typeof permissions] || [];
  return (modulePermissions as unknown as string[]).includes(action);
}
