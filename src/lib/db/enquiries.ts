import { prisma } from '@/lib/prisma';

export interface CreateEnquiryInput {
    name: string;
    email: string;
    phone?: string;
    country?: string;
    subject: string;
    message: string;
    inquiryType?: 'GENERAL' | 'TOUR_INQUIRY' | 'CUSTOM_SAFARI' | 'PRICING' | 'AVAILABILITY' | 'SUPPORT' | 'PARTNERSHIP' | 'FEEDBACK';
    tourInterest?: string;
    travelDate?: string;
    numberOfTravelers?: number;
    source?: string;
}

/** Create a new enquiry */
export async function createEnquiry(input: CreateEnquiryInput) {
    return prisma.contactInquiry.create({
        data: {
            name: input.name,
            email: input.email,
            phone: input.phone,
            country: input.country,
            subject: input.subject,
            message: input.message,
            inquiryType: input.inquiryType || 'GENERAL',
            tourInterest: input.tourInterest,
            travelDate: input.travelDate ? new Date(input.travelDate) : null,
            numberOfTravelers: input.numberOfTravelers,
            source: input.source || 'contact_form',
        },
    });
}

/** Get unread enquiries count */
export async function getUnreadEnquiriesCount() {
    return prisma.contactInquiry.count({
        where: { isRead: false },
    });
}

/** Mark enquiry as read */
export async function markEnquiryAsRead(id: string) {
    return prisma.contactInquiry.update({
        where: { id },
        data: { isRead: true },
    });
}

/** Mark enquiry as replied */
export async function markEnquiryAsReplied(id: string) {
    return prisma.contactInquiry.update({
        where: { id },
        data: {
            isReplied: true,
            repliedAt: new Date(),
        },
    });
}
