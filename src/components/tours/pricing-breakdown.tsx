"use client";

import { useMemo } from "react";
import { calculateSafariPrice, ACCOMMODATION_LEVELS } from "@/lib/pricing-engine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Info, Users, Building2, Percent, DollarSign, CheckCircle } from "lucide-react";

interface PricingBreakdownProps {
    basePrice: number;
    travelers: number;
    accommodation?: string;
    compact?: boolean;
}

export function PricingBreakdown({ basePrice, travelers, accommodation = "mid-range", compact = false }: PricingBreakdownProps) {
    const pricing = useMemo(() => {
        return calculateSafariPrice(basePrice, travelers, accommodation);
    }, [basePrice, travelers, accommodation]);

    const accommodationInfo = ACCOMMODATION_LEVELS.find(a => a.id === accommodation);

    if (compact) {
        return (
            <div className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">Total:</span>
                <span className="font-bold text-lg">${pricing.totalPrice.toLocaleString()}</span>
                <Badge variant="secondary" className="text-xs">
                    {pricing.discountPercent}% off
                </Badge>
            </div>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Price Breakdown
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Base Price:</span>
                    </div>
                    <span className="font-medium text-right">${basePrice.toLocaleString()}/person</span>

                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Travelers:</span>
                    </div>
                    <span className="font-medium text-right">{travelers} {travelers === 1 ? 'person' : 'people'}</span>

                    <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Accommodation:</span>
                    </div>
                    <span className="font-medium text-right">{accommodationInfo?.label || accommodation}</span>

                    <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Group Discount:</span>
                    </div>
                    <span className="font-medium text-right text-green-600">-{pricing.discountPercent}%</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <span className="font-semibold">Total Price:</span>
                    </div>
                    <span className="text-2xl font-bold text-primary">${pricing.totalPrice.toLocaleString()}</span>
                </div>

                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                        <Info className="h-4 w-4 text-primary" />
                        <span className="font-medium">{pricing.tier}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{pricing.tierDescription}</p>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                    Price per person: <span className="font-medium">${pricing.pricePerPerson.toLocaleString()}</span>
                </p>
            </CardContent>
        </Card>
    );
}