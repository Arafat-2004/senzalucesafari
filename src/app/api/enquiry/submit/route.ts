import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/admin-audit';
import { z } from 'zod';

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
    message: z.string().max(5000).optional(),
    specialRequests: z.string().max(2000).optional(),
    packageSlug: z.string().optional(),
    basePrice: z.number().optional(),
    totalPrice: z.number().optional(),
    discount: z.number().optional(),
    source: z.string().default('website'),
});

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 5 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const record = rateLimitStore.get(ip);
    if (!record || now > record.resetTime) {
        rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return { allowed: true };
    }
    if (record.count >= RATE_LIMIT_MAX) {
        return { allowed: false, retryAfter: Math.ceil((record.resetTime - now) / 1000) };
    }
    record.count++;
    return { allowed: true };
}

export async function POST(request: Request) {
    try {
        const ip = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown';

        const rateLimit = checkRateLimit(ip);
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
                        pricePerPerson: data.basePrice,
                        totalPrice: data.totalPrice,
                        specialRequests: data.specialRequests,
                        source: 'enquiry_form',
                        status: 'PENDING',
                        paymentStatus: 'PENDING',
                    },
                });
            } catch (bookingError) {
                console.error('[Enquiry] Failed to create preliminary booking:', bookingError);
            }
        }

        await createNotification({
            type: 'NEW_INQUIRY',
            title: 'New Safari Enquiry',
            message: `${fullName} (${data.email}) - ${data.safariType || 'Custom Safari'}`,
            actionUrl: '/admin/inquiries',
        });

        return NextResponse.json({
            success: true,
            message: 'Your enquiry has been submitted. We\'ll contact you within 24-48 hours.',
            enquiryId: enquiry.id,
        }, { status: 201 });

    } catch (error) {
        console.error('[Enquiry Submit] Error:', error);
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