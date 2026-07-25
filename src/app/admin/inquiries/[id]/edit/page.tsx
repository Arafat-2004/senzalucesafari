import { logger } from '@/lib/reliability/logger'
import { requirePageAdmin } from "@/lib/admin-auth"
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import InquiryForm from '../../inquiry-form'

export const dynamic = 'force-dynamic'

export default async function EditInquiryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    await requirePageAdmin('inquiries', 'REPLY');
    
    let inquiry = null
    let hasError = false

    try {
        inquiry = await prisma.contactInquiry.findUnique({ where: { id } })
    } catch (error) {
        logger.error('Error fetching inquiry', { error: error instanceof Error ? error.message : String(error) })
        hasError = true
    }

    if (hasError) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Error</h1>
                <p className="text-muted-foreground">Failed to load inquiry. Please try again.</p>
            </div>
        )
    }

    if (!inquiry) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Inquiry Not Found</h1>
                <p className="text-muted-foreground">The inquiry with ID &quot;{id}&quot; does not exist.</p>
            </div>
        )
    }

    return <InquiryForm inquiry={inquiry} />
}
