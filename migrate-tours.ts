#!/usr/bin/env node
/**
 * Simple Tour Migration Script
 * Reads tour data from src/data/tours.ts and inserts using Prisma
 */

import { PrismaClient } from './src/generated/prisma/client.js';
import { tourPackages } from './src/data/tours.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const { Pool } = pkg;

async function migrateTours() {
    console.log('🚀 Starting tour migration...');

    // Setup database connection
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // Supabase pooler uses self-signed CA; scoped to this connection only
    });

    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        console.log(`📊 Found ${tourPackages.length} tours in data file`);

        if (tourPackages.length === 0) {
            console.error('❌ No tours found in data file');
            return;
        }

        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;

        for (const tour of tourPackages) {
            try {
                await prisma.tour.create({
                    data: {
                        name: tour.name,
                        slug: tour.slug,
                        category: tour.category,
                        shortDescription: tour.shortDescription,
                        overview: tour.overview,
                        bestFor: tour.bestFor || [],
                        duration: tour.duration,
                        startEnd: tour.startEnd,
                        highlights: tour.highlights || [],
                        itinerary: JSON.parse(JSON.stringify(tour.itinerary || [])),
                        included: tour.included || [],
                        excluded: tour.excluded || [],
                        imageUrl: tour.imageUrl,
                        priceFrom: tour.priceFrom,
                        rating: tour.rating || 0,
                        reviewCount: tour.reviewCount || 0,
                        difficulty: tour.difficulty || 'Moderate',
                        isActive: true,
                        isFeatured: false,
                        displayOrder: 0,
                    }
                });

                successCount++;
                console.log(`  ✅ Tour ${successCount}: ${tour.name}`);

            } catch (error: any) {
                if (error.code === 'P2002') {
                    // Unique constraint violation - tour already exists
                    skipCount++;
                    console.log(`  ⏭️  Skipped (exists): ${tour.name}`);
                } else {
                    errorCount++;
                    console.error(`  ❌ Error "${tour.name}": ${error.message}`);
                }
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log('🎉 Migration completed!');
        console.log('='.repeat(50));
        console.log(`✅ Successfully migrated: ${successCount}`);
        console.log(`⏭️  Skipped (already exist): ${skipCount}`);
        console.log(`❌ Errors: ${errorCount}`);
        console.log(`📊 Total processed: ${tourPackages.length}`);
        console.log('='.repeat(50));

    } catch (error: any) {
        console.error('\n❌ Migration failed:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Run migration
migrateTours().catch(console.error);
