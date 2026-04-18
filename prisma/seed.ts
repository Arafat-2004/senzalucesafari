/**
 * Database Seed Script
 * 
 * Populates the Supabase database with all static data from src/data/ files.
 * Run with: npx tsx prisma/seed.ts
 */

import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

// Import static data
import { tourPackages } from '../src/data/tours';
import { destinations, additionalDestinations } from '../src/data/destinations';
import { luxuryAccommodations, midrangeAccommodations, budgetAccommodations } from '../src/data/accommodations';
import { blogArticles } from '../src/data/blogs';
import { testimonials, companyInfo } from '../src/data/company';
import { sampleReviews } from '../src/data/sample-reviews';

const connectionString = process.env.DATABASE_URL ?? '';

const url = new URL(connectionString);
url.searchParams.delete('sslmode');

const adapter = new PrismaPg({
    connectionString: url.toString(),
    ssl: { rejectUnauthorized: false },
});

const prisma = new PrismaClient({ adapter });

async function seedTours() {
    console.log('Seeding tours...');
    
    for (const tour of tourPackages) {
        await prisma.tour.upsert({
            where: { slug: tour.slug },
            update: {
                name: tour.name,
                category: tour.category,
                shortDescription: tour.shortDescription,
                overview: tour.overview,
                bestFor: tour.bestFor,
                duration: tour.duration,
                startEnd: tour.startEnd,
                highlights: tour.highlights,
                itinerary: tour.itinerary as any,
                included: tour.included,
                excluded: tour.excluded,
                imageUrl: tour.imageUrl,
                priceFrom: tour.priceFrom,
                rating: tour.rating,
                reviewCount: tour.reviewCount,
                difficulty: tour.difficulty ?? null,
                isActive: true,
            },
            create: {
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
                itinerary: tour.itinerary as any,
                included: tour.included,
                excluded: tour.excluded,
                imageUrl: tour.imageUrl,
                priceFrom: tour.priceFrom,
                rating: tour.rating,
                reviewCount: tour.reviewCount,
                difficulty: tour.difficulty ?? null,
                isActive: true,
                isFeatured: tourPackages.indexOf(tour) < 3, // First 3 are featured
                displayOrder: tourPackages.indexOf(tour),
            },
        });
    }
    
    console.log(`  Seeded ${tourPackages.length} tours`);
}

