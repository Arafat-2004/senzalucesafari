# 🗄️ Senza Luce Safaris - Complete Database Schema

## ✅ Database Successfully Created on Supabase!

Your database now has **17 tables** designed specifically for your safari business website.

---

## 📊 Database Overview

### Core Business Tables

#### 1. **tours** - Safari Tour Packages
Your main tour packages with complete details.
- **Key Fields**: name, slug, category, priceFrom, duration, rating
- **Arrays**: highlights, included, excluded, bestFor
- **JSON**: itinerary (day-by-day plans)
- **Relations**: bookings, reviews, destinations
- **Features**: isFeatured, displayOrder for sorting

**Example Usage:**
```typescript
// Get all active tours
const tours = await prisma.tour.findMany({
  where: { isActive: true },
  orderBy: { displayOrder: 'asc' }
})

// Get featured tours
const featured = await prisma.tour.findMany({
  where: { isFeatured: true }
})
```

#### 2. **tour_pricing** - Dynamic Pricing
Tiered pricing based on group size and accommodation level.
- **Group Pricing**: pricePerPerson2 through pricePerPerson6
- **Accommodation Supplements**: luxury, mid-range, budget
- **Discounts**: earlyBirdDiscount, lastMinuteDiscount (percentages)

#### 3. **destinations** - Safari Destinations
Detailed information about each destination (Serengeti, Ngorongoro, etc.)
- **Wildlife**: bigFive, keySpecies, uniqueSpecies, wildlifeRating
- **Best Time**: bestTimeToGo, peakSeason, monthlyBreakdown
- **Activities**: Game drives, walking safaris, etc.
- **Travel Info**: gettingThere, travelTips, faqs
- **SEO**: metaTitle, metaDescription

#### 4. **tour_destinations** - Tour-Destination Mapping
Many-to-many relationship linking tours to destinations they visit.

#### 5. **accommodations** - Lodges & Hotels
Accommodation options for tourists.
- **Types**: Luxury, Mid-Range, Budget, Camping
- **Features**: amenities array, images
- **Pricing**: pricePerNight

#### 6. **vehicles** - Safari Vehicles
Your fleet of safari vehicles.
- **Types**: Safari Land Cruiser, Van, Bus
- **Features**: Pop-up roof, charging ports, etc.
- **Specs**: capacity, engine, transmission

---

### Booking & Customer Tables

#### 7. **bookings** - Customer Bookings
Complete booking management system.
- **Customer Info**: firstName, lastName, email, phone, country
- **Travel Details**: travelDate, numberOfTravelers, accommodationLevel
- **Pricing**: pricePerPerson, totalPrice, depositPaid
- **Payment Status**: PENDING, DEPOSIT_PAID, PARTIALLY_PAID, FULLY_PAID, REFUNDED
- **Booking Status**: PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW
- **Resources**: vehicleId, guideId assignments
- **Unique**: bookingRef (human-readable reference like "SLS-2026-0001")

**Example Usage:**
```typescript
// Create a booking
const booking = await prisma.booking.create({
  data: {
    bookingRef: 'SLS-2026-0001',
    tourId: 'tour-id',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    travelDate: new Date('2026-06-15'),
    numberOfTravelers: 2,
    accommodationLevel: 'mid-range',
    totalPrice: 4900,
    paymentStatus: 'DEPOSIT_PAID',
    status: 'CONFIRMED'
  }
})

// Get upcoming bookings
const upcoming = await prisma.booking.findMany({
  where: {
    travelDate: { gte: new Date() },
    status: { in: ['CONFIRMED', 'PENDING'] }
  },
  include: { tour: true, vehicle: true, guide: true }
})
```

#### 8. **reviews** - Customer Reviews
Tour reviews and ratings.
- **Rating**: 1-5 stars
- **Content**: title, comment
- **Moderation**: isApproved, verified (actually took the tour)
- **Engagement**: helpfulCount, isFeatured

#### 9. **guides** - Safari Guides
Your team of safari guides.
- **Info**: firstName, lastName, languages, specialties
- **Professional**: experience, certifications, licenseNumber
- **Performance**: rating, reviewCount
- **Relations**: assigned bookings

---

### Marketing & Content Tables

#### 10. **blog_posts** - Blog Articles
Your safari blog content.
- **Content**: title, slug, excerpt, content
- **SEO**: metaTitle, metaDescription
- **Engagement**: views, readingTime
- **Status**: isPublished, publishedAt

#### 11. **faqs** - Frequently Asked Questions
Organized FAQ system.
- **Categories**: Booking, Safari, Visa, Health, etc.
- **Analytics**: viewCount, helpfulCount, notHelpfulCount
- **Ordering**: displayOrder

#### 12. **contact_inquiries** - Contact Form Submissions
Customer inquiries and messages.
- **Types**: GENERAL, TOUR_INQUIRY, CUSTOM_SAFARI, PRICING, etc.
- **Tracking**: isRead, isReplied, repliedAt
- **Context**: tourInterest, travelDate, numberOfTravelers

