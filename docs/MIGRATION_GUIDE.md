# 🚀 Database Migration Guide - Supabase with Prisma

## Overview

This guide will help you migrate all your data (tours, destinations, accommodations, blogs) from TypeScript files to your Supabase database using Prisma ORM.

---

## ✅ What's Ready

1. **Database Connection** - Configured with your password
2. **Prisma Schema** - 17 tables ready
3. **Migration Script** - Created and ready to run
4. **Source Data** - Available in `src/data/` folder

---

## 📦 Data to be Migrated

| Data Type | Source File | Records |
|-----------|-------------|---------|
| Tours | `src/data/tours.ts` | ~33 tours |
| Destinations | `src/data/destinations.ts` | Multiple destinations |
| Accommodations | `src/data/accommodations.ts` | Multiple lodges/hotels |
| Blog Posts | `src/data/blogs.ts` | Multiple articles |

---

## 🎯 Quick Start (Easiest Method)

### Option 1: Run the Batch Script (Windows)

Simply double-click this file:
```
run-migration.bat
```

This will automatically:
1. Generate Prisma Client
2. Test the database connection
3. Run the complete migration

---

### Option 2: Manual Step-by-Step

Open PowerShell or Command Prompt and run:

```bash
# Navigate to project folder
cd c:\Users\arafa\Desktop\safarisSenzaz\senzalucesafaris

# Step 1: Generate Prisma Client
npx prisma generate

# Step 2: Test setup (optional but recommended)
node test-setup.js

# Step 3: Run the migration
node migrate-all-data.js
```

---

## 📋 Detailed Steps

### Step 1: Generate Prisma Client

This creates the TypeScript client that Prisma uses to interact with your database:

```bash
npx prisma generate
```

**Expected output:**
```
✔ Generated Prisma Client (v7.7.0) to .\node_modules\@prisma\client
```

---

### Step 2: Test Database Connection

Verify that everything is set up correctly:

```bash
node test-setup.js
```

**Expected output:**
```
🔍 Testing Setup...

1. Environment Variables:
   DATABASE_URL exists: true
   DATABASE_URL preview: postgresql://postgres.lmpvkxnudhyxjigugnzj:...

2. Testing Prisma Client import...
   ✅ Prisma Client imported successfully

3. Testing database connection...
   ✅ Database connected successfully!

✨ Setup is working! You can now run: node migrate-all-data.js
```

---

### Step 3: Run Migration

This will migrate all your data to Supabase:

```bash
node migrate-all-data.js
```

**Expected output:**
```
🚀 Starting Complete Data Migration to Supabase...

✅ Prisma Client initialized

🔍 Testing database connection...
✅ Database connected! Server time: 2026-04-14T...

============================================================
📦 MIGRATING TOURS
============================================================
📊 Found 33 tours to migrate

  ✅ 1. 5 Days Tanzania Wildlife Safari
  ✅ 2. 7 Days Great Migration Safari
  ✅ 3. 10 Days Ultimate Safari & Beach
  ... (continues for all tours)

✅ Tours: 33 migrated, 0 skipped, 0 errors

============================================================
📦 MIGRATING DESTINATIONS
============================================================
📊 Found X destinations to migrate

  ✅ 1. Serengeti National Park
  ✅ 2. Ngorongoro Crater
  ... (continues)

✅ Destinations: X migrated, 0 skipped, 0 errors

============================================================
📦 MIGRATING ACCOMMODATIONS
============================================================
... (similar output)

============================================================
📦 MIGRATING BLOG POSTS
============================================================
... (similar output)

============================================================
🎉 MIGRATION COMPLETED SUCCESSFULLY!
============================================================

👋 Database connection closed
```

---

## 🔍 Verify Migration

### Method 1: Prisma Studio (Visual Interface)

```bash
npx prisma studio
```

Opens at: http://localhost:5555

You can browse all tables and see your migrated data visually.

---

### Method 2: Supabase Dashboard

Visit: https://supabase.com/dashboard/project/lmpvkxnudhyxjigugnzj/editor

