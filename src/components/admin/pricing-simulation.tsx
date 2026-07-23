"use client";

import { useState, useMemo } from "react";
import { calculateSafariPrice, PRICING_TIERS, ACCOMMODATION_LEVELS } from "@/lib/pricing-engine";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Users, Building2, DollarSign, CheckCircle2 } from "lucide-react";

interface PricingSimulationProps {
    initialPrice?: number;
    tours?: Array<{ id: string; name: string; price: number }>;
}

export function PricingSimulation({ initialPrice = 1500, tours }: PricingSimulationProps) {
    const [basePrice, setBasePrice] = useState(initialPrice);
    const [travelers, setTravelers] = useState(2);
    const [accommodation, setAccommodation] = useState("mid-range");
    const [selectedTourId, setSelectedTourId] = useState<string>("");

    const currentPricing = useMemo(() => {
        return calculateSafariPrice(basePrice, travelers, accommodation);
    }, [basePrice, travelers, accommodation]);

    const pricingTable = useMemo(() => {
        return PRICING_TIERS.map(tier => {
            const result = calculateSafariPrice(basePrice, tier.minTravelers, "mid-range");
            return { ...tier, ...result };
        });
    }, [basePrice]);

    const accommodationComparison = useMemo(() => {
        return ACCOMMODATION_LEVELS.map(level => {
            const result = calculateSafariPrice(basePrice, travelers, level.id);
            return { ...level, ...result };
        });
    }, [basePrice, travelers]);

    return (
        <div className="space-y-6">
            {tours && tours.length > 0 && (
                <Card className="border bg-card">
                    <CardContent className="p-4">
                        <div className="space-y-2 max-w-md">
                            <Label htmlFor="tourSelector">Tour package</Label>
                            <p className="text-xs text-muted-foreground">Selecting a tour copies its starting price into this private estimate.</p>
                            <Select value={selectedTourId} onValueChange={(v) => {
                                setSelectedTourId(v ?? '')
                                const tour = tours.find(t => t.id === v)
                                if (tour) setBasePrice(tour.price)
                            }}>
                                <SelectTrigger id="tourSelector">
                                    <SelectValue placeholder="Choose a tour package..." />
                                </SelectTrigger>
                                <SelectContent className="bg-background text-foreground">
                                    {tours.map(t => (
                                        <SelectItem key={t.id} value={t.id}>{t.name} (${t.price.toLocaleString()})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Base Price Input */}
                <div className="space-y-2">
                    <Label htmlFor="basePrice">Starting price per person</Label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="basePrice"
                            type="number"
                            value={basePrice}
                            onChange={(e) => setBasePrice(Number(e.target.value) || 0)}
                            className="pl-9"
                            min={0}
                        />
                    </div>
                </div>

                {/* Travelers Input */}
                <div className="space-y-2">
                    <Label htmlFor="travelers">Number of travellers</Label>
                    <Select value={travelers.toString()} onValueChange={(v) => setTravelers(Number(v))}>
                        <SelectTrigger id="travelers">
                            <SelectValue placeholder="Select travelers" />
                        </SelectTrigger>
                        <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20].map(n => (
                                <SelectItem key={n} value={n.toString()}>{n} {n === 1 ? 'person' : 'people'}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Accommodation Level */}
                <div className="space-y-2">
                    <Label htmlFor="accommodation">Accommodation Level</Label>
                    <Select value={accommodation} onValueChange={(v) => v && setAccommodation(v)}>
                        <SelectTrigger id="accommodation">
                            <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                            {ACCOMMODATION_LEVELS.map(level => (
                                <SelectItem key={level.id} value={level.id}>{level.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Tabs defaultValue="current" className="w-full">
                <TabsList>
                    <TabsTrigger value="current">Current Price</TabsTrigger>
                    <TabsTrigger value="tiers">Group Tiers</TabsTrigger>
                    <TabsTrigger value="accommodation">Accommodation</TabsTrigger>
                </TabsList>

                <TabsContent value="current" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calculator className="h-5 w-5" />
                                Price Calculation
                            </CardTitle>
                            <CardDescription>
                                Breakdown for {travelers} traveler{travelers > 1 ? 's' : ''} at {ACCOMMODATION_LEVELS.find(a => a.id === accommodation)?.label} accommodation
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Base Price</p>
                                    <p className="text-xl font-bold">${currentPricing.basePrice.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Group Discount</p>
                                    <p className="text-xl font-bold admin-text-success">-{currentPricing.discountPercent}%</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Price/Person</p>
                                    <p className="text-xl font-bold">${currentPricing.pricePerPerson.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Price</p>
                                    <p className="text-2xl font-bold text-primary">${currentPricing.totalPrice.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-muted rounded-lg">
                                <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 admin-text-success" />
                                    <span>{currentPricing.tier}: {currentPricing.tierDescription}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="tiers">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Group Pricing Tiers
                            </CardTitle>
                            <CardDescription>
                                How price changes based on group size (mid-range accommodation)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Group Size</TableHead>
                                        <TableHead>Label</TableHead>
                                        <TableHead>Discount</TableHead>
                                        <TableHead>Price/Person</TableHead>
                                        <TableHead>Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pricingTable.map((tier) => (
                                        <TableRow key={tier.label} className={travelers >= tier.minTravelers && travelers <= tier.maxTravelers ? "bg-primary/10" : ""}>
                                            <TableCell>{tier.minTravelers}{tier.maxTravelers !== tier.minTravelers ? `-${tier.maxTravelers}` : ''}</TableCell>
                                            <TableCell>{tier.label}</TableCell>
                                        <TableCell className="admin-text-success">-{tier.discountPercent}%</TableCell>
                                            <TableCell>${tier.pricePerPerson.toLocaleString()}</TableCell>
                                            <TableCell className="font-medium">${tier.totalPrice.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="accommodation">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Accommodation Pricing
                            </CardTitle>
                            <CardDescription>
                                How price changes based on accommodation level ({travelers} travelers)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Level</TableHead>
                                        <TableHead>Multiplier</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {accommodationComparison.map((level) => (
                                        <TableRow key={level.id} className={accommodation === level.id ? "bg-primary/10" : ""}>
                                            <TableCell className="font-medium">{level.label}</TableCell>
                                            <TableCell>{level.multiplier < 1 ? `-${Math.round((1 - level.multiplier) * 100)}%` : `+${Math.round((level.multiplier - 1) * 100)}%`}</TableCell>
                                            <TableCell className="text-muted-foreground text-sm">{level.description}</TableCell>
                                            <TableCell className="font-medium">${level.totalPrice.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
