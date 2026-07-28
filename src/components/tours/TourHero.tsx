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
            <section className="relative min-h-[720px] overflow-hidden sm:min-h-[680px] md:min-h-[700px]">
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
                <div className="container relative z-10 flex min-h-[720px] flex-col justify-end px-4 py-8 sm:min-h-[680px] sm:px-6 sm:py-10 md:min-h-[700px] md:py-16 hero-content-wrapper">
                    {/* Category Badge & Rating */}
                    <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white sm:px-4 sm:py-2 sm:text-sm">
                            {tour.category}
                        </span>
                        {tour.reviewCount > 0 ? (
                            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                    <Star className="h-4 w-4 fill-current text-brand-gold-light" />
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
                        className="mb-3 break-words text-[clamp(1.75rem,8vw,2.5rem)] font-bold leading-[1.08] text-white sm:mb-4 sm:text-4xl md:text-5xl lg:text-6xl hero-h1-title"
                        style={{
                            textShadow: "0 2px 4px rgba(0, 0, 0, 0.35), 0 8px 20px rgba(0, 0, 0, 0.25)"
                        }}
                    >
                        {tour.name}
                    </h1>

                    {/* Short Description with Typography Pop */}
                    <p 
                        className="mb-6 max-w-3xl text-base leading-relaxed text-white/90 sm:mb-8 sm:text-lg md:text-xl hero-subtitle-text"
                        style={{
                            textShadow: "0 2px 6px rgba(0, 0, 0, 0.4)"
                        }}
                    >
                        {tour.shortDescription}
                    </p>

                    {/* Quick Stats Grid with Symmetrical Frosted Glass Cards */}
                    <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 md:grid-cols-4">
                        <div className="min-w-0 rounded-lg border border-white/20 bg-black/30 p-3 backdrop-blur-sm sm:p-4 hero-metric-card">
                            <Calendar className="mb-2 h-5 w-5 text-primary sm:h-6 sm:w-6" />
                            <p className="text-xs text-white/75 sm:text-sm">Duration</p>
                            <p className="break-words text-base font-bold leading-snug text-white sm:text-lg">{tour.duration}</p>
                        </div>
                        <div className="min-w-0 rounded-lg border border-white/20 bg-black/30 p-3 backdrop-blur-sm sm:p-4 hero-metric-card">
                            <MapPin className="mb-2 h-5 w-5 text-primary sm:h-6 sm:w-6" />
                            <p className="text-xs text-white/75 sm:text-sm">Start/End</p>
                            <p className="break-words text-base font-bold leading-snug text-white sm:text-lg">{tour.startEnd}</p>
                        </div>
                        <div className="min-w-0 rounded-lg border border-white/20 bg-black/30 p-3 backdrop-blur-sm sm:p-4 hero-metric-card">
                            <Users className="mb-2 h-5 w-5 text-primary sm:h-6 sm:w-6" />
                            <p className="text-xs text-white/75 sm:text-sm">Group Size</p>
                            <p className="break-words text-base font-bold leading-snug text-white sm:text-lg">2-12 People</p>
                        </div>
                        <div className="min-w-0 rounded-lg border border-white/20 bg-black/30 p-3 backdrop-blur-sm sm:p-4 hero-metric-card">
                            <p className="text-xs text-white/75 sm:text-sm">From</p>
                            <p className="break-words text-xl font-bold text-brand-gold-light sm:text-2xl">${tour.priceFrom.toLocaleString()}</p>
                            <p className="text-xs text-white/75">per person</p>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                        <Button
                            size="lg"
                            onClick={() => setIsModalOpen(true)}
                            className="min-h-11 w-full bg-primary px-8 text-white hover:bg-primary-dark sm:w-auto"
                        >
                            Book This Safari
                        </Button>
                        <Link className="w-full sm:w-auto" href={`/enquiry?package=${encodeURIComponent(tour.name)}&slug=${tour.slug}&duration=${encodeURIComponent(tour.duration)}&basePrice=${tour.priceFrom}&category=${encodeURIComponent(tour.category)}`}>
                            <Button size="lg" variant="outline" className="min-h-11 w-full border-white px-8 text-white hover:bg-white hover:text-foreground sm:w-auto">Customize Tour</Button>
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
