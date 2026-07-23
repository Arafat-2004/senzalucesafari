import { requireAdmin } from "@/lib/admin-auth"
import { prisma } from '@/lib/prisma'
import InquiriesClient from './inquiries-client'

export const revalidate = 15

export default async function InquiriesPage() {
    await requireAdmin('inquiries', 'VIEW');
    const inquiries = await prisma.contactInquiry.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100
    }).catch(() => null)
    if (!inquiries) return <InquiriesClient data={[]} dataUnavailable />
    const data = inquiries.map(i => ({
        id: i.id,
        name: i.name,
        email: i.email,
        subject: i.subject,
        inquiryType: i.inquiryType,
        isRead: i.isRead,
        isReplied: i.isReplied,
        createdAt: i.createdAt.toISOString(),
    }))
    return <InquiriesClient data={data} />
}
