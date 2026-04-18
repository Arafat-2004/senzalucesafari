import path from 'node:path';
import { randomUUID } from 'node:crypto';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { tourPackages } from '../src/data/tours';
import { destinations, additionalDestinations } from '../src/data/destinations';
import {
  luxuryAccommodations,
  midrangeAccommodations,
  budgetAccommodations,
} from '../src/data/accommodations';
import { blogArticles } from '../src/data/blogs';
import { sampleReviews } from '../src/data/sample-reviews';
import { vehicles } from '../src/app/vehicles/data';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is missing in .env');
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }, // Supabase pooler uses self-signed CA; scoped to this connection only
});

type CountMap = Record<string, number>;

function normalize(text: string): string {
  return text.toLowerCase().replaceAll(/[^a-z0-9]+/g, ' ').trim();
}

function parseDate(value?: string): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function pickTourForReview(packageName: string): string | null {
  const n = normalize(packageName);

  const exact = tourPackages.find((t) => normalize(t.name) === n);
  if (exact) return exact.id;

  if (n.includes('great migration')) {
    const t = tourPackages.find((x) => normalize(x.name).includes('great migration'));
    return t?.id ?? null;
  }

  if (n.includes('zanzibar')) {
    const t = tourPackages.find((x) => normalize(x.name).includes('zanzibar'));
    return t?.id ?? null;
  }

  if (n.includes('kilimanjaro')) {
    const t = tourPackages.find((x) => normalize(x.name).includes('kilimanjaro'));
    return t?.id ?? null;
  }

  if (n.includes('serengeti')) {
    const t = tourPackages.find((x) => normalize(x.name).includes('3 days') && normalize(x.name).includes('serengeti'));
    return t?.id ?? null;
  }

  if (n.includes('wildlife')) {
    const t = tourPackages.find((x) => normalize(x.name).includes('tanzania wildlife'));
    return t?.id ?? null;
  }

  return null;
}

function blogContentFromSections(sections: any[]): string {
  const chunks: string[] = [];
  for (const section of sections ?? []) {
    const c = section?.content;
    if (!c) continue;
    if (typeof c === 'string') {
      chunks.push(c);
      continue;
    }
    if (typeof c.text === 'string') chunks.push(c.text);
    if (typeof c.title === 'string') chunks.push(c.title);
    if (Array.isArray(c.items)) {
      for (const i of c.items) {
        if (typeof i === 'string') chunks.push(i);
        if (i && typeof i === 'object' && typeof i.title === 'string') chunks.push(i.title);
      }
    }
  }

  const joined = chunks.join('\n\n').trim();
  return joined.length > 0 ? joined : 'Article content available in structured sections.';
}

async function getTableCounts(client: any): Promise<CountMap> {
  const tables = [
    'tours',
    'tour_pricing',
    'destinations',
    'tour_destinations',
    'accommodations',
    'vehicles',
    'bookings',
    'reviews',
    'guides',
    'contact_inquiries',
    'newsletters',
    'blog_posts',
    'faqs',
    'media',
    'site_settings',
    'page_views',
  ];

  const counts: CountMap = {};
  for (const table of tables) {
    const rs = await client.query(`select count(*)::int as count from "${table}"`);
    counts[table] = rs.rows[0].count;
  }
  return counts;
}