async function seedDestinations() {
    console.log('Seeding destinations...');
    
    const allDests = [...destinations, ...additionalDestinations];
    
    for (let i = 0; i < allDests.length; i++) {
        const dest = allDests[i];
        await prisma.destination.upsert({
            where: { slug: dest.slug },
            update: {
                name: dest.name,
                region: dest.region,
                shortDescription: dest.shortDescription,
                whyVisit: dest.whyVisit,
                fullDescription: dest.fullDescription,
                parkSize: dest.parkSize ?? null,
                elevation: dest.elevation ?? null,
                established: dest.established ?? null,
                nearestAirport: dest.nearestAirport ?? null,
                distanceFromArusha: dest.distanceFromArusha ?? null,
                distanceFromDarEsSalaam: dest.distanceFromDarEsSalaam ?? null,
                recommendedStay: dest.recommendedStay ?? null,
                bigFive: dest.bigFive ?? [],
                keySpecies: dest.keySpecies ?? [],
                birdWatching: dest.birdWatching ?? false,
                uniqueSpecies: dest.uniqueSpecies ?? [],
                wildlifeRating: dest.wildlifeRating ?? 0,
                bestTimeToGo: dest.bestTimeToGo ?? [],
                peakSeason: dest.peakSeason ?? null,
                lowSeason: dest.lowSeason ?? null,
                monthlyBreakdown: (dest.monthlyBreakdown ?? []) as any,
                activities: (dest.activities ?? []) as any,
                highlights: dest.highlights ?? [],
                landscape: dest.landscape ?? null,
                ecosystems: dest.ecosystems ?? [],
                accommodations: (dest.accommodations ?? []) as any,
                sampleItineraries: (dest.sampleItineraries ?? []) as any,
                gettingThere: (dest.gettingThere ?? {}) as any,
                conservation: dest.conservation ?? null,
                communityInitiatives: dest.communityInitiatives ?? null,
                culturalContext: dest.culturalContext ?? null,
                travelTips: (dest.travelTips ?? []) as any,
                faqs: (dest.faqs ?? []) as any,
                imageUrl: dest.imageUrl,
                galleryImages: dest.gallery ?? [],
                localTribes: dest.localTribes ?? [],
                rawData: { wildlife: dest.wildlife ?? [] } as any,
                metaTitle: dest.metaTitle ?? null,
                metaDescription: dest.metaDescription ?? null,
                isActive: true,
                displayOrder: i,
            },
            create: {
                id: dest.id,
                name: dest.name,
                slug: dest.slug,
                region: dest.region,
                shortDescription: dest.shortDescription,
                whyVisit: dest.whyVisit,
                fullDescription: dest.fullDescription,
                parkSize: dest.parkSize ?? null,
                elevation: dest.elevation ?? null,
                established: dest.established ?? null,
                nearestAirport: dest.nearestAirport ?? null,
                distanceFromArusha: dest.distanceFromArusha ?? null,
                distanceFromDarEsSalaam: dest.distanceFromDarEsSalaam ?? null,
                recommendedStay: dest.recommendedStay ?? null,
                bigFive: dest.bigFive ?? [],
                keySpecies: dest.keySpecies ?? [],
                birdWatching: dest.birdWatching ?? false,
                uniqueSpecies: dest.uniqueSpecies ?? [],
                wildlifeRating: dest.wildlifeRating ?? 0,
                bestTimeToGo: dest.bestTimeToGo ?? [],
                peakSeason: dest.peakSeason ?? null,
                lowSeason: dest.lowSeason ?? null,
                monthlyBreakdown: (dest.monthlyBreakdown ?? []) as any,
                activities: (dest.activities ?? []) as any,
                highlights: dest.highlights ?? [],
                landscape: dest.landscape ?? null,
                ecosystems: dest.ecosystems ?? [],
                accommodations: (dest.accommodations ?? []) as any,
                sampleItineraries: (dest.sampleItineraries ?? []) as any,
                gettingThere: (dest.gettingThere ?? {}) as any,
                conservation: dest.conservation ?? null,
                communityInitiatives: dest.communityInitiatives ?? null,
                culturalContext: dest.culturalContext ?? null,
                travelTips: (dest.travelTips ?? []) as any,
                faqs: (dest.faqs ?? []) as any,
                imageUrl: dest.imageUrl,
                galleryImages: dest.gallery ?? [],
                localTribes: dest.localTribes ?? [],
                rawData: { wildlife: dest.wildlife ?? [] } as any,
                metaTitle: dest.metaTitle ?? null,
                metaDescription: dest.metaDescription ?? null,
                isActive: true,
                displayOrder: i,
            },
        });
    }
    
    console.log(`  Seeded ${allDests.length} destinations`);
}

async function seedTourDestinations() {
    console.log('Seeding tour-destination relationships...');
    let count = 0;
    
    for (const tour of tourPackages) {
        if (!tour.destinations || tour.destinations.length === 0) continue;
        
        for (const destSlug of tour.destinations) {
            const destination = await prisma.destination.findUnique({ where: { slug: destSlug } });
            if (!destination) continue;
            
            await prisma.tourDestination.upsert({
                where: {
                    tourId_destinationId: {
                        tourId: tour.id,
                        destinationId: destination.id,
                    },
                },
                update: {},
                create: {
                    tourId: tour.id,
                    destinationId: destination.id,
                },
            });
            count++;
        }
    }
    
    console.log(`  Seeded ${count} tour-destination relationships`);
}

async function seedAccommodations() {
    console.log('Seeding accommodations...');
    
    const allAccommodations = [
        ...luxuryAccommodations.map(a => ({ ...a, type: 'Luxury' as const })),
        ...midrangeAccommodations.map(a => ({ ...a, type: 'Mid-Range' as const })),
        ...budgetAccommodations.map(a => ({ ...a, type: 'Budget' as const })),
    ];
    
    for (const acc of allAccommodations) {
        const slug = acc.id;
        await prisma.accommodation.upsert({
            where: { slug },
            update: {
                name: acc.name,
                type: acc.type,
                tier: acc.tier,
                location: acc.location,
                description: acc.description,
                priceRange: acc.priceRange,
                pricePerNight: acc.pricePerNight,
                rating: acc.rating,
                amenities: acc.amenities,
                images: [acc.image],
                bestFor: acc.bestFor,
                highlights: acc.highlights,
                isActive: true,
            },
            create: {
                name: acc.name,
                slug,
                type: acc.type,
                tier: acc.tier,
                location: acc.location,
                description: acc.description,
                priceRange: acc.priceRange,
                pricePerNight: acc.pricePerNight,
                rating: acc.rating,
                amenities: acc.amenities,
                images: [acc.image],
                bestFor: acc.bestFor,
                highlights: acc.highlights,
                isActive: true,
            },
        });
    }
    
    console.log(`  Seeded ${allAccommodations.length} accommodations`);
}

