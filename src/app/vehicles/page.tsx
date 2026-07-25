"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, Calendar, CheckCircle2, Loader2, Star, Users, Fuel, Compass, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TransferBookingModal from "@/components/vehicles/TransferBookingModal";
import { HeroSection as VehiclesHeroSection } from "./components/hero-section";

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
    description?: string;
    specifications?: Record<string, string>;
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

function formatSpecKey(key: string): string {
    const directMatches: Record<string, string> = {
        drive: "Drive System",
        tires: "Tire Configuration",
        engine: "Engine Details",
        torque: "Max Torque",
        fuelCapacity: "Fuel Capacity",
        groundClearance: "Ground Clearance",
        power: "Engine Power",
        width: "Vehicle Width",
        length: "Vehicle Length",
        suspension: "Suspension",
        transmission: "Transmission",
    };

    if (directMatches[key]) return directMatches[key];

    const formatted = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .trim();
    
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function VehicleCard({ 
    vehicle, 
    vehicleType = "safari", 
    onBookTransfer,
    onViewSpecs
}: { 
    vehicle: Vehicle; 
    vehicleType?: "safari" | "transfer"; 
    onBookTransfer?: (vehicle: Vehicle) => void;
    onViewSpecs?: (vehicle: Vehicle) => void;
}) {
    const [imgError, setImgError] = useState(false);
    const isSafari = vehicleType === "safari";
    const hasUrgency = vehicle.pricing?.urgencyLevel === "high";
    
    return (
        <Card className="group flex flex-col h-full overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
            <div className="relative aspect-[4/3] overflow-hidden bg-muted flex-shrink-0">
                <Image
                    src={imgError ? "https://placehold.co/600x450/f5f5f5/94a3b8?text=Vehicle" : vehicle.imageUrl}
                    alt={vehicle.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={() => setImgError(true)}
                />
                <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                    <Badge className="bg-background/90 text-foreground backdrop-blur-sm border-0 font-medium">
                        {vehicle.capacity}
                    </Badge>
                    {hasUrgency && (
                        <Badge variant="warning">
                            High Demand
                        </Badge>
                    )}
                </div>
            </div>
            
            <CardContent className="p-5 flex flex-col flex-1 justify-between">
                <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <h3 className="text-lg font-bold text-foreground line-clamp-1">{vehicle.name}</h3>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">{vehicle.category}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <div className="flex items-center justify-end gap-1 text-featured">
                                <span className="text-xs font-bold">{vehicle.rating.toFixed(1)}</span>
                                <Star className="h-3.5 w-3.5 fill-current text-amber-500" aria-hidden="true" />
                            </div>
                            <p className="text-[10px] text-muted-foreground whitespace-nowrap">{vehicle.reviews} reviews</p>
                        </div>
                    </div>

                    {/* Highlights Grid with Icons */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-border/30 text-center bg-muted/40 rounded-xl">
                        <div className="flex flex-col items-center">
                            <Users className="h-4 w-4 text-primary/80 mb-1" />
                            <span className="text-[9px] text-muted-foreground uppercase font-semibold">Capacity</span>
                            <span className="text-[11px] font-bold text-foreground truncate max-w-full px-1">{vehicle.capacity.split(' ')[0] || vehicle.capacity}</span>
                        </div>
                        <div className="flex flex-col items-center border-x border-border/30">
                            <Compass className="h-4 w-4 text-primary/80 mb-1" />
                            <span className="text-[9px] text-muted-foreground uppercase font-semibold">Drive</span>
                            <span className="text-[11px] font-bold text-foreground truncate max-w-full px-1">
                                {vehicle.specifications?.['Drive System'] || vehicle.specifications?.['drive'] || "4WD"}
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Fuel className="h-4 w-4 text-primary/80 mb-1" />
                            <span className="text-[9px] text-muted-foreground uppercase font-semibold">Fuel</span>
                            <span className="text-[11px] font-bold text-foreground truncate max-w-full px-1">
                                {vehicle.specifications?.['Fuel Type'] || vehicle.specifications?.['fuelType'] || "Diesel"}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground min-h-[40px]">
                        {vehicle.features.slice(0, 4).map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                                <span className="line-clamp-1 text-[11px]">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-5 pt-4 border-t border-border/20">
                    <div className="flex items-end justify-between mb-4">
                        <div>
                            {vehicle.pricing ? (
                                <>
                                    <span className="text-[9px] text-muted-foreground uppercase tracking-wider block font-semibold">Starting from</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xl font-extrabold text-primary">
                                            ${vehicle.pricing.displayPrice.toLocaleString()}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground font-medium">PP</span>
                                    </div>
                                </>
                            ) : (
                                <span className="text-sm font-semibold text-muted-foreground">Pricing On Request</span>
                            )}
                        </div>
                        {vehicle.pricing?.perDayLabel && (
                            <span className="bg-success/10 text-success text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {vehicle.pricing.perDayLabel}
                            </span>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {isSafari ? (
                            <>
                                <Link href={`/safaris-tours?vehicle=${vehicle.id}`} className="flex-[2]">
                                    <Button className="w-full h-11 bg-primary hover:bg-primary/90 text-xs font-bold uppercase tracking-wider">
                                        Book Safari
                                    </Button>
                                </Link>
                                <Button 
                                    variant="outline" 
                                    onClick={() => onViewSpecs?.(vehicle)}
                                    className="flex-1 h-11 text-xs font-semibold"
                                >
                                    <Wrench className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                                    Specs
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button 
                                    onClick={() => onBookTransfer?.(vehicle)}
                                    className="flex-[2] h-11 bg-primary hover:bg-primary/90 text-xs font-bold uppercase tracking-wider"
                                >
                                    Book Transfer
                                    <Calendar className="ml-1.5 h-3.5 w-3.5" />
                                </Button>
                                <Button 
                                    variant="outline" 
                                    onClick={() => onViewSpecs?.(vehicle)}
                                    className="flex-1 h-11 text-xs font-semibold"
                                >
                                    <Wrench className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                                    Specs
                                </Button>
                            </>
                        )}
                    </div>
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
    const [selectedSpecsVehicle, setSelectedSpecsVehicle] = useState<Vehicle | null>(null);
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

    if (error && vehicles.length === 0) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-background px-4">
                <div className="tone-danger max-w-md rounded-2xl border p-6 text-center">
                    <h1 className="text-xl font-bold">Unable to load vehicles</h1>
                    <p className="mt-2 text-sm">The vehicle list is temporarily unavailable. Please check your connection and try again.</p>
                    <Button className="mt-5" onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            {/* Hero */}
            <VehiclesHeroSection />

            {/* Safari Vehicles Section */}
            <section id="fleet-details" className="py-12 md:py-16 lg:py-20">
                <div className="container px-4">
                    <div className="mb-8 md:mb-12 text-center max-w-2xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3 tracking-tight">
                            Safari Vehicles
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            4x4 vehicles custom-built for Tanzania&apos;s national parks. Features include pop-up roofs for 360-degree game viewing, in-vehicle charging ports, and cooler boxes to keep your refreshments cold.
                        </p>
                    </div>

                    {safariVehicles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {safariVehicles.map((vehicle) => (
                                <VehicleCard 
                                    key={vehicle.id} 
                                    vehicle={vehicle} 
                                    vehicleType="safari" 
                                    onViewSpecs={setSelectedSpecsVehicle}
                                />
                            ))}
                        </div>
                    ) : (
                        <Card className="p-8 text-center">
                            <p className="text-muted-foreground">Safari vehicles coming soon.</p>
                        </Card>
                    )}
                </div>
            </section>

            {/* Transfers Section */}
            <section className="py-12 md:py-16 lg:py-20 bg-muted/30">
                <div className="container px-4">
                    <div className="mb-8 md:mb-12 text-center max-w-2xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3 tracking-tight">
                            Airport Transfers & Minivans
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Comfortable, reliable transport between Kilimanjaro Airport, Arusha Airport, and your hotels or safari lodges. Professional drivers, zero stress.
                        </p>
                    </div>

                    {transferVehicles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {transferVehicles.map((vehicle) => (
                                <VehicleCard 
                                    key={vehicle.id} 
                                    vehicle={vehicle} 
                                    vehicleType="transfer"
                                    onBookTransfer={handleBookTransfer}
                                    onViewSpecs={setSelectedSpecsVehicle}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
                            <Card className="p-6 text-center">
                                <h3 className="font-semibold mb-2">Comfort Sedan</h3>
                                <p className="text-sm text-muted-foreground mb-4">3 passengers - AC - WiFi</p>
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
                                    className="w-full h-11 bg-primary text-white"
                                >
                                    Book Transfer
                                    <Calendar className="ml-2 h-4 w-4" />
                                </Button>
                            </Card>
                            <Card className="p-6 text-center">
                                <h3 className="font-semibold mb-2">Safari Minibus</h3>
                                <p className="text-sm text-muted-foreground mb-4">10 passengers - AC - Luggage</p>
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
                                    className="w-full h-11 bg-primary text-white"
                                >
                                    Book Transfer
                                    <Calendar className="ml-2 h-4 w-4" />
                                </Button>
                            </Card>
                        </div>
                    )}

                    <div className="mt-12 text-center">
                        <Link href="/enquiry" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                            Need a custom route or group transfer?
                            <span className="font-semibold text-primary hover:underline">Get a Custom Quote -&gt;</span>
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
                        <Link href="/enquiry">
                            <Button size="lg" className="h-12 px-8 bg-primary hover:bg-primary/90 text-white font-semibold">
                                Free Consultation
                                <Phone className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/safaris-tours">
                            <Button size="lg" variant="outline" className="h-12 px-8 font-semibold">
                                View Safari Packages
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Vehicle Specifications Modal */}
            <Dialog open={!!selectedSpecsVehicle} onOpenChange={(open) => !open && setSelectedSpecsVehicle(null)}>
                <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh] p-0 rounded-2xl border border-border/80 shadow-2xl bg-background">
                    {selectedSpecsVehicle && (
                        <div>
                            {/* Hero Header Image */}
                            <div className="relative h-64 md:h-72 w-full bg-muted flex-shrink-0">
                                <Image
                                    src={selectedSpecsVehicle.imageUrl}
                                    alt={selectedSpecsVehicle.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 600px"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                                <div className="absolute bottom-5 left-5 right-5 text-white">
                                    <Badge className="bg-primary hover:bg-primary/90 text-white mb-2 border-0 uppercase text-[9px] tracking-widest font-bold">
                                        {selectedSpecsVehicle.category}
                                    </Badge>
                                    <DialogTitle className="text-2xl font-extrabold tracking-tight text-white leading-none">
                                        {selectedSpecsVehicle.name}
                                    </DialogTitle>
                                    <div className="flex items-center gap-1.5 mt-2.5 text-amber-400">
                                        <Star className="h-4 w-4 fill-current" />
                                        <span className="text-sm font-bold text-white">{selectedSpecsVehicle.rating.toFixed(1)}</span>
                                        <span className="text-xs text-slate-300">({selectedSpecsVehicle.reviews} reviews)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Description */}
                                <div>
                                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2 font-semibold">About this Vehicle</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {selectedSpecsVehicle.description || "A reliable, custom-outfitted vehicle built to handle Tanzania's diverse terrains, ensuring safety, comfort, and optimal visibility."}
                                    </p>
                                </div>

                                {/* Key highlights grid */}
                                <div className="grid grid-cols-3 gap-4 py-4 border-y border-border/50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                            <Users className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground font-semibold uppercase">Capacity</p>
                                            <p className="text-xs font-bold text-foreground">{selectedSpecsVehicle.capacity}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                            <Compass className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground font-semibold uppercase">Drive System</p>
                                            <p className="text-xs font-bold text-foreground">
                                                {selectedSpecsVehicle.specifications?.['Drive System'] || selectedSpecsVehicle.specifications?.['drive'] || "4WD"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                            <Fuel className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground font-semibold uppercase">Fuel Type</p>
                                            <p className="text-xs font-bold text-foreground">
                                                {selectedSpecsVehicle.specifications?.['Fuel Type'] || selectedSpecsVehicle.specifications?.['fuelType'] || "Diesel"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed specs */}
                                {selectedSpecsVehicle.specifications && Object.keys(selectedSpecsVehicle.specifications).length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 font-semibold">Technical Specifications</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                                            {Object.entries(selectedSpecsVehicle.specifications).map(([key, val]) => (
                                                <div key={key} className="flex justify-between items-center py-2 border-b border-border/10 last:border-0 sm:last:border-b">
                                                    <span className="text-xs text-muted-foreground font-medium">{formatSpecKey(key)}</span>
                                                    <span className="text-xs font-semibold text-foreground text-right">{val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Features & Amenities */}
                                {selectedSpecsVehicle.features && selectedSpecsVehicle.features.length > 0 && (
                                    <div className="pt-4 border-t border-border/50">
                                        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 font-semibold">Features & Amenities</h4>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                            {selectedSpecsVehicle.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* CTA buttons inside modal */}
                                <div className="flex gap-3 pt-6 border-t border-border/50">
                                    <Button
                                        onClick={() => {
                                            setSelectedSpecsVehicle(null);
                                            if (selectedSpecsVehicle.category.toLowerCase().includes('transfer')) {
                                                handleBookTransfer(selectedSpecsVehicle);
                                            } else {
                                                window.location.href = `/safaris-tours?vehicle=${selectedSpecsVehicle.id}`;
                                            }
                                        }}
                                        className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-bold uppercase text-xs tracking-wider"
                                    >
                                        {selectedSpecsVehicle.category.toLowerCase().includes('transfer') ? "Book Transfer" : "Book Safari"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setSelectedSpecsVehicle(null)}
                                        className="h-12 px-6 text-xs font-semibold uppercase tracking-wider"
                                    >
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Transfer Booking Modal */}
            <TransferBookingModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                vehicle={selectedVehicle}
            />
        </main>
    );
}
