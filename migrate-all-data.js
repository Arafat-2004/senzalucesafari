#!/usr/bin/env node
/**
 * Complete Data Migration Script - Supabase
 * Migrates all data from TypeScript files to Supabase using Prisma
 */

const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function runMigration() {
    console.log('🚀 Starting Complete Data Migration to Supabase...\n');

    let prisma;

    try {
        // Import Prisma Client
        const { PrismaClient } = require('@prisma/client');
        prisma = new PrismaClient();

        console.log('✅ Prisma Client initialized\n');

        // Test connection
        console.log('🔍 Testing database connection...');
        const result = await prisma.$queryRaw`SELECT NOW() as now`;
        console.log('✅ Database connected! Server time:', result[0].now, '\n');

        // Run migrations in order
        await migrateTours(prisma);
        await migrateDestinations(prisma);
        await migrateAccommodations(prisma);
        await migrateBlogs(prisma);

        console.log('\n' + '='.repeat(60));
        console.log('🎉 MIGRATION COMPLETED SUCCESSFULLY!');
        console.log('='.repeat(60));

    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        if (prisma) {
            await prisma.$disconnect();
            console.log('\n👋 Database connection closed');
        }
    }
}

async function migrateTours(prisma) {
    console.log('\n' + '='.repeat(60));
    console.log('📦 MIGRATING TOURS');
    console.log('='.repeat(60));

    try {
        const { tourPackages } = require('./src/data/tours');
        console.log(`📊 Found ${tourPackages.length} tours to migrate\n`);

        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;

        for (const tour of tourPackages) {
            try {
                await prisma.tour.create({
                    data: {
                        id: tour.id,
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
                        difficulty: tour.difficulty || null,
                        isActive: true,
                        isFeatured: tour.rating >= 8.5,
                        displayOrder: successCount,
                    }
                });

                successCount++;
                console.log(`  ✅ ${successCount}. ${tour.name}`);

            } catch (error) {
                if (error.code === 'P2002') {
                    skipCount++;
                    console.log(`  ⏭️  Skipped (exists): ${tour.name}`);
                } else {
                    errorCount++;
                    console.error(`  ❌ Error: ${tour.name} - ${error.message}`);
                }
            }
        }

        console.log(`\n✅ Tours: ${successCount} migrated, ${skipCount} skipped, ${errorCount} errors`);

    } catch (error) {
        console.error('❌ Tours migration failed:', error.message);
        throw error;
    }
}

async function migrateDestinations(prisma) {
    console.log('\n' + '='.repeat(60));
    console.log('📦 MIGRATING DESTINATIONS');
    console.log('='.repeat(60));

    try {
        const { destinations } = require('./src/data/destinations');
        console.log(`📊 Found ${destinations.length} destinations to migrate\n`);

        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;

        for (const dest of destinations) {
            try {
                await prisma.destination.create({
                    data: {
                        id: dest.id,
                        name: dest.name,
                        slug: dest.slug,
                        region: dest.region || 'Northern Circuit',
                        shortDescription: dest.shortDescription,
                        whyVisit: dest.whyVisit || '',
                        fullDescription: dest.fullDescription || dest.shortDescription,
                        parkSize: dest.parkSize || null,
                        elevation: dest.elevation || null,
                        established: dest.established || null,
                        nearestAirport: dest.nearestAirport || null,
                        distanceFromArusha: dest.distanceFromArusha || null,
                        recommendedStay: dest.recommendedStay || null,
                        bigFive: dest.bigFive || [],
                        keySpecies: dest.keySpecies || [],
                        birdWatching: dest.birdWatching || false,
                        uniqueSpecies: dest.uniqueSpecies || [],
                        wildlifeRating: dest.wildlifeRating || 0,
                        bestTimeToGo: dest.bestTimeToGo || [],
                        peakSeason: dest.peakSeason || null,
                        lowSeason: dest.lowSeason || null,
                        monthlyBreakdown: dest.monthlyBreakdown || null,
                        activities: dest.activities || null,
                        highlights: dest.highlights || [],
                        landscape: dest.landscape || null,
                        ecosystems: dest.ecosystems || [],
                        accommodations: dest.accommodations || null,
                        gettingThere: dest.gettingThere || null,
                        conservation: dest.conservation || null,
                        communityInitiatives: dest.communityInitiatives || null,
                        culturalContext: dest.culturalContext || null,
                        travelTips: dest.travelTips || null,
                        faqs: dest.faqs || null,
                        imageUrl: dest.imageUrl || '/images/destinations/default.jpg',
                        galleryImages: dest.galleryImages || [],
                        metaTitle: dest.metaTitle || null,
                        metaDescription: dest.metaDescription || null,
                        isActive: true,
                        displayOrder: successCount,
                    }
                });

                successCount++;
                console.log(`  ✅ ${successCount}. ${dest.name}`);

            } catch (error) {
                if (error.code === 'P2002') {
                    skipCount++;
                    console.log(`  ⏭️  Skipped (exists): ${dest.name}`);
                } else {
                    errorCount++;
                    console.error(`  ❌ Error: ${dest.name} - ${error.message}`);
                }
            }
        }

        console.log(`\n✅ Destinations: ${successCount} migrated, ${skipCount} skipped, ${errorCount} errors`);

    } catch (error) {
        console.error('❌ Destinations migration failed:', error.message);
        throw error;
    }
}

