"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/ui/booking-modal";
import type { TourPackage } from "@/data/tours";

interface TourHeroProps {
    tour: TourPackage;
}

export default function TourHero({ tour }: TourHeroProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <section className="relative h-[600px] md:h-[700px] overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src={tour.imageUrl}
                        alt={tour.name}
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                    {/* Brand-Tinted Sophisticated Contrast Shield Layer */}
                    <div 
                        className="absolute inset-0 pointer-events-none z-0"
                        style={{
                            background: "linear-gradient(135deg, rgba(12, 28, 20, 0.75) 0%, rgba(18, 40, 28, 0.35) 50%, rgba(12, 28, 20, 0.75) 100%)"
                        }}
                    />
                </div>

                {/* Content */}
                <div className="relative z-10 container h-full flex flex-col justify-end pb-12 md:pb-16 hero-content-wrapper">
                    {/* Category Badge & Rating */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="px-4 py-2 bg-primary text-white rounded-full font-semibold text-sm">
                            {tour.category}
                        </span>
                        {tour.reviewCount > 0 ? (
                            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-white font-semibold text-xs">{(tour.rating / 2).toFixed(1)} / 5</span>
                                <span className="text-white/70 text-xs">({tour.reviewCount} reviews)</span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                                <span className="text-white text-xs font-semibold">New Release</span>
                                <span className="text-white/40 text-[10px]">•</span>
                                <span className="text-white/70 text-xs">No Reviews Yet</span>
                            </div>
                        )}
                    </div>

                    {/* Tour Name with Typography Pop */}
                    <h1 
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight hero-h1-title"
                        style={{
                            textShadow: "0 2px 4px rgba(0, 0, 0, 0.35), 0 8px 20px rgba(0, 0, 0, 0.25)"
                        }}
                    >
                        {tour.name}
                    </h1>

                    {/* Short Description with Typography Pop */}
                    <p 
                        className="text-lg md:text-xl text-white/90 max-w-3xl mb-8 hero-subtitle-text"
                        style={{
                            textShadow: "0 2px 6px rgba(0, 0, 0, 0.4)"
                        }}
                    >
                        {tour.shortDescription}
                    </p>

                    {/* Quick Stats Grid with Symmetrical Frosted Glass Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hero-metric-card">
                            <Calendar className="w-6 h-6 text-primary mb-2" />
                            <p className="text-white/70 text-sm">Duration</p>
                            <p className="text-white font-bold text-lg">{tour.duration}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hero-metric-card">
                            <MapPin className="w-6 h-6 text-primary mb-2" />
                            <p className="text-white/70 text-sm">Start/End</p>
                            <p className="text-white font-bold text-lg">{tour.startEnd}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hero-metric-card">
                            <Users className="w-6 h-6 text-primary mb-2" />
                            <p className="text-white/70 text-sm">Group Size</p>
                            <p className="text-white font-bold text-lg">2-12 People</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hero-metric-card">
                            <p className="text-white/70 text-sm">From</p>
                            <p className="text-amber-400 font-bold text-2xl">${tour.priceFrom.toLocaleString()}</p>
                            <p className="text-white/70 text-xs">per person</p>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            size="lg"
                            onClick={() => setIsModalOpen(true)}
                            className="bg-primary hover:bg-primary-dark text-white px-8"
                        >
                            Book This Safari
                        </Button>
                        <Link href={`/enquiry?package=${encodeURIComponent(tour.name)}&slug=${tour.slug}&duration=${encodeURIComponent(tour.duration)}&basePrice=${tour.priceFrom}&category=${encodeURIComponent(tour.category)}`}>
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-foreground px-8">Customize Tour</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <BookingModal
                tour={tour}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
