# Supabase + Prisma Setup Guide

## ✅ What's Already Done

1. **Prisma is installed** - Version 7.7.0 in your project
2. **Schema is ready** - Complete database schema with all models
3. **Environment files updated** - `.env` and `.env.example` configured for Supabase

## 🔧 What You Need to Do

### Step 1: Get Your Supabase Password

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `lmpvkxnudhyxjigugnzj`
3. Go to **Project Settings** → **Database**
4. Find your database password (you'll need to reset it if you don't remember it)

### Step 2: Update Your `.env` File

Open `.env` and replace `[YOUR-PASSWORD]` with your actual Supabase password:

```env
# Prisma Database Connection - Supabase
# Connect to Supabase via connection pooling (for Prisma Client)
DATABASE_URL="postgresql://postgres.lmpvkxnudhyxjigugnzj:YOUR_ACTUAL_PASSWORD@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database (for migrations)
DIRECT_URL="postgresql://postgres.lmpvkxnudhyxjigugnzj:YOUR_ACTUAL_PASSWORD@aws-1-eu-north-1.pooler.supabase.com:5432/postgres"
```

**Example:**
```env
DATABASE_URL="postgresql://postgres.lmpvkxnudhyxjigugnzj:MySecurePass123!@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.lmpvkxnudhyxjigugnzj:MySecurePass123!@aws-1-eu-north-1.pooler.supabase.com:5432/postgres"
```

### Step 3: Test the Connection

Run this command to verify Prisma can connect to Supabase:

```bash
cd senzalucesafaris
npx prisma validate
```

You should see: `✔ Validated schema.prisma in Xms`

### Step 4: Generate Prisma Client

```bash
npx prisma generate
```

This creates the type-safe database client for your application.

### Step 5: Push Schema to Supabase

You have two options:

#### Option A: Push directly (Recommended for new databases)

```bash
npx prisma db push
```

This will create all tables in your Supabase database.

#### Option B: Create migrations (Better for version control)

```bash
# Create initial migration
npx prisma migrate dev --name init

# Apply migration to database
npx prisma migrate deploy
```

### Step 6: Verify Database Setup

Open Supabase dashboard → **Table Editor** and you should see all these tables:
- `tours`
- `tour_pricing`
- `destinations`
- `tour_destinations`
- `accommodations`
- `vehicles`
- `bookings`
- `reviews`
- `guides`
- `contact_inquiries`
- `newsletters`
- `blog_posts`
- `faqs`
- `media`
- `site_settings`
- `page_views`

## 🚀 Next Steps

### Seed Your Database (Optional)

Create a seed script to add initial data:

```bash
# Create prisma/seed.ts
# Add sample tours, destinations, etc.

# Run seed
npx prisma db seed
```

### Use Prisma in Your Code

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Example: Get all tours
const tours = await prisma.tour.findMany({
  where: { isActive: true },
  include: { pricing: true }
})
```

## 🔐 Security Notes

1. **Never commit `.env`** - It's already in `.gitignore`
2. **Use environment variables** in production (Vercel, Railway, etc.)
3. **Keep DIRECT_URL secure** - Only used for migrations
4. **Connection pooling** - DATABASE_URL uses PgBouncer for better performance

## 📚 Useful Commands

```bash
# View database in browser
npx prisma studio

# Pull schema from database
npx prisma db pull

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Format schema file
npx prisma format
```

## ❓ Troubleshooting

### Connection Error: "sslmode=require"

If you see SSL errors, add `?sslmode=require` to DIRECT_URL:
```env
DIRECT_URL="postgresql://...:5432/postgres?sslmode=require"
```

### Connection Timeout

- Check your Supabase project is active
- Verify password is correct
- Ensure IP is not blocked in Supabase settings

### Prisma Client Not Generated

```bash
rm -rf node_modules/.prisma
npx prisma generate
```

## 📖 Additional Resources

- [Prisma + Supabase Guide](https://www.prisma.io/docs/guides/database/supabase)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooling)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

---

**Need help?** Check the official docs or reach out to Supabase support!
