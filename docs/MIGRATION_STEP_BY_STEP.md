# 🚀 Data Migration Guide - Supabase Dashboard

## Quick Reference Links:
- **Supabase Dashboard**: https://supabase.com/dashboard/project/lmpvkxnudhyxjigugnzj/editor
- **Your Project**: senzalucesafaris

---

## Migration Strategy: Table by Table

We'll migrate data in this order (respecting foreign keys):

1. ✅ **tours** (from `src/data/tours.ts`)
2. ✅ **destinations** (from `src/data/destinations.ts`)
3. ✅ **accommodations** (from `src/data/accommodations.ts`)
4. ✅ **blog_posts** (from `src/data/blogs.ts`)
5. ✅ **faqs** (from `src/data/faqs.ts`)
6. ✅ **site_settings** (from `src/data/settings.ts`)
7. ✅ **vehicles** (from `src/data/vehicles.ts`)
8. ✅ **guides** (from `src/data/guides.ts`)
9. ⏭️ **tour_destinations** (relationships - after tours & destinations)
10. ⏭️ **Other tables** (can add later)

---

## How to Add Data (Repeat for Each Table)

### Method 1: Using Table Editor (Manual)

1. **Go to**: https://supabase.com/dashboard/project/lmpvkxnudhyxjigugnzj/editor
2. **Click** on the table name in left sidebar
3. **Click** "Insert" button (top right)
4. **Add rows** one by one:
   - Fill in required fields
   - Leave `id` empty (auto-generates UUID)
   - Leave `createdAt` and `updatedAt` empty (auto-fills)
   - For arrays (like `highlights[]`): Use JSON format `["item1", "item2"]`
   - For JSON fields (like `itinerary`): Use JSON format
5. **Click** "Save" when done

### Method 2: Using SQL (Faster for Bulk Data)

1. **Go to**: https://supabase.com/dashboard/project/lmpvkxnudhyxjigugnzj/sql/new
2. **Write INSERT statements**
3. **Run** the query

---

## Data Format Examples

### Tours Table Example:
```sql
INSERT INTO tours (
  name, slug, category, shortDescription, overview, 
  bestFor, duration, startEnd, highlights, itinerary,
  included, excluded, imageUrl, priceFrom, rating, reviewCount,
  difficulty, isActive, isFeatured, displayOrder
) VALUES (
  'Serengeti Migration Safari',
  'serengeti-migration-safari',
  'wildlife-safari',
  'Witness the Great Migration',
  'Experience the incredible annual migration...',
  '["Wildlife Enthusiasts", "Photographers"]',
  '7 days / 6 nights',
  'Arusha → Arusha',
  '["Great Migration", "Big Five", "Expert Guides"]',
  '[{"day": 1, "title": "Arrival", "activities": ["Airport pickup", "Hotel check-in"]}]',
  '["Professional guide", "Accommodation", "Meals"]',
  '["International flights", "Visa fees"]',
  '/images/tours/serengeti.jpg',
  3500,
  4.9,
  127,
  'Moderate',
  true,
  true,
  1
);
```

### Destinations Table Example:
```sql
INSERT INTO destinations (
  name, slug, country, region, description, 
  shortDescription, bestTime, imageUrl, activities,
  isActive, displayOrder
) VALUES (
  'Serengeti National Park',
  'serengeti-national-park',
  'Tanzania',
  'Northern Tanzania',
  'World-famous for the Great Migration...',
  'Iconic safari destination',
  'June - October',
  '/images/destinations/serengeti.jpg',
  '["Game Drives", "Hot Air Balloon", "Photography"]',
  true,
  1
);
```

---

## Data Count Summary

From your TypeScript files:
- **Tours**: ~12 tour packages
- **Destinations**: ~15 destinations
- **Accommodations**: ~30 properties
- **Blog Posts**: ~5 articles
- **FAQs**: ~10 questions
- **Vehicles**: ~5 vehicles
- **Guides**: ~3 guides

**Total estimated time**: 30-45 minutes

---

## Let's Start!

### Step 1: Tours
I'll help you extract the first tour package data. Say "ready" when you have Supabase dashboard open!
