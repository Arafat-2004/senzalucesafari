import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession, canAccess } from '@/lib/admin-auth'
import { withApiResilience } from '@/lib/reliability/api-resilience'

export const POST = withApiResilience(async (request: Request) => {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!canAccess(session, 50)) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { query } = await request.json()
    
    if (!query || query.length < 2) {
        return NextResponse.json({ results: [] })
    }

    const searchTerm = query.toLowerCase()
    const results: Array<{ type: string; title: string; href: string; subtitle?: string }> = []

    const tours = await prisma.tour.findMany({
        where: {
            OR: [
                { name: { contains: searchTerm, mode: 'insensitive' } },
                { slug: { contains: searchTerm, mode: 'insensitive' } },
            ],
        },
        take: 3,
        select: { id: true, name: true, slug: true, isActive: true },
    })
    tours.forEach(tour => {
        results.push({
            type: 'Tour',
            title: tour.name,
            href: `/admin/tours/${tour.id}/edit`,
            subtitle: tour.isActive ? 'Active' : 'Inactive',
        })
    })

    const destinations = await prisma.destination.findMany({
        where: {
            OR: [
                { name: { contains: searchTerm, mode: 'insensitive' } },
                { slug: { contains: searchTerm, mode: 'insensitive' } },
            ],
        },
        take: 3,
        select: { id: true, name: true, slug: true, isActive: true },
    })
    destinations.forEach(dest => {
        results.push({
            type: 'Destination',
            title: dest.name,
            href: `/admin/destinations/${dest.id}/edit`,
            subtitle: dest.isActive ? 'Active' : 'Inactive',
        })
    })

    const accommodations = await prisma.accommodation.findMany({
        where: {
            OR: [
                { name: { contains: searchTerm, mode: 'insensitive' } },
                { slug: { contains: searchTerm, mode: 'insensitive' } },
            ],
        },
        take: 3,
        select: { id: true, name: true, slug: true, isActive: true },
    })
    accommodations.forEach(accommodation => {
        results.push({
            type: 'Accommodation',
            title: accommodation.name,
            href: `/admin/accommodations/${accommodation.id}/edit`,
            subtitle: accommodation.isActive ? 'Active' : 'Inactive',
        })
    })

    const bookings = await prisma.booking.findMany({
        where: {
            OR: [
                { bookingRef: { contains: searchTerm, mode: 'insensitive' } },
                { firstName: { contains: searchTerm, mode: 'insensitive' } },
                { lastName: { contains: searchTerm, mode: 'insensitive' } },
                { email: { contains: searchTerm, mode: 'insensitive' } },
            ],
        },
        take: 3,
        select: { id: true, bookingRef: true, firstName: true, lastName: true, status: true },
    })
    bookings.forEach(booking => {
        results.push({
            type: 'Booking',
            title: `${booking.firstName} ${booking.lastName}`,
            href: `/admin/bookings/${booking.id}/edit`,
            subtitle: `${booking.bookingRef} · ${booking.status}`,
        })
    })

    const inquiries = await prisma.contactInquiry.findMany({
        where: {
            OR: [
                { name: { contains: searchTerm, mode: 'insensitive' } },
                { email: { contains: searchTerm, mode: 'insensitive' } },
            ],
        },
        take: 3,
        select: { id: true, name: true, email: true, inquiryType: true, isRead: true },
    })
    inquiries.forEach(inquiry => {
        results.push({
            type: 'Inquiry',
            title: inquiry.name,
            href: `/admin/inquiries/${inquiry.id}/edit`,
            subtitle: `${inquiry.inquiryType} · ${inquiry.isRead ? 'Read' : 'Unread'}`,
        })
    })

    const posts = await prisma.blogPost.findMany({
        where: {
            OR: [
                { title: { contains: searchTerm, mode: 'insensitive' } },
                { slug: { contains: searchTerm, mode: 'insensitive' } },
            ],
        },
        take: 3,
        select: { id: true, title: true, slug: true, isPublished: true },
    })
    posts.forEach(post => {
        results.push({
            type: 'Blog',
            title: post.title,
            href: `/admin/blog/${post.id}/edit`,
            subtitle: post.isPublished ? 'Published' : 'Draft',
        })
    })

    const limitedResults = results.slice(0, 15)

    return NextResponse.json({ results: limitedResults })
}, { route: '/api/admin/search', method: 'POST', requireAuth: true, slowThresholdMs: 800 })