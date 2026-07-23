import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getVehicleFinalPrice, getCurrentSeason } from "@/lib/revenue/pricing-governance";
import { withApiResilience } from "@/lib/reliability/api-resilience";
import { publicVehicles, type PublicVehicle } from "@/data/vehicles";

function filterFallbackVehicles(category: string | null): PublicVehicle[] {
    if (!category) return publicVehicles;
    if (category === "safari") return publicVehicles.filter(vehicle => !vehicle.category.toLowerCase().includes("transfer"));
    if (category === "transfer") return publicVehicles.filter(vehicle => vehicle.category.toLowerCase().includes("transfer"));
    return publicVehicles.filter(vehicle => vehicle.category.toLowerCase().includes(category.toLowerCase()));
}

function serializeVehicle(vehicle: PublicVehicle, includePricing: boolean, currentSeason: ReturnType<typeof getCurrentSeason>) {
    const baseVehicle = {
        id: vehicle.id,
        name: vehicle.name,
        category: vehicle.category,
        imageUrl: vehicle.imageUrl,
        capacity: vehicle.capacity,
        rating: vehicle.rating,
        reviews: vehicle.reviews,
        features: vehicle.features,
        bestFor: vehicle.bestFor,
    };

    if (!includePricing) return baseVehicle;

    const pricing = getVehicleFinalPrice(vehicle, { season: currentSeason });
    return {
        ...baseVehicle,
        pricing: {
            basePrice: pricing.basePrice,
            displayPrice: pricing.displayPrice,
            perDayPrice: pricing.perDayPrice,
            fromLabel: pricing.fromLabel,
            perDayLabel: pricing.perDayLabel,
            urgencyLabel: pricing.urgencyLabel,
            urgencyLevel: pricing.urgencyLevel,
            season: pricing.season,
            source: pricing.source,
        }
    };
}

export const GET = withApiResilience(async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const includePricing = searchParams.get("pricing") !== "false";
    
    const where: Record<string, unknown> = { isActive: true };
    if (category) {
        if (category === "safari") {
            where.category = { contains: "Safari", mode: "insensitive" };
        } else if (category === "transfer") {
            where.category = { contains: "Transfer", mode: "insensitive" };
        }
    }

    const currentSeason = getCurrentSeason();
    let source: "database" | "fallback" = "database";
    let vehiclesWithPricing;

    try {
        const vehicles = await prisma.vehicle.findMany({
            where,
            orderBy: [{ rating: "desc" }, { reviews: "desc" }]
        });
        vehiclesWithPricing = vehicles.map(vehicle => serializeVehicle(vehicle, includePricing, currentSeason));
    } catch {
        source = "fallback";
        vehiclesWithPricing = filterFallbackVehicles(category).map(vehicle => serializeVehicle(vehicle, includePricing, currentSeason));
    }

    return NextResponse.json({
        vehicles: vehiclesWithPricing,
        meta: {
            count: vehiclesWithPricing.length,
            season: currentSeason,
            source,
            fetchedAt: new Date().toISOString()
        }
    });
}, { route: '/api/public/vehicles', method: 'GET' });
