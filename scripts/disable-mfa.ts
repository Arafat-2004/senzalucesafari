import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL ?? '';
const url = new URL(connectionString);
url.searchParams.delete('sslmode');
const adapter = new PrismaPg({
    connectionString: url.toString(),
    ssl: { rejectUnauthorized: false },
    max: 2,
});
const prisma = new PrismaClient({ adapter });

async function disableMfa() {
    console.log('Searching for admin users...');
    
    const users = await prisma.adminUser.findMany({
        select: { id: true, email: true, mfaEnabled: true }
    });
    
    console.log('Found users:', JSON.stringify(users, null, 2));
    
    if (users.length === 0) {
        console.log('No admin users found. Creating default admin...');
        let role = await prisma.adminRole.findFirst();
        if (!role) {
            role = await prisma.adminRole.create({
                data: {
                    name: 'super_admin',
                    displayName: 'Super Admin',
                    description: 'Full access to all admin features',
                    permissions: {},
                    level: 100,
                }
            });
            console.log('Created role:', role.name);
        }
        await prisma.adminUser.create({
            data: {
                email: 'admin@senzalucesafaris.com',
                passwordHash: '$2a$10$placeholder',
                firstName: 'Admin',
                lastName: 'User',
                roleId: role.id,
                mfaEnabled: false,
            }
        });
        console.log('Created admin user: admin@senzalucesafaris.com with MFA disabled');
    } else {
        console.log('Disabling MFA for all admin users...');
        await prisma.adminUser.updateMany({
            data: { mfaEnabled: false }
        });
        console.log('MFA disabled for', users.length, 'admin user(s)');
    }
    
    await prisma.$disconnect();
    console.log('Done!');
}

disableMfa().catch(console.error);