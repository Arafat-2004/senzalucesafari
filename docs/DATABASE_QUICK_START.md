# 🚀 Supabase Database - Quick Start Guide

## ✅ What's Been Done

1. **Environment Variables Configured**
   - Password `senzalucesafaris` added to `.env` file
   - Both DATABASE_URL and DIRECT_URL configured
   - Connection pooler and direct connection ready

2. **Database Schema Ready**
   - 17 tables designed for your safari business
   - Prisma ORM configured
   - All relationships and indexes set up

---

## 🔍 Verify Connection

Run this command to test your database connection:

```bash
node verify-db-connection.js
```

This will show:
- ✅ Connection status
- 📊 Existing tables
- 🕐 Server time

---

## 📦 Essential Commands

### First Time Setup
```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Verify connection
node verify-db-connection.js

# 3. Open database GUI
npx prisma studio
```

### Daily Development
```bash
# Start dev server
npm run dev

# View database
npx prisma studio

# Test connection
node verify-db-connection.js
```

### Database Management
```bash
# Pull schema from database
npx prisma db pull

# Push changes to database
npx prisma db push

# Create migration
npx prisma migrate dev --name migration_name

# Reset database (deletes all data!)
npx prisma migrate reset
```

---

## 🌐 Access Points

### Supabase Dashboard
**URL**: https://supabase.com/dashboard/project/lmpvkxnudhyxjigugnzj

Here you can:
- View/edit data directly
- Run SQL queries
- Manage database settings
- Reset password if needed

### Prisma Studio (Local GUI)
```bash
npx prisma studio
```
**URL**: http://localhost:5555

Here you can:
- Browse tables visually
- Create/edit/delete records
- View relationships
- Test queries

---

## 💻 Code Examples

### In Your Next.js App

```typescript
// Import Prisma Client
import { PrismaClient } from './src/generated/prisma'

const prisma = new PrismaClient()

// Get all tours
const tours = await prisma.tour.findMany({
  where: { isActive: true }
})

// Create booking
const booking = await prisma.booking.create({
  data: {
    bookingRef: 'SLS-2026-0001',
    tourId: 'tour-id-here',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    // ... other fields
  }
})
```

---

## 📊 Database Tables Overview

| Table | Purpose |
|-------|---------|
| `tours` | Safari packages |
| `tour_pricing` | Pricing tiers |
| `destinations` | Safari locations |
| `bookings` | Customer bookings |
| `reviews` | Customer reviews |
| `guides` | Tour guides |
| `vehicles` | Safari vehicles |
| `accommodations` | Hotels/lodges |
| `blog_posts` | Blog content |
| `faqs` | FAQ entries |
| `contact_inquiries` | Contact forms |
| `newsletters` | Email subscribers |
| `media` | Media files |
| `site_settings` | Config settings |
| `page_views` | Analytics |

---

## 🔧 Troubleshooting

### Connection Failed?
1. Check `.env` file has correct password
2. Visit Supabase dashboard to verify project is active
3. Try resetting password in Supabase → Settings → Database
4. Update `.env` with new password if changed

### Prisma Errors?
```bash
# Regenerate client
npx prisma generate

# Validate schema
npx prisma validate

# Check connection
npx prisma db pull
```

### Can't Find Tables?
```bash
# Push schema to database
npx prisma db push

# Or run migration
npx prisma migrate dev
```

---

## 📚 Documentation Files

- `SUPABASE_CONNECTION_SETUP.md` - Complete setup guide
- `DATABASE_SCHEMA_COMPLETE.md` - Full schema documentation
- `prisma/schema.prisma` - Database schema file
- `.env` - Your connection strings (don't share!)

---

## 🎯 Next Steps

1. ✅ Run `node verify-db-connection.js` to test
2. ✅ Run `npx prisma generate` to create Prisma Client
3. ✅ Run `npx prisma studio` to browse database
4. ✅ Start building your API routes
5. ✅ Connect your frontend to the database

---

**Need Help?**
- Supabase Docs: https://supabase.com/docs
- Prisma Docs: https://www.prisma.io/docs
- Dashboard: https://supabase.com/dashboard/project/lmpvkxnudhyxjigugnzj

---

*Last updated: April 14, 2026*
