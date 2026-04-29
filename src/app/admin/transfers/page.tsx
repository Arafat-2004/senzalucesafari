import { prisma } from '@/lib/prisma';
import AdminTransfersClient from './transfers-client';

async function getTransfers() {
    const transfers = await prisma.vehicleTransfer.findMany({
        orderBy: { createdAt: 'desc' },
    });
    // Convert Date objects to strings for client component serialization
    return transfers.map(t => ({
        ...t,
        pickupDate: t.pickupDate.toISOString(),
        createdAt: t.createdAt.toISOString(),
    }));
}

export default async function AdminTransfersPage() {
    const transfers = await getTransfers();
    return <AdminTransfersClient transfers={transfers} />;
}