async function migrate(): Promise<void> {
  const client = await pool.connect();
  const allAccommodations = [
    ...luxuryAccommodations,
    ...midrangeAccommodations,
    ...budgetAccommodations,
  ];

  console.log('Starting migration to Supabase...');

  try {
    const before = await getTableCounts(client);
    console.log('Row counts before migration:', before);

    await client.query('BEGIN');

    for (const tour of tourPackages) {
      const now = new Date();
      await client.query(
        `
        INSERT INTO "tours" (
          "id", "name", "slug", "category", "shortDescription", "overview", "bestFor", "duration", "startEnd",
          "highlights", "itinerary", "included", "excluded", "imageUrl", "priceFrom", "rating", "reviewCount",
          "difficulty", "isActive", "isFeatured", "displayOrder", "createdAt", "updatedAt"
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,
          $10,$11::jsonb,$12,$13,$14,$15,$16,$17,
          $18,$19,$20,$21,$22,$23
        )
        ON CONFLICT ("id") DO UPDATE SET
          "name" = EXCLUDED."name",
          "slug" = EXCLUDED."slug",
          "category" = EXCLUDED."category",
          "shortDescription" = EXCLUDED."shortDescription",
          "overview" = EXCLUDED."overview",
          "bestFor" = EXCLUDED."bestFor",
          "duration" = EXCLUDED."duration",
          "startEnd" = EXCLUDED."startEnd",
          "highlights" = EXCLUDED."highlights",
          "itinerary" = EXCLUDED."itinerary",
          "included" = EXCLUDED."included",
          "excluded" = EXCLUDED."excluded",
          "imageUrl" = EXCLUDED."imageUrl",
          "priceFrom" = EXCLUDED."priceFrom",
          "rating" = EXCLUDED."rating",
          "reviewCount" = EXCLUDED."reviewCount",
          "difficulty" = EXCLUDED."difficulty",
          "isActive" = EXCLUDED."isActive",
          "isFeatured" = EXCLUDED."isFeatured",
          "displayOrder" = EXCLUDED."displayOrder",
          "updatedAt" = EXCLUDED."updatedAt"
        `,
        [
          tour.id,
          tour.name,
          tour.slug,
          tour.category,
          tour.shortDescription,
          tour.overview,
          tour.bestFor,
          tour.duration,
          tour.startEnd,
          tour.highlights,
          JSON.stringify(tour.itinerary ?? []),
          tour.included,
          tour.excluded,
          tour.imageUrl,
          tour.priceFrom,
          tour.rating,
          tour.reviewCount,
          tour.difficulty ?? null,
          true,
          false,
          0,
          now,
          now,
        ]
      );
    }

    const allDestinations = [...destinations, ...additionalDestinations];
    for (const destination of allDestinations) {
      const now = new Date();
      await client.query(
        `
        INSERT INTO "destinations" (
          "id", "name", "slug", "region", "shortDescription", "whyVisit", "fullDescription", "parkSize", "elevation",
          "established", "nearestAirport", "distanceFromArusha", "distanceFromDarEsSalaam", "recommendedStay", "bigFive",
          "keySpecies", "birdWatching", "uniqueSpecies", "wildlifeRating", "bestTimeToGo", "peakSeason", "lowSeason",
          "monthlyBreakdown", "activities", "highlights", "landscape", "ecosystems", "accommodations", "gettingThere",
          "suggestedItineraries", "sampleItineraries", "conservation", "communityInitiatives", "culturalContext", "localTribes",
          "travelTips", "faqs", "imageUrl", "galleryImages", "metaTitle", "metaDescription", "isActive", "displayOrder", "rawData", "createdAt", "updatedAt"
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,
          $10,$11,$12,$13,$14,$15,
          $16,$17,$18,$19,$20,$21,$22,
          $23::jsonb,$24::jsonb,$25,$26,$27,$28::jsonb,$29::jsonb,
          $30,$31::jsonb,$32,$33,$34,$35,
          $36::jsonb,$37::jsonb,$38,$39,$40,$41,$42,$43,$44::jsonb,$45,$46
        )
        ON CONFLICT ("id") DO UPDATE SET
          "name" = EXCLUDED."name",
          "slug" = EXCLUDED."slug",
          "region" = EXCLUDED."region",
          "shortDescription" = EXCLUDED."shortDescription",
          "whyVisit" = EXCLUDED."whyVisit",
          "fullDescription" = EXCLUDED."fullDescription",
          "parkSize" = EXCLUDED."parkSize",
          "elevation" = EXCLUDED."elevation",
          "established" = EXCLUDED."established",
          "nearestAirport" = EXCLUDED."nearestAirport",
          "distanceFromArusha" = EXCLUDED."distanceFromArusha",
          "distanceFromDarEsSalaam" = EXCLUDED."distanceFromDarEsSalaam",
          "recommendedStay" = EXCLUDED."recommendedStay",
          "bigFive" = EXCLUDED."bigFive",
          "keySpecies" = EXCLUDED."keySpecies",
          "birdWatching" = EXCLUDED."birdWatching",
          "uniqueSpecies" = EXCLUDED."uniqueSpecies",
          "wildlifeRating" = EXCLUDED."wildlifeRating",
          "bestTimeToGo" = EXCLUDED."bestTimeToGo",
          "peakSeason" = EXCLUDED."peakSeason",
          "lowSeason" = EXCLUDED."lowSeason",
          "monthlyBreakdown" = EXCLUDED."monthlyBreakdown",
          "activities" = EXCLUDED."activities",
          "highlights" = EXCLUDED."highlights",
          "landscape" = EXCLUDED."landscape",
          "ecosystems" = EXCLUDED."ecosystems",
          "accommodations" = EXCLUDED."accommodations",
          "gettingThere" = EXCLUDED."gettingThere",
          "suggestedItineraries" = EXCLUDED."suggestedItineraries",
          "sampleItineraries" = EXCLUDED."sampleItineraries",
          "conservation" = EXCLUDED."conservation",
          "communityInitiatives" = EXCLUDED."communityInitiatives",
          "culturalContext" = EXCLUDED."culturalContext",
          "localTribes" = EXCLUDED."localTribes",
          "travelTips" = EXCLUDED."travelTips",
          "faqs" = EXCLUDED."faqs",
          "imageUrl" = EXCLUDED."imageUrl",
          "galleryImages" = EXCLUDED."galleryImages",
          "metaTitle" = EXCLUDED."metaTitle",
          "metaDescription" = EXCLUDED."metaDescription",
          "isActive" = EXCLUDED."isActive",
          "displayOrder" = EXCLUDED."displayOrder",
          "rawData" = EXCLUDED."rawData",
          "updatedAt" = EXCLUDED."updatedAt"
        `,
        [
          destination.id,
          destination.name,
          destination.slug,
          destination.region,
          destination.shortDescription,
          destination.whyVisit,
          destination.fullDescription,
          destination.parkSize ?? null,
          destination.elevation ?? null,
          destination.established ?? null,
          destination.nearestAirport ?? null,
          destination.distanceFromArusha ?? null,
          (destination as any).distanceFromDarEsSalaam ?? null,
          destination.recommendedStay ?? null,
          destination.bigFive ?? [],
          destination.keySpecies ?? [],
          destination.birdWatching ?? false,
          destination.uniqueSpecies ?? [],
          Math.round(destination.wildlifeRating ?? 0),
          destination.bestTimeToGo ?? [],
          destination.peakSeason ?? null,
          destination.lowSeason ?? null,
          JSON.stringify(destination.monthlyBreakdown ?? []),
          JSON.stringify(destination.activities ?? []),
          destination.highlights ?? [],
          destination.landscape ?? null,
          destination.ecosystems ?? [],
          JSON.stringify(destination.accommodations ?? []),
          JSON.stringify(destination.gettingThere ?? {}),
          (destination as any).suggestedItineraries ?? null,
          JSON.stringify((destination as any).sampleItineraries ?? []),
          destination.conservation ?? null,
          destination.communityInitiatives ?? null,
          destination.culturalContext ?? null,
          (destination as any).localTribes ?? [],
          JSON.stringify(destination.travelTips ?? []),
          JSON.stringify(destination.faqs ?? []),
          destination.imageUrl,
          (destination as any).gallery ?? [],
          (destination as any).metaTitle ?? null,
          (destination as any).metaDescription ?? null,
          true,
          0,
          JSON.stringify(destination),
          now,
          now,
        ]
      );
    }

    for (const accommodation of allAccommodations) {
      const now = new Date();
      let type = 'Budget';
      if (accommodation.tier === 'luxury') {
        type = 'Luxury';
      } else if (accommodation.tier === 'midrange') {
        type = 'Mid-Range';
      }

      await client.query(
        `
        INSERT INTO "accommodations" (
          "id", "name", "slug", "type", "tier", "location", "description", "priceRange", "pricePerNight",
          "currency", "amenities", "images", "bestFor", "highlights", "rating", "isActive", "rawData", "createdAt", "updatedAt"
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,
          $10,$11,$12,$13,$14,$15,$16,$17::jsonb,$18,$19
        )
        ON CONFLICT ("id") DO UPDATE SET
          "name" = EXCLUDED."name",
          "slug" = EXCLUDED."slug",
          "type" = EXCLUDED."type",
          "tier" = EXCLUDED."tier",
          "location" = EXCLUDED."location",
          "description" = EXCLUDED."description",
          "priceRange" = EXCLUDED."priceRange",
          "pricePerNight" = EXCLUDED."pricePerNight",
          "currency" = EXCLUDED."currency",
          "amenities" = EXCLUDED."amenities",
          "images" = EXCLUDED."images",
          "bestFor" = EXCLUDED."bestFor",
          "highlights" = EXCLUDED."highlights",
          "rating" = EXCLUDED."rating",
          "isActive" = EXCLUDED."isActive",
          "rawData" = EXCLUDED."rawData",
          "updatedAt" = EXCLUDED."updatedAt"
        `,
        [
          accommodation.id,
          accommodation.name,
          accommodation.id,
          type,
          accommodation.tier,
          accommodation.location,
          accommodation.description,
          accommodation.priceRange,
          accommodation.pricePerNight,
          'USD',
          accommodation.amenities ?? [],
          [accommodation.image],
          accommodation.bestFor ?? [],
          accommodation.highlights ?? [],
          accommodation.rating,
          true,
          JSON.stringify(accommodation),
          now,
          now,
        ]
      );
    }

    for (const vehicle of vehicles) {
      const now = new Date();
      const vehicleId = `vehicle-${vehicle.id}`;
      const images = [
        vehicle.imageUrl,
        ...(vehicle.interiorImages ?? []),
        ...(vehicle.exteriorImages ?? []),
        ...(vehicle.actionShots ?? []),
      ];

      await client.query(
        `
        INSERT INTO "vehicles" (
          "id", "name", "type", "category", "imageUrl", "capacity", "description", "features", "images",
          "engine", "transmission", "fuelType", "year", "rating", "reviews", "priceRange", "bestFor", "specifications",
          "safetyFeatures", "safariEquipment", "interiorImages", "exteriorImages", "actionShots", "isActive", "rawData", "createdAt", "updatedAt"
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,
          $10,$11,$12,$13,$14,$15,$16,$17,$18::jsonb,
          $19,$20,$21,$22,$23,$24,$25::jsonb,$26,$27
        )
        ON CONFLICT ("id") DO UPDATE SET
          "name" = EXCLUDED."name",
          "type" = EXCLUDED."type",
          "category" = EXCLUDED."category",
          "imageUrl" = EXCLUDED."imageUrl",
          "capacity" = EXCLUDED."capacity",
          "description" = EXCLUDED."description",
          "features" = EXCLUDED."features",
          "images" = EXCLUDED."images",
          "engine" = EXCLUDED."engine",
          "transmission" = EXCLUDED."transmission",
          "fuelType" = EXCLUDED."fuelType",
          "year" = EXCLUDED."year",
          "rating" = EXCLUDED."rating",
          "reviews" = EXCLUDED."reviews",
          "priceRange" = EXCLUDED."priceRange",
          "bestFor" = EXCLUDED."bestFor",
          "specifications" = EXCLUDED."specifications",
          "safetyFeatures" = EXCLUDED."safetyFeatures",
          "safariEquipment" = EXCLUDED."safariEquipment",
          "interiorImages" = EXCLUDED."interiorImages",
          "exteriorImages" = EXCLUDED."exteriorImages",
          "actionShots" = EXCLUDED."actionShots",
          "isActive" = EXCLUDED."isActive",
          "rawData" = EXCLUDED."rawData",
          "updatedAt" = EXCLUDED."updatedAt"
        `,
        [
          vehicleId,
          vehicle.name,
          vehicle.category,
          vehicle.category,
          vehicle.imageUrl,
          vehicle.capacity,
          vehicle.features?.join('; ') ?? vehicle.category,
          vehicle.features ?? [],
          images,
          vehicle.specifications?.engine ?? null,
          vehicle.specifications?.transmission ?? null,
          (vehicle.specifications as any)?.fuelType ?? null,
          null,
          vehicle.rating,
          vehicle.reviews,
          vehicle.priceRange,
          vehicle.bestFor ?? [],
          JSON.stringify(vehicle.specifications ?? {}),
          vehicle.safetyFeatures ?? [],
          vehicle.safariEquipment ?? [],
          vehicle.interiorImages ?? [],
          vehicle.exteriorImages ?? [],
          vehicle.actionShots ?? [],
          true,
          JSON.stringify(vehicle),
          now,
          now,
        ]
      );
    }

    const blogList = Object.values(blogArticles);
    for (const article of blogList) {
      const now = new Date();
      const readingTime = Number.parseInt((article.readTime ?? '').replaceAll(/\D/g, ''), 10) || 5;
      const excerpt = (article.excerpt ?? article.subtitle ?? article.title ?? '').slice(0, 500);
      const content = blogContentFromSections(article.sections as any[]);
      const tags = Array.from(new Set((article.category ?? '').split(/[,&/-]+/).map((x) => x.trim()).filter(Boolean)));
      const relatedImages = (article.relatedPosts ?? []).map((x: any) => x.image).filter(Boolean);
      const galleryImages = Array.from(new Set([article.heroImage, ...relatedImages]));

      await client.query(
        `
        INSERT INTO "blog_posts" (
          "id", "title", "slug", "subtitle", "excerpt", "content", "category", "tags", "author", "authorBio",
          "featuredImage", "galleryImages", "metaTitle", "metaDescription", "views", "readingTime", "isPublished",
          "publishedAt", "sections", "relatedPosts", "rawData", "createdAt", "updatedAt"
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
          $11,$12,$13,$14,$15,$16,$17,
          $18,$19::jsonb,$20::jsonb,$21::jsonb,$22,$23
        )
        ON CONFLICT ("id") DO UPDATE SET
          "title" = EXCLUDED."title",
          "slug" = EXCLUDED."slug",
          "subtitle" = EXCLUDED."subtitle",
          "excerpt" = EXCLUDED."excerpt",
          "content" = EXCLUDED."content",
          "category" = EXCLUDED."category",
          "tags" = EXCLUDED."tags",
          "author" = EXCLUDED."author",
          "authorBio" = EXCLUDED."authorBio",
          "featuredImage" = EXCLUDED."featuredImage",
          "galleryImages" = EXCLUDED."galleryImages",
          "metaTitle" = EXCLUDED."metaTitle",
          "metaDescription" = EXCLUDED."metaDescription",
          "views" = EXCLUDED."views",
          "readingTime" = EXCLUDED."readingTime",
          "isPublished" = EXCLUDED."isPublished",
          "publishedAt" = EXCLUDED."publishedAt",
          "sections" = EXCLUDED."sections",
          "relatedPosts" = EXCLUDED."relatedPosts",
          "rawData" = EXCLUDED."rawData",
          "updatedAt" = EXCLUDED."updatedAt"
        `,
        [
          article.slug,
          article.title,
          article.slug,
          article.subtitle ?? null,
          excerpt,
          content,
          article.category,
          tags,
          article.author,
          article.authorBio ?? null,
          article.heroImage,
          galleryImages,
          article.title,
          article.subtitle ?? null,
          0,
          readingTime,
          true,
          parseDate(article.date),
          JSON.stringify(article.sections ?? []),
          JSON.stringify(article.relatedPosts ?? []),
          JSON.stringify(article),
          now,
          now,
        ]
      );
    }

    for (const review of sampleReviews) {
      const now = new Date();
      const tourId = pickTourForReview(review.safariPackage ?? '');
      if (!tourId) {
        console.warn(`Skipping review ${review.id}: no tour match for package '${review.safariPackage}'`);
        continue;
      }

      await client.query(
        `
        INSERT INTO "reviews" (
          "id", "tourId", "customerName", "customerEmail", "author", "country", "rating", "title", "comment", "content",
          "safariPackage", "travelDate", "reviewDate", "verified", "isApproved", "isFeatured", "helpfulCount", "helpful", "rawData", "createdAt", "updatedAt"
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
          $11,$12,$13,$14,$15,$16,$17,$18,$19::jsonb,$20,$21
        )
        ON CONFLICT ("id") DO UPDATE SET
          "tourId" = EXCLUDED."tourId",
          "customerName" = EXCLUDED."customerName",
          "customerEmail" = EXCLUDED."customerEmail",
          "author" = EXCLUDED."author",
          "country" = EXCLUDED."country",
          "rating" = EXCLUDED."rating",
          "title" = EXCLUDED."title",
          "comment" = EXCLUDED."comment",
          "content" = EXCLUDED."content",
          "safariPackage" = EXCLUDED."safariPackage",
          "travelDate" = EXCLUDED."travelDate",
          "reviewDate" = EXCLUDED."reviewDate",
          "verified" = EXCLUDED."verified",
          "isApproved" = EXCLUDED."isApproved",
          "isFeatured" = EXCLUDED."isFeatured",
          "helpfulCount" = EXCLUDED."helpfulCount",
          "helpful" = EXCLUDED."helpful",
          "rawData" = EXCLUDED."rawData",
          "updatedAt" = EXCLUDED."updatedAt"
        `,
        [
          `sample-review-${review.id}`,
          tourId,
          review.author,
          null,
          review.author,
          null,
          Math.round(review.rating),
          review.title,
          review.content,
          review.content,
          review.safariPackage,
          parseDate(review.date),
          parseDate(review.date),
          Boolean(review.verified),
          true,
          false,
          Math.round(review.helpful ?? 0),
          Math.round(review.helpful ?? 0),
          JSON.stringify(review),
          now,
          now,
        ]
      );
    }

    for (const tour of tourPackages) {
      for (const destSlug of tour.destinations ?? []) {
        const destination = destinations.find((d) => d.slug === destSlug || d.id === destSlug);
        if (!destination) continue;

        await client.query(
          `
          INSERT INTO "tour_destinations" ("id", "tourId", "destinationId")
          VALUES ($1, $2, $3)
          ON CONFLICT ("tourId", "destinationId") DO NOTHING
          `,
          [randomUUID(), tour.id, destination.id]
        );
      }
    }

    await client.query('COMMIT');

    const after = await getTableCounts(client);

    const expected: CountMap = {
      tours: tourPackages.length,
      destinations: allDestinations.length,
      accommodations: allAccommodations.length,
      vehicles: vehicles.length,
      blog_posts: Object.keys(blogArticles).length,
      reviews: sampleReviews.length,
      tour_destinations: tourPackages.reduce((sum, t) => sum + (t.destinations?.length ?? 0), 0),
    };

    const integrityChecks = {
      orphan_reviews: (await client.query(`
        SELECT count(*)::int AS count
        FROM "reviews" r
        LEFT JOIN "tours" t ON t."id" = r."tourId"
        WHERE t."id" IS NULL
      `)).rows[0].count,
      orphan_tour_destinations: (await client.query(`
        SELECT count(*)::int AS count
        FROM "tour_destinations" td
        LEFT JOIN "tours" t ON t."id" = td."tourId"
        LEFT JOIN "destinations" d ON d."id" = td."destinationId"
        WHERE t."id" IS NULL OR d."id" IS NULL
      `)).rows[0].count,
    };

    const samples = await client.query(`
      SELECT t."id", t."name", t."slug", t."priceFrom"
      FROM "tours" t
      ORDER BY random()
      LIMIT 5
    `);

    console.log('\n=== MIGRATION SUMMARY ===');
    console.log('Counts before:', before);
    console.log('Counts after:', after);
    console.log('Expected source counts:', expected);
    console.log('Integrity checks:', integrityChecks);
    console.log('Random tour samples:', samples.rows);

    for (const [table, expectedCount] of Object.entries(expected)) {
      const actual = after[table] ?? 0;
      if (actual < expectedCount) {
        throw new Error(`Validation failed for ${table}: expected at least ${expectedCount}, got ${actual}`);
      }
    }

    if (integrityChecks.orphan_reviews !== 0 || integrityChecks.orphan_tour_destinations !== 0) {
      throw new Error(`Integrity validation failed: ${JSON.stringify(integrityChecks)}`);
    }

    console.log('\nMigration and validation completed successfully.');
  } catch (error: any) {
    console.error('Migration failed:', error?.message ?? error);
    try {
      await client.query('ROLLBACK');
    } catch {
      // ignored
    }
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
