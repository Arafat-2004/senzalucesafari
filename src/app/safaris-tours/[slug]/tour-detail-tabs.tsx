"use client";

import { useState, useEffect } from "react";
import { TourPackage } from "@/data/tours";
import { CheckCircle, XCircle, Star, Tag, CalendarDays, DollarSign, Image as ImageIcon, Users, Clock, MapPin } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import NextImage from "next/image";

const translations: Record<string, string> = {
    'tourDetail.backToTours': 'Back to Tours',
    'tourDetail.quickNavigation': 'Quick Navigation',
    'tourDetail.from': 'From',
    'tourDetail.perPerson': 'per person',
    'tourDetail.overview': 'Overview',
    'tourDetail.itinerary': 'Itinerary',
    'tourDetail.pricing': 'Pricing',
    'tourDetail.reviews': 'Reviews',
    'tourDetail.gallery': 'Gallery',
    'tourDetail.related': 'Related',
    'tourDetail.highlights': 'Highlights',
    'tourDetail.bestFor': 'Best For',
    'tourDetail.dayByDayItinerary': 'Day-by-Day Itinerary',
    'tourDetail.pricingAndPackages': 'Pricing & Packages',
    'tourDetail.whatsIncluded': "What's Included",
    'tourDetail.whatsExcluded': "What's Excluded",
    'tourDetail.reviewsAndRatings': 'Reviews & Ratings',
    'tourDetail.photoGallery': 'Photo Gallery',
    'tourDetail.relatedTours': 'Related Tours',
    'tourCard.viewDetails': 'View Details',
};

const t = (key: string) => translations[key] || key;

interface TourDetailTabsProps {
    tour: TourPackage;
    relatedTours: TourPackage[];
}

