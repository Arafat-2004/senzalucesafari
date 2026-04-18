#!/usr/bin/env node
import dotenv from 'dotenv';
import path from 'path';
import pkg from 'pg';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const { Pool } = pkg;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }, // Supabase pooler uses self-signed CA; scoped to this connection only
});

const statements = [
  'ALTER TABLE "destinations" ADD COLUMN IF NOT EXISTS "distanceFromDarEsSalaam" text',
  'ALTER TABLE "destinations" ADD COLUMN IF NOT EXISTS "suggestedItineraries" text',
  'ALTER TABLE "destinations" ADD COLUMN IF NOT EXISTS "sampleItineraries" jsonb',
  'ALTER TABLE "destinations" ADD COLUMN IF NOT EXISTS "localTribes" text[] DEFAULT \'{}\'::text[]',
  'ALTER TABLE "destinations" ADD COLUMN IF NOT EXISTS "rawData" jsonb',

  'ALTER TABLE "accommodations" ADD COLUMN IF NOT EXISTS "tier" text',
  'ALTER TABLE "accommodations" ADD COLUMN IF NOT EXISTS "priceRange" text',
  'ALTER TABLE "accommodations" ADD COLUMN IF NOT EXISTS "bestFor" text[] DEFAULT \'{}\'::text[]',
  'ALTER TABLE "accommodations" ADD COLUMN IF NOT EXISTS "highlights" text[] DEFAULT \'{}\'::text[]',
  'ALTER TABLE "accommodations" ADD COLUMN IF NOT EXISTS "rawData" jsonb',
  'ALTER TABLE "accommodations" ALTER COLUMN "pricePerNight" TYPE text USING "pricePerNight"::text',

  'ALTER TABLE "vehicles" ADD COLUMN IF NOT EXISTS "category" text',
  'ALTER TABLE "vehicles" ADD COLUMN IF NOT EXISTS "imageUrl" text',
  'ALTER TABLE "vehicles" ADD COLUMN IF NOT EXISTS "rating" double precision NOT NULL DEFAULT 0',
  'ALTER TABLE "vehicles" ADD COLUMN IF NOT EXISTS "reviews" integer NOT NULL DEFAULT 0',
  'ALTER TABLE "vehicles" ADD COLUMN IF NOT EXISTS "priceRange" text',
  'ALTER TABLE "vehicles" ADD COLUMN IF NOT EXISTS "bestFor" text[] DEFAULT \'{}\'::text[]',
  'ALTER TABLE "vehicles" ADD COLUMN IF NOT EXISTS "specifications" jsonb',
  'ALTER TABLE "vehicles" ADD COLUMN IF NOT EXISTS "safetyFeatures" text[] DEFAULT \'{}\'::text[]',
  'ALTER TABLE "vehicles" ADD COLUMN IF NOT EXISTS "safariEquipment" text[] DEFAULT \'{}\'::text[]',
  'ALTER TABLE "vehicles" ADD COLUMN IF NOT EXISTS "interiorImages" text[] DEFAULT \'{}\'::text[]',
  'ALTER TABLE "vehicles" ADD COLUMN IF NOT EXISTS "exteriorImages" text[] DEFAULT \'{}\'::text[]',
  'ALTER TABLE "vehicles" ADD COLUMN IF NOT EXISTS "actionShots" text[] DEFAULT \'{}\'::text[]',
  'ALTER TABLE "vehicles" ADD COLUMN IF NOT EXISTS "rawData" jsonb',
  'ALTER TABLE "vehicles" ALTER COLUMN "capacity" TYPE text USING "capacity"::text',
  'CREATE INDEX IF NOT EXISTS "vehicles_category_idx" ON "vehicles" ("category")',

  'ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "author" text',
  'ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "content" text',
  'ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "safariPackage" text',
  'ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "reviewDate" timestamp without time zone',
  'ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "helpful" integer NOT NULL DEFAULT 0',
  'ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "rawData" jsonb',
  'ALTER TABLE "reviews" ALTER COLUMN "customerEmail" DROP NOT NULL',

  'ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "subtitle" text',
  'ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "sections" jsonb',
  'ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "relatedPosts" jsonb',
  'ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "rawData" jsonb',
];

async function main() {
  try {
    await pool.query('BEGIN');
    for (const statement of statements) {
      await pool.query(statement);
      console.log(`OK: ${statement}`);
    }
    await pool.query('COMMIT');
    console.log('Schema alignment complete.');
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Schema alignment failed:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
