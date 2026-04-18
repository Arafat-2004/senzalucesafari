# PostgreSQL + Prisma Setup Guide - Step by Step 🚀

Follow these exact steps to connect your PostgreSQL database to Prisma.

---

## STEP 1: Create Your PostgreSQL Database

### 🌟 RECOMMENDED: Use Supabase (Free, Takes 2 Minutes)

1. **Go to Supabase**: https://supabase.com/dashboard/sign-up
2. **Sign up** with GitHub, Google, or email
3. **Click "New Project"**
4. **Fill in the form**:
   ```
   Organization: Your name or company
   Project name: senzalucesafaris
   Database Password: [CREATE A STRONG PASSWORD - SAVE IT!]
   Region: Choose the closest to you (e.g., US East, Europe West)
   Pricing Plan: Free
   ```
5. **Click "Create new project"**
6. **Wait 1-2 minutes** while it provisions
7. **Get your connection string**:
   - Go to **Settings** (gear icon on the left)
   - Click **Database**
   - Scroll to **Connection string**
   - Select **URI** tab
   - Choose **Node.js**
   - **Copy the connection string** - it looks like:
     ```
     postgresql://postgres.[project-id]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
     ```

### Alternative: Use Neon (Also Free)

1. Go to https://neon.tech
2. Sign up with GitHub
3. Click "New Project"
4. Name it: `senzalucesafaris`
5. Copy the connection string shown

---

## STEP 2: Update Your `.env` File

1. Open: `.env` (in your project root)
2. Replace line 14 with YOUR actual connection string:

**BEFORE:**
```env
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

**AFTER:** (example with Supabase)
```env
DATABASE_URL="postgresql://postgres.abc123xyz:MySuperSecret123!@aws-0-us-east-1.pooler.supabase.com:6543/postgres?schema=public"
```

⚠️ **IMPORTANT**: 
- Keep the `?schema=public` at the end
- Make sure the entire string is inside quotes
- No spaces before or after the `=`

---

## STEP 3: Verify Connection

Run this command to test the connection:

```bash
npm exec -- prisma db pull
```

**If successful**, you'll see:
```
✔ Introspected X models and wrote them into schema.prisma
```

**If you get an error**, check:
- Is your DATABASE_URL correct?
- Is there a typo in the password?
- Did you include `?schema=public` at the end?

---

## STEP 4: Define Your Database Models

Now let's add models for your Safari business. Open `prisma/schema.prisma` and add these models:

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// YOUR SAFARI BUSINESS MODELS
// ============================================

model Tour {
  id          String     @id @default(uuid())
  name        String
  slug        String     @unique
  description String     @db.Text
  shortDesc   String
  price       Float
  duration    String     // e.g., "3 Days / 2 Nights"
  location    String
  highlights  String[]   // Array of highlights
  included    String[]   // What's included
  excluded    String[]   // What's excluded
  maxGuests   Int
  image       String
  images      String[]   // Multiple images
  isActive    Boolean    @default(true)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  
  bookings    Booking[]
  reviews     Review[]
  
  @@map("tours")
}

model Booking {
  id              String   @id @default(uuid())
  tourId          String
  tour            Tour     @relation(fields: [tourId], references: [id], onDelete: Cascade)
  
  customerName    String
  customerEmail   String
  customerPhone   String
  numberOfGuests  Int
  tourDate        DateTime
  totalPrice      Float
  status          BookingStatus @default(PENDING)
  
  specialRequests String?  @db.Text
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("bookings")
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

model Review {
  id         String   @id @default(uuid())
  tourId     String
  tour       Tour     @relation(fields: [tourId], references: [id], onDelete: Cascade)
  
  customerName String
  rating     Int      // 1-5
  comment    String   @db.Text
  isApproved Boolean  @default(false)
  createdAt  DateTime @default(now())
  
  @@map("reviews")
}

model ContactInquiry {
  id        String   @id @default(uuid())
  name      String
  email     String
  phone     String?
  subject   String
  message   String   @db.Text
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
  
  @@map("contact_inquiries")
}

model Newsletter {
  id         String   @id @default(uuid())
  email      String   @unique
  isActive   Boolean  @default(true)
  subscribedAt DateTime @default(now())
  
  @@map("newsletters")
}
```

---

## STEP 5: Generate Prisma Client

After adding your models, generate the type-safe client:

```bash
npm exec -- prisma generate
```

**Success message:**
```
✔ Generated Prisma Client (v7.x.x) to .\src\generated\prisma
```

---

## STEP 6: Create the Database Tables

