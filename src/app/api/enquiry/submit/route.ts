import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/admin-audit';
import { checkRateLimit, getClientIp } from '@/lib/security';
import { calculateSafariPrice } from '@/lib/pricing-engine';
import { sendAdminNotificationEmail } from '@/lib/email/admin-notification';
import { sendCustomerConfirmationEmail } from '@/lib/email/customer-confirmation';
import { z } from 'zod';
import { logger } from '@/lib/reliability/logger';

const enquirySubmitSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(6, 'Phone number is required').max(20),
    country: z.string().max(100).optional(),
    countryCode: z.string().optional(),
    contactPreference: z.enum(['email', 'whatsapp', 'phone', 'sms']).default('email'),
    safariType: z.string().max(200).optional(),
    destinations: z.array(z.string()).default([]),
    numberOfPeople: z.number().int().min(1).max(50).optional(),
    travelDate: z.string().optional(),
    travelDateValue: z.string().optional(),
    duration: z.string().optional(),
    accommodationLevel: z.string().optional(),
    activities: z.array(z.string()).default([]),
    budget: z.string().optional(),
    flexibleDates: z.enum(['yes', 'no']).default('no'),
    message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
    specialRequests: z.string().max(2000).optional(),
    packageSlug: z.string().optional(),
    basePrice: z.number().optional(),
    totalPrice: z.number().optional(),
    discount: z.number().optional(),
    source: z.string().default('website'),
});

function sanitizeClientNote(text: string, isMessageField = false): string {
    let sanitized = text.trim();
    
    // Check if it is a repetitive/blunt filler value
    const isFiller = /^(yes|no|ok|none|na|n\/a|\.)$/i.test(sanitized);
    
    if (isFiller) {
        return isMessageField ? 'Interested in booking a custom safari.' : '';
    }

    // Normalize uppercase shouting
    if (sanitized === sanitized.toUpperCase() && sanitized.length > 3) {
        sanitized = sanitized.charAt(0) + sanitized.slice(1).toLowerCase();
    }

    // Correct common abbreviations and spelling mistakes
    sanitized = sanitized.replace(/\bAPPRECCIATE\b/gi, 'appreciate');
    sanitized = sanitized.replace(/\bVISTING\b/gi, 'visiting');
    sanitized = sanitized.replace(/\bTZ\b/gi, 'Tanzania');

    return sanitized;
}