export function TourDetailTabs({ tour, relatedTours }: TourDetailTabsProps) {
    const [activeSection, setActiveSection] = useState("overview");

    const sections = [
        { id: "overview", label: t('tourDetail.overview'), icon: Star },
        { id: "itinerary", label: t('tourDetail.itinerary'), icon: CalendarDays },
        { id: "pricing", label: t('tourDetail.pricing'), icon: DollarSign },
        { id: "reviews", label: t('tourDetail.reviews'), icon: Star },
        { id: "gallery", label: t('tourDetail.gallery'), icon: ImageIcon },
        { id: "related", label: t('tourDetail.related'), icon: Users },
    ];

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 130; // offset to align with active tab highlights

            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element) {
                    const offsetTop = element.offsetTop;
                    const offsetHeight = element.offsetHeight;

                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 120; // clear sticky subbar
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <div className="space-y-16">
            {/* Sticky Sub-Navigation Header */}
            <div className="sticky top-[72px] z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border/50 -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-2">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        const isActive = activeSection === section.id;
                        return (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                                    isActive
                                        ? "border-primary text-primary font-bold"
                                        : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                <span>{section.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Overview Section */}
            <section id="overview" className="scroll-mt-36 space-y-8">
                <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{t('tourDetail.overview')}</h2>
                    <div className="prose prose-lg max-w-none text-muted-foreground">
                        <p className="leading-relaxed text-base md:text-lg">{tour.overview}</p>
                    </div>

                    <div className="mt-8 pt-8 border-t border-border/50">
                        <h3 className="text-lg md:text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                            <Star className="w-6 h-6 text-primary flex-shrink-0" />
                            {t('tourDetail.highlights')}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {tour.highlights.map((highlight, index) => (
                                <div key={index} className="flex items-start space-x-3 p-4 bg-muted/20 border border-border/30 rounded-xl hover:shadow-sm transition-shadow">
                                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                    <span className="text-foreground text-sm md:text-base">{highlight}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-border/50">
                        <h3 className="text-lg md:text-xl font-bold text-foreground mb-4 flex items-center gap-3">
                            <Tag className="w-6 h-6 text-primary flex-shrink-0" />
                            {t('tourDetail.bestFor')}
                        </h3>
                        <div className="flex flex-wrap gap-2.5">
                            {tour.bestFor.map((item, index) => (
                                <span
                                    key={index}
                                    className="px-3.5 py-1.5 bg-primary/10 text-primary rounded-full font-medium text-xs md:text-sm border border-primary/20"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Itinerary Section */}
            <section id="itinerary" className="scroll-mt-36 space-y-6">
                <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                        <CalendarDays className="w-6 h-6 text-primary flex-shrink-0" />
                        {t('tourDetail.dayByDayItinerary')}
                    </h2>
                    <Accordion type="single" collapsible className="space-y-3" defaultValue="day-0">
                        {tour.itinerary.map((day, index) => (
                            <AccordionItem
                                key={index}
                                value={`day-${index}`}
                                className="border border-border/50 rounded-xl overflow-hidden bg-card px-6"
                            >
                                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm">
                                            {index + 1}
                                        </span>
                                        <div>
                                            <p className="text-base md:text-lg">{day.title}</p>
                                            {day.activities && day.activities.length > 0 && (
                                                <p className="text-xs text-muted-foreground font-normal mt-1">
                                                    {day.activities.length} activities
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-5 pt-2">
                                    <div className="space-y-4 ml-13">
                                        {day.description && (
                                            <p className="text-muted-foreground leading-relaxed">{day.description}</p>
                                        )}
                                        {day.activities && day.activities.length > 0 && (
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-semibold text-foreground">Activities:</h4>
                                                <ul className="space-y-2">
                                                    {day.activities.map((activity, actIndex) => (
                                                        <li key={actIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                            <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                                            <span>{activity}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {day.accommodation && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="w-4 h-4 text-primary" />
                                                <span className="text-muted-foreground">
                                                    <span className="font-medium text-foreground">Accommodation:</span> {day.accommodation}
                                                </span>
                                            </div>
                                        )}
                                        {day.meals && day.meals.length > 0 && (
                                            <div className="flex items-center gap-2 text-sm flex-wrap">
                                                <span className="font-medium text-foreground">Meals:</span>
                                                {day.meals.map((meal, mealIndex) => (
                                                    <span key={mealIndex} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                                                        {meal}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="scroll-mt-36 space-y-8">
                <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                        <DollarSign className="w-6 h-6 text-primary flex-shrink-0" />
                        {t('tourDetail.pricingAndPackages')}
                    </h2>
                    <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 md:p-8 border border-primary/20">
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Starting Rate</span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-4xl md:text-5xl font-bold text-primary">${tour.priceFrom.toLocaleString()}</span>
                            <span className="text-muted-foreground text-sm font-medium">per person</span>
                        </div>
                        <div className="grid sm:grid-cols-3 gap-4 text-sm pt-4 border-t border-border/50">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                                <span className="text-muted-foreground">Duration:</span>
                                <span className="font-semibold text-foreground">{tour.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                                <span className="text-muted-foreground">Start/End:</span>
                                <span className="font-semibold text-foreground">{tour.startEnd}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary flex-shrink-0" />
                                <span className="text-muted-foreground">Group Size:</span>
                                <span className="font-semibold text-foreground">Up to 20 people</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mt-8">
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                {t('tourDetail.whatsIncluded')}
                            </h3>
                            <ul className="space-y-3">
                                {tour.included.map((item, index) => (
                                    <li key={index} className="flex items-start space-x-3 p-3 bg-green-500/5 rounded-lg border border-green-500/10">
                                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-foreground text-sm leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                {t('tourDetail.whatsExcluded')}
                            </h3>
                            <ul className="space-y-3">
                                {tour.excluded.map((item, index) => (
                                    <li key={index} className="flex items-start space-x-3 p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                                        <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-foreground text-sm leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section id="reviews" className="scroll-mt-36">
                <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                        <Star className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                        {t('tourDetail.reviewsAndRatings')}
                    </h2>
                    {tour.reviewCount > 0 ? (
                        <div className="text-center py-12 bg-muted/20 border border-border/30 rounded-2xl">
                            <Star className="w-16 h-16 text-yellow-500 mx-auto mb-4 fill-current" />
                            <p className="text-3xl font-bold text-foreground mb-2">{(tour.rating / 2).toFixed(1)} / 5</p>
                            <p className="text-muted-foreground text-sm">({tour.reviewCount} reviews)</p>
                            <p className="text-xs text-muted-foreground mt-4">Verified customer reviews coming soon!</p>
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-muted/20 border border-border/30 rounded-2xl">
                            <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <p className="text-lg font-bold text-foreground mb-2">No Reviews Yet</p>
                            <p className="text-sm text-muted-foreground">Be the first to review this package after your trek!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="scroll-mt-36">
                <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                        <ImageIcon className="w-6 h-6 text-primary flex-shrink-0" />
                        {t('tourDetail.photoGallery')}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="col-span-2 row-span-2 relative aspect-square rounded-xl overflow-hidden group">
                            <NextImage
                                src={tour.imageUrl}
                                alt={tour.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 66vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {tour.highlights.slice(0, 4).map((highlight, index) => (
                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-muted flex items-center justify-center border border-border/50 group">
                                <div className="text-center p-4">
                                    <CheckCircle className="w-6 h-6 text-primary mx-auto mb-2" />
                                    <p className="text-xs font-semibold text-foreground line-clamp-2">{highlight}</p>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Related Tours Section */}
            <section id="related" className="scroll-mt-36">
                {relatedTours.length > 0 ? (
                    <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{t('tourDetail.relatedTours')}</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {relatedTours.map((relatedTour) => (
                                <Link
                                    key={relatedTour.id}
                                    href={`/safaris-tours/${relatedTour.slug}`}
                                    className="group bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="relative aspect-[16/9] overflow-hidden">
                                        <NextImage
                                            src={relatedTour.imageUrl}
                                            alt={relatedTour.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                                            From ${relatedTour.priceFrom.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors text-sm md:text-base leading-snug">
                                            {relatedTour.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                            {relatedTour.shortDescription}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground">{relatedTour.duration}</span>
                                            <span className="text-primary font-semibold text-xs group-hover:underline">{t('tourCard.viewDetails')} →</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 bg-muted/20 border border-border/30 rounded-2xl">
                        <p className="text-muted-foreground text-sm">No related tours available.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
