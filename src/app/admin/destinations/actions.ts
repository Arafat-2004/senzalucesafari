"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { z } from "zod";
import { logCmsAction } from "@/lib/reliability/cms-audit";
import { invalidateDestinations } from "@/lib/reliability/cache-manager";

const DestinationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only",
    ),
  region: z.string().min(1, "Region is required"),
  shortDescription: z.string().min(1, "Short description is required").max(500),
  whyVisit: z.string().min(1, "Why Visit is required"),
  fullDescription: z.string().min(1, "Full description is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  parkSize: z.string().optional(),
  elevation: z.string().optional(),
  established: z.string().optional(),
  nearestAirport: z.string().optional(),
  distanceFromArusha: z.string().optional(),
  recommendedStay: z.string().optional(),
  bigFive: z.array(z.string()).optional(),
  keySpecies: z.array(z.string()).optional(),
  uniqueSpecies: z.array(z.string()).optional(),
  wildlifeRating: z.number().int().min(0).max(5),
  bestTimeToGo: z.array(z.string()).optional(),
  peakSeason: z.string().optional(),
  lowSeason: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  landscape: z.string().optional(),
  ecosystems: z.array(z.string()).optional(),
  conservation: z.string().optional(),
  communityInitiatives: z.string().optional(),
  culturalContext: z.string().optional(),
  galleryImages: z.array(z.string()).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  isActive: z.boolean(),
  birdWatching: z.boolean(),
  displayOrder: z.number().int().min(0),
});

function safeJsonParse(val: string, fallback: unknown = []) {
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

function extractData(f: FormData) {
  const bigFiveStr = f.get("bigFive") as string;
  const keySpeciesStr = f.get("keySpecies") as string;
  const uniqueSpeciesStr = f.get("uniqueSpecies") as string;
  const highlightsStr = f.get("highlights") as string;
  const ecosystemsStr = f.get("ecosystems") as string;
  const bestTimeToGoStr = f.get("bestTimeToGo") as string;
  const galleryImagesStr = f.get("galleryImages") as string;

  return {
    name: f.get("name") as string,
    slug: f.get("slug") as string,
    region: f.get("region") as string,
    shortDescription: f.get("shortDescription") as string,
    whyVisit: f.get("whyVisit") as string,
    fullDescription: f.get("fullDescription") as string,
    parkSize: (f.get("parkSize") as string) || undefined,
    elevation: (f.get("elevation") as string) || undefined,
    established: (f.get("established") as string) || undefined,
    nearestAirport: (f.get("nearestAirport") as string) || undefined,
    distanceFromArusha: (f.get("distanceFromArusha") as string) || undefined,
    recommendedStay: (f.get("recommendedStay") as string) || undefined,
    bigFive: safeJsonParse(bigFiveStr, []),
    keySpecies: safeJsonParse(keySpeciesStr, []),
    uniqueSpecies: safeJsonParse(uniqueSpeciesStr, []),
    wildlifeRating: parseInt(f.get("wildlifeRating") as string) || 0,
    bestTimeToGo: safeJsonParse(bestTimeToGoStr, []),
    peakSeason: (f.get("peakSeason") as string) || undefined,
    lowSeason: (f.get("lowSeason") as string) || undefined,
    highlights: safeJsonParse(highlightsStr, []),
    landscape: (f.get("landscape") as string) || undefined,
    ecosystems: safeJsonParse(ecosystemsStr, []),
    conservation: (f.get("conservation") as string) || undefined,
    communityInitiatives: (f.get("communityInitiatives") as string) || undefined,
    culturalContext: (f.get("culturalContext") as string) || undefined,
    imageUrl: f.get("imageUrl") as string,
    galleryImages: safeJsonParse(galleryImagesStr, []),
    metaTitle: (f.get("metaTitle") as string) || undefined,
    metaDescription: (f.get("metaDescription") as string) || undefined,
    isActive: f.get("isActive") === "on",
    birdWatching: f.get("birdWatching") === "on",
    displayOrder: parseInt(f.get("displayOrder") as string) || 0,
  };
}

export async function createDestination(formData: FormData) {
  const admin = await requireAdmin();
  try {
    const data = extractData(formData);
    const validated = DestinationSchema.parse(data) as Record<string, unknown>;
    const slug = validated.slug as string;

    const existing = await prisma.destination.findUnique({ where: { slug } });
    if (existing) {
      throw new Error(`Destination with slug "${slug}" already exists`);
    }

    // biome-ignore lint/suspicious/noExplicitAny: Zod-validated data is structurally compatible with Prisma's Destination input
    const newDestination = await (prisma.destination.create({
      data: validated as unknown as Parameters<
        typeof prisma.destination.create
      >[0]["data"],
    }) as Promise<{ id: string; slug: string }>);

    logCmsAction("destination", "create", {
      entityId: newDestination.id,
      newValue: validated,
      userId: admin.id,
    });
    invalidateDestinations();

    return { success: true, slug };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues
        .map((e: z.ZodIssue) => `${e.path.join(".")}: ${e.message}`)
        .join(", ");
      throw new Error(`Validation failed: ${messages}`);
    }
    throw new Error(
      `Failed to create destination: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function updateDestination(id: string, formData: FormData) {
  const admin = await requireAdmin();
  try {
    const data = extractData(formData);
    const validated = DestinationSchema.parse(data) as Record<string, unknown>;
    const slug = validated.slug as string;

    const existing = await prisma.destination.findFirst({
      where: { slug, NOT: { id } },
    });
    if (existing) {
      throw new Error(`Destination with slug "${slug}" already exists`);
    }

    const currentDestination = await prisma.destination.findUnique({
      where: { id },
    });
    // biome-ignore lint/suspicious/noExplicitAny: Zod-validated data is structurally compatible with Prisma's Destination input
    await prisma.destination.update({
      where: { id },
      data: validated as unknown as Parameters<
        typeof prisma.destination.update
      >[0]["data"],
    });

    if (currentDestination) {
      logCmsAction("destination", "update", {
        entityId: id,
        previousValue: currentDestination,
        newValue: validated,
        userId: admin.id,
      });
    }
    invalidateDestinations();

    return { success: true, slug };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues
        .map((e: z.ZodIssue) => `${e.path.join(".")}: ${e.message}`)
        .join(", ");
      throw new Error(`Validation failed: ${messages}`);
    }
    throw new Error(
      `Failed to update destination: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function deleteDestination(id: string) {
  const admin = await requireAdmin();
  try {
    await prisma.destination.delete({ where: { id } });

    logCmsAction("destination", "delete", { entityId: id, userId: admin.id });
    invalidateDestinations();
  } catch (error) {
    throw new Error(
      `Failed to delete destination: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