export async function POST(request: Request) {
    try {
        const ip = getClientIp(request);

        const rateLimit = await checkRateLimit(ip, 'enquiry');
        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Too many requests. Please wait before submitting another enquiry.', retryAfter: rateLimit.retryAfter },
                { status: 429 }
            );
        }

        const body = await request.json();
        const validation = enquirySubmitSchema.safeParse(body);

        if (!validation.success) {
            const errors = validation.error.issues.map((err) => ({
                field: String(err.path.join('.')),
                message: err.message,
            }));
            return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
        }

        const data = validation.data;
        
        // Sanitize client-submitted notes
        data.message = sanitizeClientNote(data.message, true);
        if (data.specialRequests) {
            data.specialRequests = sanitizeClientNote(data.specialRequests);
        }
        
        const fullName = `${data.firstName} ${data.lastName}`;
        
        let tourId: string | null = null;
        
        if (data.packageSlug) {
            const tour = await prisma.tour.findUnique({
                where: { slug: data.packageSlug },
                select: { id: true },
            });
            if (tour) tourId = tour.id;
        }

        const enquiry = await prisma.contactInquiry.create({
            data: {
                name: fullName,
                email: data.email,
                phone: data.phone,
                country: data.country,
                subject: data.safariType 
                    ? `Safari Enquiry: ${data.safariType}` 
                    : 'Safari Enquiry',
                message: buildEnquiryMessage(data),
                inquiryType: tourId ? 'TOUR_INQUIRY' : 'CUSTOM_SAFARI',
                tourInterest: data.packageSlug || data.safariType || undefined,
                travelDate: data.travelDateValue ? new Date(data.travelDateValue) : data.travelDate ? new Date(data.travelDate) : undefined,
                numberOfTravelers: data.numberOfPeople,
                source: data.source,
                ipAddress: ip,
            },
        });

        if (tourId && data.basePrice && data.totalPrice) {
            // Calculate server-side pricing (handle both string and number)
            const basePriceNum = Number(data.basePrice) || 0;
            const travelersNum = (Number(data.numberOfPeople) || 2);
            
            const pricing = calculateSafariPrice(
                basePriceNum,
                travelersNum,
                data.accommodationLevel || 'mid-range'
            );
            
            try {
                await prisma.booking.create({
                    data: {
                        bookingRef: `SLS-ENQ-${Date.now().toString(36).toUpperCase()}`,
                        tourId,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        phone: data.phone,
                        country: data.country || 'Unknown',
                        countryCode: data.countryCode,
                        travelDate: data.travelDateValue ? new Date(data.travelDateValue) : new Date(),
                        endDate: data.travelDateValue ? new Date(data.travelDateValue) : new Date(),
                        numberOfTravelers: data.numberOfPeople || 2,
                        accommodationLevel: data.accommodationLevel || 'mid-range',
                        pricePerPerson: pricing.pricePerPerson,
                        totalPrice: pricing.totalPrice,
                        specialRequests: data.specialRequests,
                        source: 'enquiry_form',
                        status: 'PENDING',
                        paymentStatus: 'PENDING',
                    },
                });
            } catch (bookingError) {
                logger.error('[Enquiry] Failed to create preliminary booking', { error: bookingError instanceof Error ? bookingError.message : String(bookingError) });
            }
        }

        await createNotification({
            type: 'NEW_INQUIRY',
            title: 'New Safari Enquiry',
            message: `${fullName} (${data.email}) - ${data.safariType || 'Custom Safari'}`,
            actionUrl: '/admin/inquiries',
        });

        // Send emails (non-blocking — do not await both)
        // If either fails, log error but do NOT fail the request
        await Promise.allSettled([
            sendAdminNotificationEmail({
                id: enquiry.id,
                name: fullName,
                email: data.email,
                phone: data.phone,
                country: data.country || null,
                subject: enquiry.subject,
                message: enquiry.message,
                inquiryType: enquiry.inquiryType,
                tourInterest: enquiry.tourInterest,
                travelDate: enquiry.travelDate,
                numberOfTravelers: enquiry.numberOfTravelers,
                createdAt: enquiry.createdAt,
            }),
            sendCustomerConfirmationEmail({
                id: enquiry.id,
                name: fullName,
                email: data.email,
                phone: data.phone,
                subject: enquiry.subject,
                message: enquiry.message,
                inquiryType: enquiry.inquiryType,
                tourInterest: enquiry.tourInterest,
                travelDate: enquiry.travelDate,
                numberOfTravelers: enquiry.numberOfTravelers,
                createdAt: enquiry.createdAt,
            }),
        ]).then((results) => {
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    logger.error(`[Email] ${index === 0 ? 'Admin' : 'Customer'} notification failed`, { error: result.reason instanceof Error ? result.reason.message : String(result.reason) });
                } else if (!result.value.success) {
                    logger.error(`[Email] ${index === 0 ? 'Admin' : 'Customer'} notification error`, { error: result.value.error });
                }
            });
        });

        return NextResponse.json({
            success: true,
            message: 'Your enquiry has been submitted. We\'ll contact you within 24-48 hours.',
            enquiryId: enquiry.id,
        }, { status: 201 });

    } catch (error) {
        logger.error('[Enquiry Submit] Error', { error: error instanceof Error ? error.message : String(error) });
        return NextResponse.json(
            { error: 'Failed to submit enquiry. Please try again.' },
            { status: 500 }
        );
    }
}

function buildEnquiryMessage(data: z.infer<typeof enquirySubmitSchema>): string {
    const parts: string[] = [];
    
    if (data.safariType) parts.push(`Safari Type: ${data.safariType}`);
    if (data.numberOfPeople) parts.push(`Number of Travelers: ${data.numberOfPeople}`);
    if (data.travelDate) parts.push(`Preferred Travel Date: ${data.travelDate}`);
    if (data.duration) parts.push(`Preferred Duration: ${data.duration}`);
    if (data.accommodationLevel) parts.push(`Accommodation Level: ${data.accommodationLevel}`);
    if (data.budget) parts.push(`Budget Range: ${data.budget}`);
    if (data.destinations?.length) parts.push(`Destinations: ${data.destinations.join(', ')}`);
    if (data.activities?.length) parts.push(`Activities: ${data.activities.join(', ')}`);
    if (data.flexibleDates === 'yes') parts.push('Travel dates are flexible');
    
    if (data.basePrice && data.totalPrice) {
        parts.push(`\nPricing Info:\n- Base Price: $${data.basePrice}/person\n- Total: $${data.totalPrice}`);
        if (data.discount) parts.push(`- Discount: ${data.discount}%`);
    }
    
    if (data.message) parts.push(`\nMessage: ${data.message}`);
    if (data.specialRequests) parts.push(`\nSpecial Requests: ${data.specialRequests}`);
    
    return parts.join('\n');
}