import { UserRole, getPermissions, hasPermission } from './roles';

// Interface for user with role
export interface UserWithRole {
  id: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  name: string;
  isActive: boolean;
}

// Check if user can access resource
export function canAccessResource(
  user: UserWithRole,
  module: string,
  action: string
): boolean {
  if (!user.isActive) return false;
  return hasPermission(user.role, module, action);
}

// Get accessible modules for user
export function getAccessibleModules(user: UserWithRole): string[] {
  const permissions = getPermissions(user.role);
  return Object.keys(permissions);
}

// Get accessible actions for module
export function getModuleActions(
  user: UserWithRole,
  module: string
): string[] {
  const permissions = getPermissions(user.role);
  return (permissions[module as keyof typeof permissions] || []) as unknown as string[];
}

// Check if user can manage users
export function canManageUsers(user: UserWithRole): boolean {
  return ['super_admin'].includes(user.role);
}

// Check if user can manage roles
export function canManageRoles(user: UserWithRole): boolean {
  return ['super_admin'].includes(user.role);
}

// Check if user can delete
export function canDelete(
  user: UserWithRole,
  module: string
): boolean {
  return hasPermission(user.role, module, 'DELETE');
}

// Check if user can create
export function canCreate(
  user: UserWithRole,
  module: string
): boolean {
  return hasPermission(user.role, module, 'CREATE');
}

// Check if user can edit
export function canEdit(
  user: UserWithRole,
  module: string
): boolean {
  return hasPermission(user.role, module, 'EDIT');
}

// Check if user can view
export function canView(
  user: UserWithRole,
  module: string
): boolean {
  return hasPermission(user.role, module, 'VIEW');
}

// Throw error if no permission
export function requirePermission(
  user: UserWithRole | null,
  module: string,
  action: string
) {
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  if (!canAccessResource(user, module, action)) {
    throw new Error(
      `User does not have ${action} permission for ${module}`
    );
  }
}

// Filter accessible items
export function filterByPermission<T extends { module: string; action: string }>(
  user: UserWithRole,
  items: T[]
): T[] {
  return items.filter(item =>
    canAccessResource(user, item.module, item.action)
  );
}
