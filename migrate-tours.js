#!/usr/bin/env node
/**
 * Simple Tour Migration Script
 * Reads tour data from src/data/tours.ts and inserts using Prisma
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import 'dotenv/config';

async function migrateTours() {
    console.log('🚀 Starting tour migration...');

    try {
        // Import Prisma
        const { PrismaClient } = await import('@prisma/client');
        const prisma = new PrismaClient();

        // Import tours data
        const { tourPackages } = await import('./src/data/tours.js');

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
                        itinerary: tour.itinerary || [],
                        included: tour.included || [],
                        excluded: tour.excluded || [],
                        imageUrl: tour.imageUrl,
                        priceFrom: tour.priceFrom,
                        rating: tour.rating || 0,
                        reviewCount: tour.reviewCount || 0,
                        difficulty: tour.difficulty || 'Moderate',
                        isActive: tour.isActive !== undefined ? tour.isActive : true,
                        isFeatured: tour.isFeatured !== undefined ? tour.isFeatured : false,
                        displayOrder: tour.displayOrder || 0,
                    }
                });

                successCount++;
                console.log(`  ✅ Tour ${successCount}: ${tour.name}`);

            } catch (error) {
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

        await prisma.$disconnect();

    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        console.error(error);
        process.exit(1);
    }
}

// Run migration
migrateTours().catch(console.error);