#### 13. **newsletters** - Email Subscribers
Newsletter subscription management.
- **Info**: email, firstName, lastName, country
- **Preferences**: interests array
- **Status**: isActive, subscribedAt, unsubscribedAt

---

### Media & Settings Tables

#### 14. **media** - Media Library
Centralized media management.
- **Files**: filename, url, thumbnailUrl
- **Metadata**: mimeType, fileSize, width, height
- **Organization**: category, tags, altText, caption

#### 15. **site_settings** - Website Configuration
Key-value settings for your website.
- **Examples**: 
  - `site_name`: "Senza Luce Safaris"
  - `contact_email`: "info@senzalucesafaris.com"
  - `currency`: "USD"
  - `deposit_percentage`: "30"

#### 16. **page_views** - Analytics
Website traffic tracking.
- **Visitor Info**: ipAddress, userAgent, referrer, country, city
- **Device**: device (desktop/mobile/tablet), browser, os
- **Session**: sessionId, timestamp

---

## 🔗 Database Relationships

```
Tour ────────────────────┐
  ├─ has many Bookings   │
  ├─ has many Reviews    │
  ├─ has one TourPricing │
  └─ has many ───────────┼─ TourDestination ──┐
                          │                    │
Destination ──────────────┘                    │
  └─ has many ─────────────────────────────────┘

Booking ─────────────┐
  ├─ belongs to Tour │
  ├─ has one Vehicle │
  └─ has one Guide   │
                     │
Vehicle ─────────────┘
  └─ has many Bookings

Guide ───────────────┐
  └─ has many Bookings
```

---

## 🚀 Common Operations

### Get Tour with All Details
```typescript
const tour = await prisma.tour.findUnique({
  where: { slug: 'serengeti-safari' },
  include: {
    pricing: true,
    destinations: { include: { destination: true } },
    reviews: { where: { isApproved: true } },
    _count: { select: { bookings: true, reviews: true } }
  }
})
```

### Create Complete Booking
```typescript
const booking = await prisma.booking.create({
  data: {
    bookingRef: `SLS-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`,
    tourId: tourId,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    country: 'United States',
    travelDate: new Date('2026-06-15'),
    endDate: new Date('2026-06-20'),
    numberOfTravelers: 2,
    accommodationLevel: 'mid-range',
    pricePerPerson: 2450,
    totalPrice: 4900,
    depositPaid: 1470,
    paymentStatus: 'DEPOSIT_PAID',
    status: 'CONFIRMED',
    specialRequests: 'Vegetarian meals please'
  }
})
```

### Get Dashboard Stats
```typescript
const stats = await Promise.all([
  prisma.tour.count({ where: { isActive: true } }),
  prisma.booking.count({ where: { status: 'CONFIRMED' } }),
  prisma.booking.aggregate({
    _sum: { totalPrice: true },
    where: { createdAt: { gte: new Date('2026-01-01') } }
  }),
  prisma.review.aggregate({
    _avg: { rating: true },
    where: { isApproved: true }
  })
])
```

---

## 📈 Next Steps

### 1. **Migrate Your Data**
Move data from TypeScript files to database:
```bash
# Create a migration script
npm run migrate-data
```

### 2. **Create API Routes**
Build REST APIs for each resource:
- `/api/tours` - CRUD for tours
- `/api/bookings` - Booking management
- `/api/destinations` - Destination info
- `/api/reviews` - Review system
- `/api/contact` - Contact form

### 3. **Build Admin Dashboard**
Manage your business:
- View/manage bookings
- Add/edit tours
- Moderate reviews
- Track analytics
- Manage inquiries

### 4. **Add Authentication**
Protect admin routes:
- Admin login
- Role-based access
- API protection

---

## 🎯 Database Access

### View in Supabase Dashboard
https://supabase.com/dashboard/project/lmpvkxnudhyxjigugnzj/editor

### View with Prisma Studio
```bash
npm exec -- prisma studio
```
Opens at: http://localhost:5555

---

## 📝 Indexes for Performance

The schema includes optimized indexes for:
- Tour category, active status, featured status
- Booking status, payment status, travel date, email
- Review tour ID, approval status, rating
- Destination region, active status
- And more...

---

## 🔒 Security Features

- Row-level security ready (can be enabled in Supabase)
- Parameterized queries (Prisma prevents SQL injection)
- Data validation built-in
- Enum types for controlled values

---

## 💡 Pro Tips

1. **Use transactions for bookings:**
```typescript
await prisma.$transaction(async (tx) => {
  const booking = await tx.booking.create({...})
  await tx.emailLog.create({...})
})
```

2. **Batch operations:**
```typescript
await prisma.tour.updateMany({
  where: { category: 'Wildlife Safari' },
  data: { isActive: true }
})
```

3. **Advanced filtering:**
```typescript
const tours = await prisma.tour.findMany({
  where: {
    AND: [
      { isActive: true },
      { priceFrom: { lte: 3000 } },
      { rating: { gte: 8 } }
    ]
  }
})
```

---

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Database Schema](./prisma/schema.prisma)

---

**Your database is production-ready!** 🚀

All tables are created and ready to store your safari business data.