async function migrateAccommodations(prisma) {
    console.log('\n' + '='.repeat(60));
    console.log('📦 MIGRATING ACCOMMODATIONS');
    console.log('='.repeat(60));

    try {
        const { accommodations } = require('./src/data/accommodations');
        console.log(`📊 Found ${accommodations.length} accommodations to migrate\n`);

        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;

        for (const acc of accommodations) {
            try {
                await prisma.accommodation.create({
                    data: {
                        id: acc.id,
                        name: acc.name,
                        slug: acc.slug,
                        type: acc.type || 'Mid-Range',
                        location: acc.location,
                        description: acc.description,
                        amenities: acc.amenities || [],
                        images: acc.images || [],
                        rating: acc.rating || 0,
                        pricePerNight: acc.pricePerNight || 0,
                        currency: 'USD',
                        website: acc.website || null,
                        email: acc.email || null,
                        phone: acc.phone || null,
                        isActive: true,
                    }
                });

                successCount++;
                console.log(`  ✅ ${successCount}. ${acc.name}`);

            } catch (error) {
                if (error.code === 'P2002') {
                    skipCount++;
                    console.log(`  ⏭️  Skipped (exists): ${acc.name}`);
                } else {
                    errorCount++;
                    console.error(`  ❌ Error: ${acc.name} - ${error.message}`);
                }
            }
        }

        console.log(`\n✅ Accommodations: ${successCount} migrated, ${skipCount} skipped, ${errorCount} errors`);

    } catch (error) {
        console.error('❌ Accommodations migration failed:', error.message);
        throw error;
    }
}

async function migrateBlogs(prisma) {
    console.log('\n' + '='.repeat(60));
    console.log('📦 MIGRATING BLOG POSTS');
    console.log('='.repeat(60));

    try {
        const { blogPosts } = require('./src/data/blogs');
        console.log(`📊 Found ${blogPosts.length} blog posts to migrate\n`);

        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;

        for (const blog of blogPosts) {
            try {
                await prisma.blogPost.create({
                    data: {
                        id: blog.id,
                        title: blog.title,
                        slug: blog.slug,
                        excerpt: blog.excerpt,
                        content: blog.content,
                        category: blog.category || 'Travel Tips',
                        tags: blog.tags || [],
                        author: blog.author || 'Senza Luce Safaris',
                        authorBio: blog.authorBio || null,
                        featuredImage: blog.featuredImage || '/images/blogs/default.jpg',
                        galleryImages: blog.galleryImages || [],
                        metaTitle: blog.metaTitle || null,
                        metaDescription: blog.metaDescription || null,
                        views: blog.views || 0,
                        readingTime: blog.readingTime || 5,
                        isPublished: blog.isPublished !== undefined ? blog.isPublished : true,
                        publishedAt: blog.publishedAt || new Date(),
                    }
                });

                successCount++;
                console.log(`  ✅ ${successCount}. ${blog.title}`);

            } catch (error) {
                if (error.code === 'P2002') {
                    skipCount++;
                    console.log(`  ⏭️  Skipped (exists): ${blog.title}`);
                } else {
                    errorCount++;
                    console.error(`  ❌ Error: ${blog.title} - ${error.message}`);
                }
            }
        }

        console.log(`\n✅ Blog Posts: ${successCount} migrated, ${skipCount} skipped, ${errorCount} errors`);

    } catch (error) {
        console.error('❌ Blog posts migration failed:', error.message);
        throw error;
    }
}

// Run the migration
runMigration().catch(console.error);