Push your schema to the database:

```bash
npm exec -- prisma db push
```

**Success message:**
```
✔ Your database is now in sync with your Prisma schema. Done!
```

---

## STEP 7: Verify Everything Works

### Option A: Use Prisma Studio (Visual Database Browser)

```bash
npm exec -- prisma studio
```

This opens a web interface at http://localhost:5555 where you can:
- View all your tables
- Add/edit/delete records
- Explore your data visually

### Option B: Test with Code

Create a test file: `src/test-prisma.ts`

```typescript
import { prisma } from './lib/prisma'

async function test() {
  try {
    // Test connection
    console.log('Testing Prisma connection...')
    
    // Count tours
    const tourCount = await prisma.tour.count()
    console.log(`✅ Connected! Tours in database: ${tourCount}`)
    
    // Create a test tour
    const tour = await prisma.tour.create({
      data: {
        name: 'Serengeti Safari Adventure',
        slug: 'serengeti-safari-adventure',
        description: 'Experience the amazing Serengeti...',
        shortDesc: '3-day wildlife adventure',
        price: 1500,
        duration: '3 Days / 2 Nights',
        location: 'Serengeti, Tanzania',
        highlights: ['Big Five', 'Great Migration', 'Luxury Camp'],
        included: ['Accommodation', 'Meals', 'Transport'],
        excluded: ['Flights', 'Tips'],
        maxGuests: 6,
        image: '/images/tours/serengeti.jpg',
        images: ['/images/tours/serengeti-1.jpg'],
      }
    })
    
    console.log('✅ Created test tour:', tour.name)
    
    // Clean up (remove this in production)
    await prisma.tour.delete({ where: { id: tour.id } })
    console.log('✅ Test complete!')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

test()
```

---

## STEP 8: Use Prisma in Your Next.js App

### Example: API Route to Get All Tours

Create: `src/app/api/tours/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tours = await prisma.tour.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(tours)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tours' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const tour = await prisma.tour.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        shortDesc: body.shortDesc,
        price: body.price,
        duration: body.duration,
        location: body.location,
        highlights: body.highlights,
        included: body.included,
        excluded: body.excluded,
        maxGuests: body.maxGuests,
        image: body.image,
        images: body.images,
      }
    })
    
    return NextResponse.json(tour, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create tour' },
      { status: 500 }
    )
  }
}
```

### Example: Server Component

```typescript
import { prisma } from '@/lib/prisma'

export default async function ToursPage() {
  const tours = await prisma.tour.findMany({
    where: { isActive: true }
  })
  
  return (
    <div>
      <h1>Available Tours</h1>
      {tours.map(tour => (
        <div key={tour.id}>
          <h2>{tour.name}</h2>
          <p>{tour.shortDesc}</p>
          <p>${tour.price}</p>
        </div>
      ))}
    </div>
  )
}
```

---

## Common Commands Reference

```bash
# Generate Prisma Client (after schema changes)
npm exec -- prisma generate

# Push schema to database (development)
npm exec -- prisma db push

# Create a migration (production-ready)
npm exec -- prisma migrate dev --name add_tour_model

# Apply migrations in production
npm exec -- prisma migrate deploy

# Open database GUI
npm exec -- prisma studio

# Reset database (⚠️ deletes all data)
npm exec -- prisma migrate reset

# Pull existing database schema
npm exec -- prisma db pull

# Format schema file
npm exec -- prisma format

# Validate schema
npm exec -- prisma validate
```

---

## Troubleshooting

### ❌ "Authentication failed"
- Check your password in DATABASE_URL
- Make sure special characters are URL-encoded (e.g., `@` becomes `%40`)

### ❌ "Database does not exist"
- Supabase/Neon create it automatically
- For local: `CREATE DATABASE senzalucesafaris;`

### ❌ "Cannot find module '../generated/prisma'"
```bash
npm exec -- prisma generate
```

### ❌ "Schema needs to be pushed"
```bash
npm exec -- prisma db push
```

### ❌ Connection timeout
- Check your internet connection
- Verify the database URL is correct
- For Supabase: Make sure your project is active

---

## Next Steps After Setup

1. **Add more models** as needed (Users, Payments, etc.)
2. **Create API routes** for CRUD operations
3. **Add relations** between models
4. **Set up indexes** for performance
5. **Add database constraints** for data integrity
6. **Use Prisma middleware** for logging/auditing

---

## Useful Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Connection String Formats](https://pris.ly/d/connection-strings)

---

**Need help?** Just ask! 🎉
