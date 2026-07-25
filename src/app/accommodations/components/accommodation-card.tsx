"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, CheckCircle2, ArrowRight, Crown, Gem, Tent, Globe, Mail, Phone, ImageIcon, X } from "lucide-react";
import type { AccommodationOption } from "@/types/accommodations";

export function AccommodationCard({ accommodation }: { accommodation: AccommodationOption }) {
    const isLuxury = accommodation.tier === 'luxury';
    const isMidRange = accommodation.tier === 'midrange';

    // Tier theme options
    let colorThemeClass = "";
    let borderThemeClass = "";
    let starColorClass = "";
    let ratingBadgeClass = "";
    let priceBoxThemeClass = "";
    let buttonThemeClass = "";
    let bestForTagClass = "";
    let icon = <Gem className="w-5 h-5" />;
    let tierLabel = "MID-RANGE";

    if (isLuxury) {
        colorThemeClass = "tone-featured";
        borderThemeClass = "border-tone-featured";
        starColorClass = "text-brand-gold fill-current";
        ratingBadgeClass = "tone-featured";
        priceBoxThemeClass = "tone-featured border";
        buttonThemeClass = "bg-primary hover:bg-primary-dark text-primary-foreground";
        bestForTagClass = "tone-featured";
        icon = <Crown className="w-5 h-5" />;
        tierLabel = "LUXURY";
    } else if (isMidRange) {
        colorThemeClass = "tone-info";
        borderThemeClass = "border-tone-info";
        starColorClass = "text-info fill-current";
        ratingBadgeClass = "tone-info";
        priceBoxThemeClass = "tone-info border";
        buttonThemeClass = "bg-primary hover:bg-primary-dark text-primary-foreground";
        bestForTagClass = "tone-info";
        icon = <Gem className="w-5 h-5" />;
        tierLabel = "MID-RANGE";
    } else {
        colorThemeClass = "tone-success";
        borderThemeClass = "border-tone-success";
        starColorClass = "text-success fill-current";
        ratingBadgeClass = "tone-success";
        priceBoxThemeClass = "tone-success border";
        buttonThemeClass = "bg-primary hover:bg-primary-dark text-primary-foreground";
        bestForTagClass = "tone-success";
        icon = <Tent className="w-5 h-5" />;
        tierLabel = "BUDGET";
    }

    const featuresTitle = isLuxury ? "Premium Features" : isMidRange ? "Key Features" : "Highlights";
    const featuresList = (accommodation.tier === 'budget' && accommodation.highlights && accommodation.highlights.length > 0)
        ? accommodation.highlights
        : accommodation.features;

    // Support gallery images state
    const gallery = accommodation.images && accommodation.images.length > 0
        ? accommodation.images
        : [accommodation.image].filter(Boolean);
    const [activeImage, setActiveImage] = useState(gallery[0] || accommodation.image);

    return (
        <div className={`bg-card rounded-3xl overflow-hidden shadow-xl border ${borderThemeClass} transition-shadow duration-300 hover:shadow-2xl`}>
            <div className="grid lg:grid-cols-2 gap-0">
                {/* Left Section: Image and Gallery Preview */}
                <div className="flex flex-col">
                    <div className="relative aspect-video lg:flex-1 min-h-[340px]">
                        {activeImage ? (
                            <Image
                                src={activeImage}
                                alt={accommodation.name}
                                fill
                                className="object-cover transition-all duration-500"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
                                <ImageIcon className="w-8 h-8 mb-2 block" /> No Image Available
                            </div>
                        )}
                        <div className="absolute top-4 left-4">
                            <div className={`${colorThemeClass} px-4 py-2 rounded-full font-bold flex items-center gap-2 text-sm shadow-md`}>
                                {icon}
                                <span>{tierLabel}</span>
                            </div>
                        </div>
                    </div>
                    {/* Interactive Gallery Thumbnails */}
                    {gallery.length > 1 && (
                        <div className="p-3 bg-muted/40 border-t border-border/40 flex items-center gap-2 overflow-x-auto scrollbar-none">
                            {gallery.slice(0, 6).map((img, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setActiveImage(img)}
                                    className={`relative w-14 h-10 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                                        activeImage === img ? "border-primary scale-105 shadow-xs" : "border-transparent opacity-70 hover:opacity-100"
                                    }`}
                                >
                                    <Image
                                        src={img}
                                        alt={`${accommodation.name} view ${idx + 1}`}
                                        fill
                                        sizes="80px"
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                            {gallery.length > 6 && (
                                <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-1.5 rounded-md flex items-center gap-1 flex-shrink-0">
                                    <ImageIcon className="w-3.5 h-3.5" />
                                    +{gallery.length - 6}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Section: Details */}
                <div className="p-8 lg:p-10 space-y-6 flex flex-col justify-between">
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-start justify-between mb-3 gap-2">
                                <h3 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">{accommodation.name}</h3>
                                <div className={`flex items-center gap-1 px-3 py-1 rounded-full flex-shrink-0 ${ratingBadgeClass}`}>
                                    <Star className={`w-4 h-4 ${starColorClass}`} />
                                    <span className="font-bold text-sm">{accommodation.rating}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                <MapPin className="w-4 h-4 flex-shrink-0" />
                                <span className="text-sm font-medium">{accommodation.location}</span>
                            </div>
                            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{accommodation.description}</p>
                        </div>

                        {/* Contact Information Bar (Website, Email, Phone) */}
                        {(accommodation.website || accommodation.email || accommodation.phone) && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-muted/30 border border-border/40 rounded-xl text-[11px] font-medium text-muted-foreground shadow-2xs">
                                {accommodation.website && (
                                    <a
                                        href={accommodation.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 hover:text-primary transition-colors truncate"
                                        title={accommodation.website}
                                    >
                                        <Globe className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                        <span className="truncate">Visit Website</span>
                                    </a>
                                )}
                                {accommodation.email && (
                                    <a
                                        href={`mailto:${accommodation.email}`}
                                        className="flex items-center gap-1.5 hover:text-primary transition-colors truncate"
                                        title={accommodation.email}
                                    >
                                        <Mail className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                        <span className="truncate">{accommodation.email}</span>
                                    </a>
                                )}
                                {accommodation.phone && (
                                    <a
                                        href={`tel:${accommodation.phone}`}
                                        className="flex items-center gap-1.5 hover:text-primary transition-colors truncate"
                                        title={accommodation.phone}
                                    >
                                        <Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                        <span className="truncate">{accommodation.phone}</span>
                                    </a>
                                )}
                            </div>
                        )}

                        {/* Entry Rate Block */}
                        <div className={`rounded-xl p-4 ${priceBoxThemeClass}`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold">Entry Rate</span>
                                <span className="text-2xl font-bold">{accommodation.pricePerNight}</span>
                            </div>
                            {accommodation.priceRange && (
                                <p className="text-xs text-muted-foreground">{accommodation.priceRange}</p>
                            )}
                        </div>

                        {/* 2-Column internal feature matrix for all cards */}
                        <div className="grid sm:grid-cols-2 gap-6 pt-2">
                            <div>
                                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2 text-sm md:text-base">
                                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                                    {featuresTitle}
                                </h4>
                                <div className="space-y-2">
                                    {featuresList.slice(0, 6).map((feature: string, idx: number) => (
                                        <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {accommodation.bestFor && accommodation.bestFor.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-foreground mb-3 text-sm md:text-base">Perfect For</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {accommodation.bestFor.map((item: string, idx: number) => (
                                            <span key={idx} className={`px-3 py-1 rounded-full text-xs font-semibold ${bestForTagClass}`}>
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-6">
                        <Link
                            href={`/enquiry?accommodation=${encodeURIComponent(accommodation.name)}&tier=${accommodation.tier}&location=${encodeURIComponent(accommodation.location)}`}
                            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-[44px] h-11 px-6 py-2 w-full ${buttonThemeClass}`}
                        >
                            Inquire About This Lodge
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
