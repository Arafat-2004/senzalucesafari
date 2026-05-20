import { requireSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { UsersPageClient } from './users-client';

export default async function UsersPage() {
  const session = await requireSession();

  // Ensure only super_admin can manage users
  if (session.role.name !== 'super_admin') {
    redirect('/admin');
  }

  // Fetch users with their roles
  const users = await prisma.adminUser.findMany({
    include: {
      role: true
    },
    orderBy: { createdAt: 'desc' }
  });

  const serializedUsers = users.map(u => ({
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    phone: u.phone,
    role: u.role.name,
    isActive: u.isActive
  }));

  return <UsersPageClient initialUsers={serializedUsers} />;
}
