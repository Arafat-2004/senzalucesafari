# Tour Migration to Supabase - Manual Instructions

## Quick Migration Guide

Since automated migration encountered SSL/connection issues, here are **3 simple options** to migrate your 33 tours:

---

## Option 1: Use Supabase SQL Editor (RECOMMENDED - Easiest)

### Steps:
1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/lmpvkxnudhyxjigugnzj/sql/new

2. **Run the SQL File**
   - Open the file: `MIGRATE_ALL_TOURS.sql` 
   - Copy ALL the contents
   - Paste into the SQL editor
   - Click **"Run"** button

3. **Verify Migration**
   - Go to: https://supabase.com/dashboard/project/lmpvkxnudhyxjigugnzj/editor
   - Click on `tours` table
   - You should see 33 tour records

**Note:** The SQL file uses `jsonb` format, but your database expects `text[]` arrays. You need to either:
- Use Option 2 below (already converted), OR  
- Manually change `[\"value1\", \"value2\"]'::jsonb` to `ARRAY['value1', 'value2']` in the SQL file

---

## Option 2: Use the Converted SQL File

I've created a script to convert the SQL. However, due to connection issues, you'll need to run it manually:

### Steps:
1. Open terminal in: `c:\Users\arafa\Desktop\safarisSenzaz\senzalucesafaris`

2. Run the conversion and migration:
   ```bash
   npx tsx migrate-tours.ts
   ```

If that doesn't work due to connection issues, use Option 3.

---

## Option 3: Use Prisma Studio (Visual Interface)

### Steps:
1. **Open Prisma Studio**
   ```bash
   cd c:\Users\arafa\Desktop\safarisSenzaz\senzalucesafaris
   npx prisma studio
   ```

2. **Add Tours Manually**
   - Opens at: http://localhost:5555
   - Click on `Tour` model
   - Click "Add record"
   - Fill in tour details from `src/data/tours.ts`
   - Repeat for all 33 tours

---

## Option 4: Direct Database Connection with psql

If you have PostgreSQL command-line tools installed:

```bash
# Connect to your Supabase database
psql "postgresql://postgres.lmpvkxnudhyxjigugnzj:senzalucesafaris@aws-1-eu-north-1.pooler.supabase.com:5432/postgres?sslmode=require"

# Run the migration file
\i C:/Users/arafa/Desktop/safarisSenzaz/senzalucesafaris/MIGRATE_ALL_TOURS.sql
```

---

## Verify Migration

After migration, verify the data:

```sql
-- Count total tours
SELECT COUNT(*) FROM tours;

-- View all tours
SELECT id, name, slug, category, "priceFrom", rating FROM tours ORDER BY "displayOrder";

-- View featured tours
SELECT name, slug, rating FROM tours WHERE "isFeatured" = true;
```

---

## Troubleshooting

### Issue: "column is of type text[] but expression is of type jsonb"
**Solution:** The SQL file needs array conversion. Use this regex to convert:
- Find: `\["([^"]*)", "([^"]*)"\]'::jsonb`
- Replace: `ARRAY['$1', '$2']`

### Issue: "SSL connection error"
**Solution:** Use the connection pooler URL with `?sslmode=require`

### Issue: Tours already exist
**Solution:** The migration will skip duplicates. To reset:
```sql
DELETE FROM tours;
```

---

## Need Help?

If you encounter any issues:
1. Check the Supabase logs: https://supabase.com/dashboard/project/lmpvkxnudhyxjigugnzj/logs
2. Verify your database schema matches the Prisma schema
3. Ensure all required columns exist in the `tours` table

---

**Good luck with your migration! 🚀**
