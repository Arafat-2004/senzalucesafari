import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getVehicleFinalPrice, formatDisplayPrice, formatPerDayPrice, getCurrentSeason } from "@/lib/revenue/pricing-governance";
import { withApiResilience } from "@/lib/reliability/api-resilience";

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

    const vehicles = await prisma.vehicle.findMany({
        where,
        orderBy: [{ rating: "desc" }, { reviews: "desc" }]
    });

    const currentSeason = getCurrentSeason();
    
    const vehiclesWithPricing = vehicles.map(vehicle => {
        if (!includePricing) {
            return {
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
        }

        const pricing = getVehicleFinalPrice(vehicle, { season: currentSeason });

        return {
            id: vehicle.id,
            name: vehicle.name,
            category: vehicle.category,
            imageUrl: vehicle.imageUrl,
            capacity: vehicle.capacity,
            rating: vehicle.rating,
            reviews: vehicle.reviews,
            features: vehicle.features,
            bestFor: vehicle.bestFor,
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
    });

    return NextResponse.json({
        vehicles: vehiclesWithPricing,
        meta: {
            count: vehiclesWithPricing.length,
            season: currentSeason,
            fetchedAt: new Date().toISOString()
        }
    });
}, { route: '/api/public/vehicles', method: 'GET' });