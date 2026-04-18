import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import InquiryForm from '../../inquiry-form'

export default async function EditInquiryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const inquiry = await prisma.contactInquiry.findUnique({ where: { id } })
    if (!inquiry) notFound()
    return <InquiryForm inquiry={inquiry} />
}
