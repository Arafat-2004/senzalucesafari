"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, Calendar, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TransferBookingModal from "@/components/vehicles/TransferBookingModal";

interface Vehicle {
    id: string;
    name: string;
    category: string;
    imageUrl: string;
    capacity: string;
    rating: number;
    reviews: number;
    features: string[];
    bestFor: string[];
    pricing?: {
        basePrice: number;
        displayPrice: number;
        perDayPrice: number;
        fromLabel: string;
        perDayLabel: string;
        urgencyLabel: string;
        urgencyLevel: "high" | "medium" | "normal";
    };
}

interface VehicleAPIResponse {
    vehicles: Vehicle[];
    meta: {
        count: number;
        season: string;
        fetchedAt: string;
    };
}

function VehicleCard({ vehicle, vehicleType = "safari", onBookTransfer }: { vehicle: Vehicle; vehicleType?: "safari" | "transfer"; onBookTransfer?: (vehicle: any) => void }) {
    const [imgError, setImgError] = useState(false);
    const isSafari = vehicleType === "safari";
    const hasUrgency = vehicle.pricing?.urgencyLevel === "high";
    
    return (
        <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                    src={imgError ? "https://placehold.co/600x450/f5f5f5/94a3b8?text=Vehicle" : vehicle.imageUrl}
                    alt={vehicle.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={() => setImgError(true)}
                />
                <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                    <Badge className="bg-primary/90 text-white">
                        {vehicle.capacity}
                    </Badge>
                    {hasUrgency && (
                        <Badge className="bg-amber-500 text-white">
                            High Demand
                        </Badge>
                    )}
                </div>
            </div>
            
            <CardContent className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="text-lg md:text-xl font-bold text-foreground">{vehicle.name}</h3>
                        <p className="text-sm text-muted-foreground">{vehicle.category}</p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1 text-amber-500">
                            <span className="text-sm font-semibold">{vehicle.rating}</span>
                            <span className="text-xs">★</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{vehicle.reviews} reviews</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                    {vehicle.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0" />
                            <span className="line-clamp-1">{feature}</span>
                        </div>
                    ))}
                </div>

                <div className="mb-3">
                    {vehicle.pricing ? (
                        <>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">From</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-primary">
                                    ${vehicle.pricing.displayPrice.toLocaleString()}
                                </span>
                                <span className="text-[10px] text-muted-foreground">PP</span>
                            </div>
                            {vehicle.pricing.perDayLabel && (
                                <span className="text-xs text-green-600 font-medium">
                                    {vehicle.pricing.perDayLabel}
                                </span>
                            )}
                        </>
                    ) : (
                        <span className="text-lg font-semibold text-muted-foreground">Contact for pricing</span>
                    )}
                </div>

                <div className="flex gap-2">
                    {isSafari ? (
                        <>
                            <Link href={`/safaris-tours?vehicle=${vehicle.id}`} className="flex-1">
                                <Button className="w-full h-11 bg-primary hover:bg-primary/90">
                                    Book Now
                                </Button>
                            </Link>
                            <Link href="/safaris-tours" className="flex-1">
                                <Button variant="outline" className="w-full h-11">
                                    View Tours
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Button 
                                onClick={() => onBookTransfer?.(vehicle)}
                                className="w-full h-11 bg-primary hover:bg-primary/90"
                            >
                                Book Transfer
                                <Calendar className="ml-2 h-4 w-4" />
                            </Button>
                            <Link href="/enquiry" className="flex-1">
                                <Button variant="outline" className="w-full h-11">
                                    Enquire
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default function VehiclesPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedVehicle, setSelectedVehicle] = useState<{
        id: string;
        name: string;
        type: string;
        capacity: number;
        imageUrl: string;
    } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleBookTransfer = (vehicle: Vehicle) => {
        const capacityNum = parseInt(vehicle.capacity.replace(/[^0-9]/g, '')) || 4;
        setSelectedVehicle({
            id: vehicle.id,
            name: vehicle.name,
            type: vehicle.category,
            capacity: capacityNum,
            imageUrl: vehicle.imageUrl,
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedVehicle(null);
    };

    useEffect(() => {
        async function fetchVehicles() {
            try {
                const res = await fetch('/api/public/vehicles?pricing=true');
                if (!res.ok) throw new Error('Failed to fetch vehicles');
                const data: VehicleAPIResponse = await res.json();
                setVehicles(data.vehicles);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        }
        fetchVehicles();
    }, []);

    const safariVehicles = vehicles.filter(v => v.category.toLowerCase().includes('safari') || !v.category.toLowerCase().includes('transfer'));
    const transferVehicles = vehicles.filter(v => v.category.toLowerCase().includes('transfer'));

    if (loading) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            {/* Hero */}
            <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
                <div className="container px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 md:mb-6 tracking-tight">
                            Our Vehicles
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                            Premium safari vehicles and reliable airport transfers for your Tanzania adventure. 
                            Comfort, safety, and unforgettable wildlife encounters.
                        </p>
                    </div>
                </div>
            </section>

            {/* Safari Vehicles Section */}
            <section className="py-12 md:py-16 lg:py-20">
                <div className="container px-4">
                    <div className="mb-8 md:mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                            Safari Vehicles
                        </h2>
                        <p className="text-muted-foreground max-w-xl">
                            4x4 vehicles built for Tanzania's national parks. Pop-up roofs for unbeatable wildlife viewing, 
                            professional guides, and all the comforts you need for an unforgettable safari adventure.
                        </p>
                    </div>

                    {safariVehicles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {safariVehicles.slice(0, 3).map((vehicle) => (
                                <VehicleCard key={vehicle.id} vehicle={vehicle} vehicleType="safari" />
                            ))}
                        </div>
                    ) : (
                        <Card className="p-8 text-center">
                            <p className="text-muted-foreground">Safari vehicles coming soon.</p>
                        </Card>
                    )}

                    {safariVehicles.length > 3 && (
                        <div className="mt-10 text-center">
                            <Link href="/safaris-tours">
                                <Button variant="outline" size="lg" className="h-12 px-8">
                                    View All Safari Packages
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Transfers Section */}
            <section className="py-12 md:py-16 lg:py-20 bg-muted/30">
                <div className="container px-4">
                    <div className="mb-8 md:mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                            Airport Transfers
                        </h2>
                        <p className="text-muted-foreground max-w-xl">
                            Comfortable, reliable transport between Kilimanjaro Airport, Arusha Airport, and your hotel. 
                            Professional drivers — no waiting, no stress, just relax and start your safari adventure.
                        </p>
                    </div>

                    {transferVehicles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
                            {transferVehicles.slice(0, 2).map((vehicle) => (
                                <VehicleCard 
                                    key={vehicle.id} 
                                    vehicle={vehicle} 
                                    vehicleType="transfer"
                                    onBookTransfer={handleBookTransfer}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
                            <Card className="p-6 text-center">
                                <h3 className="font-semibold mb-2">Comfort Sedan</h3>
                                <p className="text-sm text-muted-foreground mb-4">3 passengers • AC • WiFi</p>
                                <Button 
                                    onClick={() => handleBookTransfer({
                                        id: 'sedan-placeholder',
                                        name: 'Comfort Sedan',
                                        category: 'Transfer Vehicle',
                                        capacity: '3 passengers',
                                        imageUrl: '/images/placeholder.jpg',
                                        rating: 4.8,
                                        reviews: 120,
                                        features: ['AC', 'WiFi', 'Comfortable'],
                                        bestFor: ['Airport Transfers'],
                                    })}
                                    className="w-full h-11 bg-primary"
                                >
                                    Book Transfer
                                    <Calendar className="ml-2 h-4 w-4" />
                                </Button>
                            </Card>
                            <Card className="p-6 text-center">
                                <h3 className="font-semibold mb-2">Safari Minibus</h3>
                                <p className="text-sm text-muted-foreground mb-4">10 passengers • AC • Luggage</p>
                                <Button 
                                    onClick={() => handleBookTransfer({
                                        id: 'minibus-placeholder',
                                        name: 'Safari Minibus',
                                        category: 'Transfer Vehicle',
                                        capacity: '10 passengers',
                                        imageUrl: '/images/placeholder.jpg',
                                        rating: 4.9,
                                        reviews: 85,
                                        features: ['AC', 'Luggage Space', 'Spacious'],
                                        bestFor: ['Group Transfers'],
                                    })}
                                    className="w-full h-11 bg-primary"
                                >
                                    Book Transfer
                                    <Calendar className="ml-2 h-4 w-4" />
                                </Button>
                            </Card>
                        </div>
                    )}

                    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/enquiry">
                            <Button size="lg" className="h-12 px-8 bg-primary hover:bg-primary/90">
                                Book Transfer
                                <Calendar className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="lg" variant="outline" className="h-12 px-8">
                                Get Quote
                                <Phone className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 md:py-16 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
                <div className="container px-4 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                        Ready to Start Your Safari?
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                        Contact us for personalized recommendations and to book your vehicle.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/contact">
                            <Button size="lg" className="h-12 px-8 bg-primary hover:bg-primary/90">
                                Free Consultation
                                <Phone className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/safaris-tours">
                            <Button size="lg" variant="outline" className="h-12 px-8">
                                View Safari Packages
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Transfer Booking Modal */}
            <TransferBookingModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                vehicle={selectedVehicle}
            />
        </main>
    );
}