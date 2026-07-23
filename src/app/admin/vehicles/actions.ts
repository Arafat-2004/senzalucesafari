"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import {
  logVehicleCreate,
  logVehicleUpdate,
  logVehicleDelete,
} from "@/lib/reliability/cms-audit";
import { invalidateVehicles } from "@/lib/reliability/cache-manager";

function splitLines(val: string | null): string[] {
  return (val ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitJsonOrLines(val: string | null): string[] {
  if (!val) return [];
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return splitLines(val);
  }
}

function safeJsonParse(val: string, fallback: unknown = {}) {
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

function extractData(f: FormData) {
  return {
    name: f.get("name") as string,
    category: f.get("category") as string,
    imageUrl: f.get("imageUrl") as string,
    capacity: f.get("capacity") as string,
    rating: parseFloat(f.get("rating") as string) || 0,
    reviews: parseInt(f.get("reviews") as string) || 0,
    priceRange: f.get("priceRange") as string,
    description: f.get("description") as string,
    features: splitLines(f.get("features") as string),
    bestFor: splitLines(f.get("bestFor") as string),
    specifications: safeJsonParse(
      (f.get("specifications") as string) || "{}",
      {},
    ),
    safetyFeatures: splitLines(f.get("safetyFeatures") as string),
    safariEquipment: splitLines(f.get("safariEquipment") as string),
    interiorImages: splitJsonOrLines(f.get("interiorImages") as string),
    exteriorImages: splitJsonOrLines(f.get("exteriorImages") as string),
    actionShots: splitJsonOrLines(f.get("actionShots") as string),
    images: splitJsonOrLines(f.get("images") as string),
    engine: (f.get("engine") as string) || undefined,
    transmission: (f.get("transmission") as string) || undefined,
    fuelType: (f.get("fuelType") as string) || undefined,
    year: parseInt(f.get("year") as string) || undefined,
  };
}

export async function createVehicle(f: FormData) {
  const admin = await requireAdmin('tours', 'CREATE');
  try {
    const data = extractData(f);
    const vehicle = await prisma.vehicle.create({ data: { ...data, isActive: false } });

    logVehicleCreate(vehicle.id, data, admin.id);
    invalidateVehicles();
  } catch (error) {
    throw new Error(
      `Failed to create vehicle: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function setVehicleActive(id:string,isActive:boolean){const admin=await requireAdmin('tours','EDIT');const existing=await prisma.vehicle.findUnique({where:{id}});if(!existing)throw new Error('Vehicle not found.');if(isActive&&!existing.imageUrl)throw new Error('Add a vehicle image before making it available.');await prisma.vehicle.update({where:{id},data:{isActive}});logVehicleUpdate(id,existing,{isActive},admin.id);invalidateVehicles()}

export async function updateVehicle(id: string, f: FormData) {
  const admin = await requireAdmin('tours', 'EDIT');
  try {
    const data = extractData(f);

    const existing = await prisma.vehicle.findUnique({ where: { id } });
    await prisma.vehicle.update({ where: { id }, data });

    if (existing) {
      logVehicleUpdate(id, existing, data, admin.id);
    }
    invalidateVehicles();
  } catch (error) {
    throw new Error(
      `Failed to update vehicle: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function deleteVehicle(id: string) {
  const admin = await requireAdmin('tours', 'DELETE');
  try {
    await prisma.vehicle.delete({ where: { id } });

    logVehicleDelete(id, admin.id);
    invalidateVehicles();
  } catch (error) {
    throw new Error(
      `Failed to delete vehicle: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
