import { getSession } from "@/lib/admin-auth"
import { prisma } from '@/lib/prisma'
import { UsersPageClient } from './users-client'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function UsersPage() {
    const session = await getSession();
    if (!session) {
        redirect('/admin/login');
    }
    
    // Check if the user is a super_admin
    if (session.role.name !== 'super_admin') {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
                <p className="text-muted-foreground mt-2">Only Super Administrators can manage team users.</p>
            </div>
        );
    }

    const [users, roles] = await Promise.all([
        prisma.adminUser.findMany({ include: { role: true }, orderBy: { createdAt: 'desc' } }),
        prisma.adminRole.findMany({ select: { name: true, displayName: true }, orderBy: [{ level: 'desc' }, { displayName: 'asc' }] }),
    ]);

    const initialUsers = users.map(u => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        phone: u.phone,
        role: u.role.name,
        isActive: u.isActive
    }));

    return <UsersPageClient initialUsers={initialUsers} roles={roles} />;
}
