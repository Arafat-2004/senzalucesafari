"use client";

import { useState, useRef } from "react";
import { TourPackage } from "@/data/tours";
import { Review } from "@/types/reviews";
import { CheckCircle, XCircle, Star, Tag, CalendarDays, DollarSign, Image as ImageIcon, Users, Clock, MapPin, BadgeCheck, MessageSquarePlus, Sparkles, User, Calendar, Map } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import NextImage from "next/image";
import { toast } from "sonner";

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
    'tourDetail.related': 'Related Tours',
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
    reviews?: Review[];
}

export function TourDetailTabs({ tour, relatedTours, reviews = [] }: TourDetailTabsProps) {
    const [activeTab, setActiveTab] = useState("overview");
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Review form state
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [country, setCountry] = useState("");
    const [rating, setRating] = useState(5);
    const [title, setTitle] = useState("");
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !title || !comment) {
            toast.error("Please fill in all required fields.");
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tourId: tour.id,
                    customerName: name,
                    customerEmail: email,
                    country,
                    rating,
                    title,
                    comment,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Review submitted successfully! It will be live after admin approval.");
                setName("");
                setEmail("");
                setCountry("");
                setRating(5);
                setTitle("");
                setComment("");
                setShowForm(false);
            } else {
                toast.error(data.error || "Failed to submit review.");
            }
        } catch {
            toast.error("Failed to submit review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const sections = [
        { id: "overview", label: t('tourDetail.overview'), icon: Star },
        { id: "itinerary", label: t('tourDetail.itinerary'), icon: CalendarDays },
        { id: "pricing", label: t('tourDetail.pricing'), icon: DollarSign },
        { id: "reviews", label: t('tourDetail.reviews'), icon: Star },
        { id: "gallery", label: t('tourDetail.gallery'), icon: ImageIcon },
        { id: "related", label: t('tourDetail.related'), icon: Users },
    ];

    const handleTabChange = (id: string) => {
        setActiveTab(id);
        
        // Scroll back to the top of the tabs section container so the user sees the newly opened tab content
        if (containerRef.current) {
            const offset = 90; // offset to clear sticky header
            const containerPosition = containerRef.current.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: containerPosition - offset,
                behavior: "smooth"
            });
        }
    };

    return (
        <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 scroll-mt-24">
            {/* Main Content Area */}
            <div className="lg:col-span-9 space-y-6">
                
                {/* Horizontal Scrolling Tab Bar */}
                <div className="sticky top-[72px] z-30 bg-background/95 backdrop-blur border-b border-border/50 -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
                    <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-2">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeTab === section.id;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => handleTabChange(section.id)}
                                    className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                                        isActive
                                            ? "border-primary text-primary font-bold bg-primary/5"
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

                {/* Active Tab Panel */}
                <div className="min-h-[400px]">
                    {/* Overview Tab Content */}
                    {activeTab === "overview" && (
                        <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 space-y-8 animate-in fade-in duration-200">
                            <section>
                                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">{t('tourDetail.overview')}</h2>
                                <div className="prose prose-lg max-w-none text-muted-foreground">
                                    <p className="leading-relaxed text-sm md:text-base">{tour.overview}</p>
                                </div>
                            </section>

                            <section className="pt-6 border-t border-border/50">
                                <h3 className="text-lg md:text-xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <Star className="w-5 h-5 text-primary flex-shrink-0" />
                                    {t('tourDetail.highlights')}
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {tour.highlights.map((highlight, index) => (
                                        <div key={index} className="flex items-start space-x-3 p-4 bg-muted/20 border border-border/30 rounded-xl">
                                            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                            <span className="text-foreground text-xs md:text-sm">{highlight}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="pt-6 border-t border-border/50">
                                <h3 className="text-lg md:text-xl font-bold text-foreground mb-4 flex items-center gap-3">
                                    <Tag className="w-5 h-5 text-primary flex-shrink-0" />
                                    {t('tourDetail.bestFor')}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {tour.bestFor.map((item, index) => (
                                        <span
                                            key={index}
                                            className="px-3.5 py-1.5 bg-primary/10 text-primary rounded-full font-medium text-xs border border-primary/20"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {/* Itinerary Tab Content */}
                    {activeTab === "itinerary" && (
                        <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 space-y-6 animate-in fade-in duration-200">
                            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                                <CalendarDays className="w-5 h-5 text-primary flex-shrink-0" />
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
                                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex-shrink-0">
                                                    {index + 1}
                                                </span>
                                                <div>
                                                    <p className="text-sm md:text-base leading-tight">{day.title}</p>
                                                    {day.activities && day.activities.length > 0 && (
                                                        <p className="text-[10px] text-muted-foreground font-normal mt-0.5">
                                                            {day.activities.length} activities
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-5 pt-2">
                                            <div className="space-y-4 ml-11">
                                                {day.description && (
                                                    <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{day.description}</p>
                                                )}
                                                {day.activities && day.activities.length > 0 && (
                                                    <div className="space-y-2">
                                                        <h4 className="text-xs font-semibold text-foreground">Activities:</h4>
                                                        <ul className="space-y-1.5">
                                                            {day.activities.map((activity, actIndex) => (
                                                                <li key={actIndex} className="flex items-start gap-2 text-xs text-muted-foreground">
                                                                    <CheckCircle className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                                                                    <span>{activity}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {day.accommodation && (
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <MapPin className="w-3.5 h-3.5 text-primary" />
                                                        <span className="text-muted-foreground">
                                                            <span className="font-medium text-foreground">Accommodation:</span> {day.accommodation}
                                                        </span>
                                                    </div>
                                                )}
                                                {day.meals && day.meals.length > 0 && (
                                                    <div className="flex items-center gap-2 text-xs flex-wrap">
                                                        <span className="font-medium text-foreground">Meals:</span>
                                                        {day.meals.map((meal, mealIndex) => (
                                                            <span key={mealIndex} className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[10px]">
                                                                {meal}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                {day.imageUrl && (
                                                    <div className="relative mt-3 rounded-xl overflow-hidden border border-border/40 shadow-sm aspect-video md:aspect-[21/9] max-h-72 bg-muted group">
                                                        <NextImage
                                                            src={day.imageUrl}
                                                            alt={day.title || `Day ${index + 1}`}
                                                            fill
                                                            sizes="(max-width: 768px) 100vw, 800px"
                                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                                                        <span className="absolute bottom-2.5 left-3 text-[11px] font-medium text-white drop-shadow-md">
                                                            Day {index + 1} Highlight
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    )}

                    {/* Pricing Tab Content */}
                    {activeTab === "pricing" && (
                        <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 space-y-8 animate-in fade-in duration-200">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    <DollarSign className="w-5 h-5 text-primary flex-shrink-0" />
                                    {t('tourDetail.pricingAndPackages')}
                                </h2>
                                <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/20">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Starting Rate</span>
                                    </div>
                                    <div className="flex items-baseline gap-2 mb-6">
                                        <span className="text-3xl md:text-4xl font-bold text-primary">${tour.priceFrom.toLocaleString()}</span>
                                        <span className="text-muted-foreground text-xs font-medium">per person</span>
                                    </div>
                                    <div className="grid sm:grid-cols-3 gap-4 text-xs pt-4 border-t border-border/50">
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
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 flex-shrink-0 text-success" />
                                        {t('tourDetail.whatsIncluded')}
                                    </h3>
                                    <ul className="space-y-2.5">
                                        {tour.included.map((item, index) => (
                                <li key={index} className="tone-success flex items-start space-x-2.5 rounded-lg border p-2.5">
                                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                                <span className="text-foreground text-xs leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                            <XCircle className="h-4 w-4 flex-shrink-0 text-danger" />
                                        {t('tourDetail.whatsExcluded')}
                                    </h3>
                                    <ul className="space-y-2.5">
                                        {tour.excluded.map((item, index) => (
                                <li key={index} className="tone-danger flex items-start space-x-2.5 rounded-lg border p-2.5">
                                    <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                                <span className="text-foreground text-xs leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Reviews Tab Content */}
                    {activeTab === "reviews" && (
                        <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 space-y-8 animate-in fade-in duration-200">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
                                <div>
                                    <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-3">
                                        <Star className="h-6 w-6 fill-current text-brand-gold" />
                                        {t('tourDetail.reviewsAndRatings')}
                                    </h2>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        All reviews are submitted by verified guests of Senza Luce Safaris.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowForm(!showForm)}
                                    className="inline-flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/95 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all min-h-[40px]"
                                >
                                    <MessageSquarePlus className="w-4 h-4" />
                                    {showForm ? "Cancel Review" : "Write a Review"}
                                </button>
                            </div>

                            {/* Write Review Form */}
                            {showForm && (
                                <form onSubmit={handleSubmitReview} className="bg-muted/30 border border-border/60 rounded-2xl p-5 md:p-6 space-y-4 animate-in slide-in-from-top duration-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="w-4 h-4 text-brand-gold" />
                                        <h3 className="font-bold text-sm text-foreground">Share Your Experience</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5" /> Name <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Patricia O'Brien"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-background border border-border/80 rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="e.g. patricia@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-background border border-border/80 rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                                                <Map className="w-3.5 h-3.5" /> Country / Location
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. United Kingdom"
                                                value={country}
                                                onChange={(e) => setCountry(e.target.value)}
                                                className="w-full bg-background border border-border/80 rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                                                Rating <span className="text-danger">*</span>
                                            </label>
                                            <div className="flex items-center gap-1 py-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setRating(star)}
                                                        className="hover:scale-110 transition-transform"
                                                    >
                                                        <Star
                                                            className={`w-6 h-6 ${
                                                                star <= rating
                                                                    ? "fill-current text-brand-gold"
                                                                    : "text-muted-foreground/30"
                                                            }`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-muted-foreground">
                                            Review Title <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Summarize your experience (e.g. Magnificent Service & Stunning Views!)"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full bg-background border border-border/80 rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-muted-foreground">
                                            Your Review Details <span className="text-danger">*</span>
                                        </label>
                                        <textarea
                                            required
                                            rows={4}
                                            placeholder="Write your review here. Tell us about the wildlife, guide, accommodations, and itinerary..."
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="w-full bg-background border border-border/80 rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/95 px-5 py-3 rounded-xl text-xs font-semibold shadow-sm transition-all min-h-[44px] disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Submitting Review..." : "Submit Review for Approval"}
                                    </button>
                                </form>
                            )}

                            {/* Summary Statistics & Live Reviews list */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                                {/* Rating Summary Box */}
                                <div className="md:col-span-4 bg-muted/20 border border-border/30 rounded-2xl p-6 text-center space-y-4">
                                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Overall Rating</h3>
                                    <div className="space-y-1">
                                        <p className="text-5xl font-black text-foreground">
                                            {tour.reviewCount > 0 ? (tour.rating / 2).toFixed(1) : "0.0"}
                                        </p>
                                        <div className="flex items-center justify-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => {
                                                const avg = tour.reviewCount > 0 ? tour.rating / 2 : 0;
                                                return (
                                                    <Star
                                                        key={star}
                                                        className={`w-4 h-4 ${
                                                            star <= Math.round(avg)
                                                                ? "fill-current text-brand-gold"
                                                                : "text-muted-foreground/30"
                                                        }`}
                                                    />
                                                );
                                            })}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Based on {reviews.length} approved reviews</p>
                                    </div>

                                    {/* Star Rating Distribution Bars */}
                                    <div className="space-y-2 pt-2 border-t text-left">
                                        {[5, 4, 3, 2, 1].map((stars) => {
                                            const count = reviews.filter((r) => r.rating === stars).length;
                                            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                                            return (
                                                <div key={stars} className="flex items-center gap-2 text-xs">
                                                    <span className="w-3 font-semibold text-muted-foreground">{stars}</span>
                                                    <Star className="w-3 h-3 fill-current text-brand-gold flex-shrink-0" />
                                                    <div className="flex-1 h-2 bg-muted/60 rounded-full overflow-hidden">
                                                        <div
                                                            className="bg-brand-gold h-full rounded-full transition-all duration-500"
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                    <span className="w-4 text-right text-muted-foreground">{count}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Review List Grid */}
                                <div className="md:col-span-8 space-y-6">
                                    {reviews.length > 0 ? (
                                        <div className="divide-y divide-border/40 space-y-6">
                                            {reviews.map((review, idx) => (
                                                <div key={review.id} className={`pt-6 ${idx === 0 ? "pt-0" : ""}`}>
                                                    <div className="flex items-center justify-between gap-4 mb-2.5">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                                                {review.author
                                                                    .split(" ")
                                                                    .map((n) => n[0])
                                                                    .join("")
                                                                    .toUpperCase()
                                                                    .slice(0, 2)}
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-xs font-bold text-foreground">
                                                                        {review.author}
                                                                    </span>
                                                                    {review.verified && (
                                                                        <span className="inline-flex items-center gap-0.5 text-[9px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                                                            <BadgeCheck className="w-3 h-3" /> Verified
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {review.safariPackage && (
                                                                    <p className="text-[10px] text-muted-foreground font-medium">
                                                                        {review.safariPackage}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" /> {review.date}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-0.5 mb-2">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                className={`w-3.5 h-3.5 ${
                                                                    star <= review.rating
                                                                        ? "fill-current text-brand-gold"
                                                                        : "text-muted-foreground/30"
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>

                                                    <h4 className="font-bold text-sm text-foreground mb-1.5">{review.title}</h4>
                                                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                                        {review.content}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 bg-muted/20 border border-border/30 rounded-2xl space-y-3">
                                            <Star className="mx-auto h-10 w-10 text-muted-foreground/35" />
                                            <p className="text-sm font-bold text-foreground">No Verified Reviews Yet</p>
                                            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                                                Be the first to share your experience with this safari package. Click the write button above to submit.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Gallery Tab Content */}
                    {activeTab === "gallery" && (
                        <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 space-y-6 animate-in fade-in duration-200">
                            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                                <ImageIcon className="w-5 h-5 text-primary flex-shrink-0" />
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
                                            <CheckCircle className="w-5 h-5 text-primary mx-auto mb-1.5" />
                                            <p className="text-[10px] font-semibold text-foreground line-clamp-2">{highlight}</p>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Related Tours Tab Content */}
                    {activeTab === "related" && (
                        <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 space-y-6 animate-in fade-in duration-200">
                            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">{t('tourDetail.relatedTours')}</h2>
                            {relatedTours.length > 0 ? (
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
                                                <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-md">
                                                    From ${relatedTour.priceFrom.toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors text-xs md:text-sm leading-snug">
                                                    {relatedTour.name}
                                                </h3>
                                                <p className="text-[10px] text-muted-foreground mb-3 line-clamp-2">
                                                    {relatedTour.shortDescription}
                                                </p>
                                                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                                                    <span className="text-[10px] text-muted-foreground">{relatedTour.duration}</span>
                                                    <span className="text-primary font-semibold text-[10px] group-hover:underline">{t('tourCard.viewDetails')} →</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-muted/20 border border-border/30 rounded-2xl">
                                    <p className="text-muted-foreground text-xs">No related tours available.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar Tab Selector (Quick Navigation) */}
            <aside className="hidden lg:block lg:col-span-3">
                <nav className="bg-card border border-border/50 rounded-xl p-5 sticky top-24 shadow-sm">
                    <h3 className="font-bold text-foreground mb-4 text-base border-b pb-3">{t('tourDetail.quickNavigation')}</h3>
                    <ul className="space-y-1.5">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeTab === section.id;
                            return (
                                <li key={section.id}>
                                    <button
                                        onClick={() => handleTabChange(section.id)}
                                        className={`w-full text-left flex items-center gap-2.5 text-xs py-2.5 px-3.5 rounded-lg transition-all ${
                                            isActive
                                                ? 'bg-primary/10 text-primary font-semibold border-l-4 border-primary'
                                                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4 flex-shrink-0" />
                                        <span className="line-clamp-1">{section.label}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>
        </div>
    );
}
