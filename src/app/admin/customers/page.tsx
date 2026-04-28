import { prisma } from '@/lib/prisma'
import CustomersClient from './customers-client'

export const revalidate = 30

interface CustomersPageProps {
  searchParams: Promise<{
    country?: string;
    bookingRange?: string;
    dateFrom?: string;
    dateTo?: string;
  }>
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const params = await searchParams;

  const [bookings, inquiries] = await Promise.all([
    prisma.booking.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        country: true,
        totalPrice: true,
        status: true,
        createdAt: true,
        tour: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.contactInquiry.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        country: true,
        inquiryType: true,
        createdAt: true,
        tourInterest: true
      },
      orderBy: { createdAt: 'desc' }
    })
  ])

  const customerMap = new Map<string, {
    email: string
    name: string
    phone: string | null
    country: string | null
    totalSpent: number
    bookingCount: number
    inquiryCount: number
    lastBooking: Date | null
    lastInquiry: Date | null
    tours: string[]
    status: string
  }>()

  for (const b of bookings) {
    const existing = customerMap.get(b.email.toLowerCase()) || {
      email: b.email.toLowerCase(),
      name: `${b.firstName} ${b.lastName}`,
      phone: b.phone,
      country: b.country,
      totalSpent: 0,
      bookingCount: 0,
      inquiryCount: 0,
      lastBooking: null,
      lastInquiry: null,
      tours: [] as string[],
      status: b.status
    }
    existing.totalSpent += b.totalPrice
    existing.bookingCount += 1
    if (b.tour?.name && !existing.tours.includes(b.tour.name)) {
      existing.tours.push(b.tour.name)
    }
    if (!existing.lastBooking || b.createdAt > existing.lastBooking) {
      existing.lastBooking = b.createdAt
    }
    if (b.status === 'CANCELLED') {
      existing.status = 'CANCELLED'
    } else if (b.status === 'CONFIRMED' && existing.status !== 'CANCELLED') {
      existing.status = 'CONFIRMED'
    }
    customerMap.set(b.email.toLowerCase(), existing)
  }

  for (const i of inquiries) {
    const existing = customerMap.get(i.email.toLowerCase())
    if (existing) {
      existing.inquiryCount += 1
      if (!existing.lastInquiry || i.createdAt > existing.lastInquiry) {
        existing.lastInquiry = i.createdAt
      }
    } else {
      customerMap.set(i.email.toLowerCase(), {
        email: i.email.toLowerCase(),
        name: i.name,
        phone: i.phone,
        country: i.country,
        totalSpent: 0,
        bookingCount: 0,
        inquiryCount: 1,
        lastBooking: null,
        lastInquiry: i.createdAt,
        tours: i.tourInterest ? [i.tourInterest] : [],
        status: 'INQUIRY_ONLY'
      })
    }
  }

  const customers = Array.from(customerMap.values()).map((c, idx) => ({
    id: c.email,
    name: c.name,
    email: c.email,
    phone: c.phone,
    country: c.country,
    totalSpent: c.totalSpent,
    bookingCount: c.bookingCount,
    inquiryCount: c.inquiryCount,
    lastActivity: (c.lastBooking || c.lastInquiry)?.toISOString() || null,
    tours: c.tours.slice(0, 2).join(', '),
    status: c.status,
    registrationDate: (c.lastBooking || c.lastInquiry)?.toISOString() || null,
  }))

  // Extract unique countries for filter dropdown
  const countries = Array.from(new Set(customers.map(c => c.country).filter(Boolean))) as string[]

  // Apply filters
  let filteredCustomers = customers

  if (params.country) {
    filteredCustomers = filteredCustomers.filter(c => c.country === params.country)
  }

  if (params.bookingRange) {
    switch (params.bookingRange) {
      case '0':
        filteredCustomers = filteredCustomers.filter(c => c.bookingCount === 0)
        break
      case '1-3':
        filteredCustomers = filteredCustomers.filter(c => c.bookingCount >= 1 && c.bookingCount <= 3)
        break
      case '4+':
        filteredCustomers = filteredCustomers.filter(c => c.bookingCount >= 4)
        break
    }
  }

  if (params.dateFrom) {
    const fromDate = new Date(params.dateFrom)
    filteredCustomers = filteredCustomers.filter(c => {
      if (!c.registrationDate) return false
      return new Date(c.registrationDate) >= fromDate
    })
  }

  if (params.dateTo) {
    const toDate = new Date(params.dateTo)
    toDate.setHours(23, 59, 59, 999)
    filteredCustomers = filteredCustomers.filter(c => {
      if (!c.registrationDate) return false
      return new Date(c.registrationDate) <= toDate
    })
  }

  return <CustomersClient data={filteredCustomers} countries={countries} />
}
