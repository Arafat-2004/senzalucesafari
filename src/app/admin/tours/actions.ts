"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { z } from "zod";
import {
  logTourCreate,
  logTourUpdate,
  logTourDelete,
} from "@/lib/reliability/cms-audit";
import { invalidateTours } from "@/lib/reliability/cache-manager";

const TourSchema = z.object({
  name: z.string().min(1, "Tour name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only",
    ),
  category: z.string().min(1, "Category is required"),
  shortDescription: z.string().min(1, "Short description is required").max(500),
  overview: z.string().min(1, "Overview is required"),
  duration: z.string().min(1, "Duration is required"),
  startEnd: z.string().min(1, "Start/End location is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  priceFrom: z.number().min(0, "Price must be positive"),
  difficulty: z.string().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  displayOrder: z.number().int().min(0),
  bestFor: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
  itinerary: z.array(z.any()).optional(),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
});

function splitLines(val: string | null): string[] {
  return (val ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function safeJsonParse(val: string, fallback: unknown = []) {
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

function extractTourData(formData: FormData) {
  const bestForStr = formData.get("bestFor") as string;
  const highlightsStr = formData.get("highlights") as string;
  const includedStr = formData.get("included") as string;
  const excludedStr = formData.get("excluded") as string;
  const itineraryStr = formData.get("itinerary") as string;

  return {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    category: formData.get("category") as string,
    shortDescription: formData.get("shortDescription") as string,
    overview: formData.get("overview") as string,
    bestFor: safeJsonParse(bestForStr, []),
    duration: formData.get("duration") as string,
    startEnd: formData.get("startEnd") as string,
    highlights: safeJsonParse(highlightsStr, []),
    itinerary: safeJsonParse(itineraryStr, []),
    included: safeJsonParse(includedStr, []),
    excluded: safeJsonParse(excludedStr, []),
    imageUrl: formData.get("imageUrl") as string,
    priceFrom: parseFloat(formData.get("priceFrom") as string) || 0,
    difficulty: (formData.get("difficulty") as string) || undefined,
    isActive: formData.get("isActive") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    displayOrder: parseInt(formData.get("displayOrder") as string) || 0,
  };
}

export async function createTour(formData: FormData) {
  const admin = await requireAdmin();
  try {
    const data = extractTourData(formData);
    const validated = TourSchema.parse(data) as Record<string, unknown>;
    const slug = validated.slug as string;

    const existing = await prisma.tour.findUnique({ where: { slug } });
    if (existing) {
      throw new Error(`Tour with slug "${slug}" already exists`);
    }

    // biome-ignore lint/suspicious/noExplicitAny: Zod-validated data is structurally compatible with Prisma's Tour input
    const newTour = await (prisma.tour.create({
      data: validated as unknown as Parameters<
        typeof prisma.tour.create
      >[0]["data"],
    }) as Promise<{ id: string; slug: string }>);

    logTourCreate(newTour.id, validated, admin.id);
    invalidateTours();

    return { success: true, slug };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues
        .map((e: z.ZodIssue) => `${e.path.join(".")}: ${e.message}`)
        .join(", ");
      throw new Error(`Validation failed: ${messages}`);
    }
    throw new Error(
      `Failed to create tour: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function updateTour(id: string, formData: FormData) {
  const admin = await requireAdmin();
  try {
    const data = extractTourData(formData);
    const validated = TourSchema.parse(data) as Record<string, unknown>;
    const slug = validated.slug as string;

    const existing = await prisma.tour.findFirst({
      where: { slug, NOT: { id } },
    });
    if (existing) {
      throw new Error(`Tour with slug "${slug}" already exists`);
    }

    const currentTour = await prisma.tour.findUnique({ where: { id } });
    // biome-ignore lint/suspicious/noExplicitAny: Zod-validated data is structurally compatible with Prisma's Tour input
    await prisma.tour.update({
      where: { id },
      data: validated as unknown as Parameters<
        typeof prisma.tour.update
      >[0]["data"],
    });

    if (currentTour) {
      logTourUpdate(id, currentTour, validated, admin.id);
    }
    invalidateTours();

    return { success: true, slug };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues
        .map((e: z.ZodIssue) => `${e.path.join(".")}: ${e.message}`)
        .join(", ");
      throw new Error(`Validation failed: ${messages}`);
    }
    throw new Error(
      `Failed to update tour: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function deleteTour(id: string) {
  const admin = await requireAdmin();
  try {
    await prisma.tour.delete({ where: { id } });

    logTourDelete(id, admin.id);
    invalidateTours();
  } catch (error) {
    throw new Error(
      `Failed to delete tour: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
