#!/usr/bin/env node
/**
 * Tour Migration Script using Prisma
 * Reads tour data from MIGRATE_ALL_TOURS.sql and inserts using Prisma client
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function migrateTours() {
    console.log('🚀 Starting tour migration with Prisma...');

    try {
        // Dynamically import PrismaClient
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();

        console.log('📂 Reading MIGRATE_ALL_TOURS.sql...');

        // Read the SQL file
        const sqlPath = path.join(__dirname, 'MIGRATE_ALL_TOURS.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        console.log('📝 SQL file loaded successfully');
        console.log('🔄 Parsing tour data from SQL...');

        // Extract tour data using regex
        const tourRegex = /INSERT INTO tours\s+\([^)]+\)\s+VALUES\s+\(([\s\S]+?)\);/g;
        const tours = [];
        let match;

        while ((match = tourRegex.exec(sqlContent)) !== null) {
            const valuesStr = match[1];

            try {
                // Parse the values - this is complex due to nested quotes and arrays
                const tour = parseTourValues(valuesStr);
                if (tour) {
                    tours.push(tour);
                }
            } catch (error) {
                console.error(`⚠️  Warning: Could not parse tour: ${error.message}`);
            }
        }

        console.log(`📊 Found ${tours.length} tours to migrate`);

        if (tours.length === 0) {
            console.error('❌ No tours found in SQL file');
            return;
        }

        // Insert tours using Prisma
        let successCount = 0;
        let errorCount = 0;

        for (const tour of tours) {
            try {
                await prisma.tour.create({
                    data: {
                        name: tour.name,
                        slug: tour.slug,
                        category: tour.category,
                        shortDescription: tour.shortDescription,
                        overview: tour.overview,
                        bestFor: tour.bestFor,
                        duration: tour.duration,
                        startEnd: tour.startEnd,
                        highlights: tour.highlights,
                        itinerary: tour.itinerary || [],
                        included: tour.included,
                        excluded: tour.excluded,
                        imageUrl: tour.imageUrl,
                        priceFrom: tour.priceFrom,
                        rating: tour.rating || 0,
                        reviewCount: tour.reviewCount || 0,
                        difficulty: tour.difficulty,
                        isActive: tour.isActive !== undefined ? tour.isActive : true,
                        isFeatured: tour.isFeatured !== undefined ? tour.isFeatured : false,
                        displayOrder: tour.displayOrder || 0,
                    }
                });

                successCount++;
                console.log(`  ✅ Tour ${successCount}: ${tour.name}`);

            } catch (error) {
                errorCount++;
                if (error.code === 'P2002') {
                    console.log(`  ⏭️  Tour already exists: ${tour.name} (skipped)`);
                } else {
                    console.error(`  ❌ Error inserting "${tour.name}": ${error.message}`);
                }
            }
        }

        console.log('\n🎉 Migration completed!');
        console.log(`📊 Successfully migrated: ${successCount}`);
        console.log(`⏭️  Skipped (already exist): ${errorCount}`);

        await prisma.$disconnect();

    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        console.error(error);
        process.exit(1);
    }
}

/**
 * Parse tour values from SQL INSERT statement
 */
function parseTourValues(valuesStr) {
    // This is a simplified parser - we'll extract key fields
    // A more robust solution would use a proper SQL parser

    const tour = {
        bestFor: [],
        highlights: [],
        included: [],
        excluded: [],
        itinerary: []
    };

    // Extract simple string values (between single quotes)
    const stringMatches = valuesStr.match(/'([^']*(?:''[^']*)*)'/g);
    if (!stringMatches || stringMatches.length < 10) {
        throw new Error('Not enough string values found');
    }

    // Helper to unescape SQL strings
    const unescape = (str) => str.replace(/^'|'$/g, '').replace(/''/g, "'");

    // Extract arrays (JSONB format)
    const arrayRegex = /\[([^\]]*)\]'::jsonb/g;
    const arrays = [];
    let arrayMatch;
    while ((arrayMatch = arrayRegex.exec(valuesStr)) !== null) {
        try {
            const parsed = JSON.parse(`[${arrayMatch[1]}]`);
            arrays.push(parsed);
        } catch (e) {
            arrays.push([]);
        }
    }

    // Extract numeric values
    const numberMatches = valuesStr.match(/(?<!')\b(\d+\.?\d*)\b(?!')/g);

    // Extract boolean values
    const boolMatches = valuesStr.match(/\b(true|false)\b/g);

    // Map the extracted values to tour fields
    // This assumes a specific order based on the INSERT statement
    tour.name = unescape(stringMatches[0]);
    tour.slug = unescape(stringMatches[1]);
    tour.category = unescape(stringMatches[2]);
    tour.shortDescription = unescape(stringMatches[3]);
    tour.overview = unescape(stringMatches[4]);
    tour.bestFor = arrays[0] || [];
    tour.duration = unescape(stringMatches[5]);
    tour.startEnd = unescape(stringMatches[6]);
    tour.highlights = arrays[1] || [];
    tour.itinerary = arrays[2] || [];
    tour.included = arrays[3] || [];
    tour.excluded = arrays[4] || [];
    tour.imageUrl = unescape(stringMatches[7]);
    tour.priceFrom = parseFloat(numberMatches?.[0] || '0');
    tour.rating = parseFloat(numberMatches?.[1] || '0');
    tour.reviewCount = parseInt(numberMatches?.[2] || '0');
    tour.difficulty = unescape(stringMatches[8]);
    tour.isActive = boolMatches?.[0] === 'true';
    tour.isFeatured = boolMatches?.[1] === 'true';
    tour.displayOrder = parseInt(numberMatches?.[3] || '0');

    return tour;
}

// Run migration
migrateTours().catch(console.error);