async function seedBlogs() {
    console.log('Seeding blog posts...');
    
    const articles = Object.values(blogArticles);
    
    for (const article of articles) {
        const readingTime = parseInt(article.readTime) || 5;
        
        await prisma.blogPost.upsert({
            where: { slug: article.slug },
            update: {
                title: article.title,
                subtitle: article.subtitle,
                excerpt: article.excerpt ?? article.subtitle,
                content: article.sections.map((s: any) => 
                    typeof s.content === 'string' ? s.content : s.content?.text ?? ''
                ).join('\n\n'),
                sections: article.sections as any,
                relatedPosts: article.relatedPosts as any,
                category: article.category,
                tags: [],
                author: article.author,
                authorBio: article.authorBio,
                featuredImage: article.heroImage,
                galleryImages: [],
                readingTime,
                isPublished: true,
                publishedAt: new Date(article.date),
            },
            create: {
                title: article.title,
                slug: article.slug,
                subtitle: article.subtitle,
                excerpt: article.excerpt ?? article.subtitle,
                content: article.sections.map((s: any) => 
                    typeof s.content === 'string' ? s.content : s.content?.text ?? ''
                ).join('\n\n'),
                sections: article.sections as any,
                relatedPosts: article.relatedPosts as any,
                category: article.category,
                tags: [],
                author: article.author,
                authorBio: article.authorBio,
                featuredImage: article.heroImage,
                galleryImages: [],
                readingTime,
                isPublished: true,
                publishedAt: new Date(article.date),
            },
        });
    }
    
    console.log(`  Seeded ${articles.length} blog posts`);
}

async function seedReviews() {
    console.log('Seeding reviews...');
    
    // Find tour IDs for matching reviews to tours
    const tours = await prisma.tour.findMany({ select: { id: true, name: true } });
    const tourMap = new Map(tours.map(t => [t.name, t.id]));
    
    // Use the first tour as fallback
    const fallbackTourId = tours[0]?.id;
    
    for (let i = 0; i < sampleReviews.length; i++) {
        const review = sampleReviews[i];
        // Try to match the review to a tour
        let tourId = fallbackTourId;
        if (review.safariPackage) {
            for (const [name, id] of tourMap) {
                if (name.includes(review.safariPackage) || review.safariPackage.includes(name)) {
                    tourId = id;
                    break;
                }
            }
        }
        
        if (!tourId) continue;
        
        // Use a deterministic ID based on author+title to allow upsert
        const reviewId = `seed-review-${i}`;
        
        await prisma.review.upsert({
            where: { id: reviewId },
            update: {
                tourId,
                customerName: review.author,
                author: review.author,
                rating: review.rating,
                title: review.title,
                comment: review.content,
                content: review.content,
                safariPackage: review.safariPackage ?? null,
                reviewDate: new Date(review.date),
                helpfulCount: review.helpful,
                verified: review.verified,
                isApproved: true,
                isFeatured: true,
            },
            create: {
                id: reviewId,
                tourId,
                customerName: review.author,
                author: review.author,
                rating: review.rating,
                title: review.title,
                comment: review.content,
                content: review.content,
                safariPackage: review.safariPackage ?? null,
                reviewDate: new Date(review.date),
                helpfulCount: review.helpful,
                verified: review.verified,
                isApproved: true,
                isFeatured: true,
            },
        });
    }
    
    console.log(`  Seeded ${sampleReviews.length} reviews`);
}

async function main() {
    console.log('Starting database seed...\n');
    
    try {
        await seedTours();
        await seedDestinations();
        await seedTourDestinations();
        await seedAccommodations();
        await seedBlogs();
        await seedReviews();
        
        console.log('\nDatabase seed completed successfully!');
    } catch (error) {
        console.error('Seed error:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main();
