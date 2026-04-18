import { prisma } from '@/lib/prisma'
import InquiriesClient from './inquiries-client'

export default async function InquiriesPage() {
    const inquiries = await prisma.contactInquiry.findMany({ orderBy: { createdAt: 'desc' } })

    const data = inquiries.map((i: { id: string; name: string; email: string; subject: string; inquiryType: string; isRead: boolean; isReplied: boolean; createdAt: Date }) => ({
        id: i.id,
        name: i.name,
        email: i.email,
        subject: i.subject,
        inquiryType: i.inquiryType,
        isRead: i.isRead,
        isReplied: i.isReplied,
        createdAt: new Date(i.createdAt).toLocaleDateString(),
    }))

    return <InquiriesClient data={data} />
}
