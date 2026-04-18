import { prisma } from '@/lib/prisma';

export interface CreateBookingInput {
    tourId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    countryCode?: string;
    travelDate: string;
    endDate?: string;
    numberOfTravelers: number;
    accommodationLevel: 'luxury' | 'mid-range' | 'budget';
    pricePerPerson: number;
    totalPrice: number;
    specialRequests?: string;
    source?: string;
}

export interface BookingResponse {
    id: string;
    bookingRef: string;
    tourName: string;
    travelDate: Date;
    totalPrice: number;
    currency: string;
}

/** Create a new booking */
export async function createBooking(input: CreateBookingInput): Promise<BookingResponse> {
    const tour = await prisma.tour.findUnique({
        where: { id: input.tourId },
    });

    if (!tour || !tour.isActive) {
        throw new Error('Tour not found or unavailable');
    }

    // Generate booking reference
    const prefix = 'SLS';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const bookingRef = `${prefix}-${timestamp}-${random}`;

    // Calculate end date if not provided
    const endDate = input.endDate || (() => {
        const start = new Date(input.travelDate);
        const daysMatch = tour.duration.match(/(\d+)\s*days?/);
        const days = daysMatch ? parseInt(daysMatch[1]) : 1;
        start.setDate(start.getDate() + days);
        return start.toISOString();
    })();

    const booking = await prisma.booking.create({
        data: {
            bookingRef,
            tourId: input.tourId,
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            phone: input.phone,
            country: input.country,
            countryCode: input.countryCode,
            travelDate: new Date(input.travelDate),
            endDate: new Date(endDate),
            numberOfTravelers: input.numberOfTravelers,
            accommodationLevel: input.accommodationLevel,
            pricePerPerson: input.pricePerPerson,
            totalPrice: input.totalPrice,
            specialRequests: input.specialRequests,
            source: input.source || 'website',
        },
    });

    return {
        id: booking.id,
        bookingRef: booking.bookingRef,
        tourName: tour.name,
        travelDate: booking.travelDate,
        totalPrice: booking.totalPrice,
        currency: booking.currency,
    };
}

/** Get booking by reference */
export async function getBookingByRef(bookingRef: string) {
    return prisma.booking.findUnique({
        where: { bookingRef },
        include: {
            tour: {
                select: {
                    name: true,
                    slug: true,
                    duration: true,
                },
            },
        },
    });
}

/** Get bookings by email */
export async function getBookingsByEmail(email: string) {
    return prisma.booking.findMany({
        where: { email },
        include: {
            tour: {
                select: {
                    name: true,
                    slug: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
}