Click on each table to see the data:
- `tours`
- `destinations`
- `accommodations`
- `blog_posts`

---

### Method 3: SQL Queries

Run these queries in Supabase SQL Editor:

```sql
-- Count tours
SELECT COUNT(*) as total_tours FROM tours;

-- Count destinations
SELECT COUNT(*) as total_destinations FROM destinations;

-- Count accommodations
SELECT COUNT(*) as total_accommodations FROM accommodations;

-- Count blog posts
SELECT COUNT(*) as total_blogs FROM blog_posts;

-- View all tours
SELECT id, name, slug, category, "priceFrom", rating 
FROM tours 
ORDER BY "displayOrder";

-- View featured tours
SELECT name, slug, rating 
FROM tours 
WHERE "isFeatured" = true;
```

---

## ⚠️ Troubleshooting

### Issue: "Prisma Client not generated"

**Solution:**
```bash
npx prisma generate
```

---

### Issue: "Connection failed" or "Authentication failed"

**Solutions:**
1. Check password in `.env` file is correct: `senzalucesafaris`
2. Verify Supabase project is active: https://supabase.com/dashboard/project/lmpvkxnudhyxjigugnzj
3. Try resetting password in Supabase → Settings → Database

---

### Issue: "Table does not exist"

**Solution:**
```bash
# Push schema to database
npx prisma db push

# OR run migration
npx prisma migrate dev --name init
```

---

### Issue: "Duplicate key value violates unique constraint"

This means data already exists. The migration script will skip duplicates automatically.

**To start fresh (⚠️ deletes all data):**
```sql
-- In Supabase SQL Editor
DELETE FROM blog_posts;
DELETE FROM accommodations;
DELETE FROM destinations;
DELETE FROM tours;
-- ... (other tables)
```

Then run migration again.

---

### Issue: "Module not found: @prisma/client"

**Solution:**
```bash
npm install @prisma/client
npx prisma generate
```

---

## 📊 Migration Script Features

The `migrate-all-data.js` script includes:

✅ **Automatic ID generation** - Uses IDs from source data  
✅ **Duplicate detection** - Skips records that already exist  
✅ **Error handling** - Continues migration even if one record fails  
✅ **Progress tracking** - Shows which record is being migrated  
✅ **Summary report** - Shows success/skip/error counts  
✅ **Safe migration** - Won't delete existing data  

---

## 🔄 Re-running Migration

You can run the migration multiple times safely:

- ✅ Already migrated records will be **skipped** (not duplicated)
- ✅ New records will be **added**
- ⚠️ Updates to existing records won't be applied (would need different script)

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| `migrate-all-data.js` | Main migration script |
| `test-setup.js` | Connection test script |
| `run-migration.bat` | Windows batch runner |
| `MIGRATION_GUIDE.md` | This guide |

---

## 🎯 After Migration

Once migration is complete, you can:

1. **Use Prisma Client in your app:**
   ```typescript
   import { PrismaClient } from './src/generated/prisma'
   const prisma = new PrismaClient()
   
   const tours = await prisma.tour.findMany()
   ```

2. **View data in Prisma Studio:**
   ```bash
   npx prisma studio
   ```

3. **Query data in your Next.js app:**
   - Tours will load from database instead of TypeScript files
   - Update your API routes to use Prisma

4. **Build admin dashboard:**
   - Manage tours, bookings, reviews
   - CRUD operations via Prisma

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Dashboard](https://supabase.com/dashboard/project/lmpvkxnudhyxjigugnzj)
- [Database Schema](./prisma/schema.prisma)
- [Quick Start Guide](./DATABASE_QUICK_START.md)

---

## 🆘 Need Help?

If you encounter any issues:

1. Check the error message carefully
2. Verify `.env` file has correct password
3. Ensure Supabase project is active
4. Try running `test-setup.js` to diagnose connection issues
5. Check Supabase logs: https://supabase.com/dashboard/project/lmpvkxnudhyxjigugnzj/logs

---

**Ready to migrate? Run:** `node migrate-all-data.js` 🚀

---

*Guide created: April 14, 2026*
