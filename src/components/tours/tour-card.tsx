"use client";

import Image from "next/image";
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar } from "lucide-react";
import type { Tour } from "@/data/tours";

interface TourCardProps {
    tour: Tour;
}

export function TourCard({ tour }: TourCardProps) {
    return (
        <Card className="group overflow-hidden safari-card hover:shadow-xl transition-all duration-300 h-full border-0">
            <div className="relative h-56 md:h-64 overflow-hidden">
                <Image
                    src={tour.imageUrl || "/images/placeholders/serengeti.jpg"}
                    alt={tour.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-primary/90 text-white hover:bg-primary">
                        {tour.category}
                    </Badge>
                </div>

                {/* Duration Badge */}
                <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-background/90 backdrop-blur-sm text-foreground hover:bg-background/90">
                        <Calendar className="w-3 h-3 mr-1" />
                        {tour.duration}
                    </Badge>
                </div>
            </div>

            <CardContent className="p-5 space-y-3">
                <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {tour.name}
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-2">
                    {tour.shortDescription}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{tour.startEnd}</span>
                    </div>
                </div>

                {tour.highlights && tour.highlights.length > 0 && (
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-foreground">Highlights:</p>
                        <ul className="text-xs text-muted-foreground space-y-0.5">
                            {tour.highlights.slice(0, 2).map((highlight, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                    <span className="text-primary mt-0.5">•</span>
                                    <span className="line-clamp-1">{highlight}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="pt-3 border-t border-border flex items-center justify-between">
                    <div>
                        <span className="text-xs text-muted-foreground">From</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-primary">${tour.priceFrom}</span>
                            <span className="text-xs text-muted-foreground">per person</span>
                        </div>
                    </div>

                    <Link
                        href={`/safaris-tours/${tour.slug}`}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm bg-primary hover:bg-primary-dark text-white rounded-md transition-colors font-medium"
                    >
                        View Details
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
