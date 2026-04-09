"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from 'next-intl';
import { Link as I18nLink } from '@/i18n/navigation';
import Image from "next/image";
import { ArrowRight, Phone, Mail, MapPin, Clock, Calendar, CheckCircle2, Camera, Shield, Wrench, Send, Grid, ListFilter, Images, Heart, Star, Quote, ChevronLeft, ChevronRight, X, ZoomIn, Video, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { vehicles, safariMoments, photographyTips, testimonials as testimonialsData, vehicleFeatures } from "./data";
import { Vehicle, Testimonial } from "./types";
import { useAnalytics } from "./hooks/use-analytics";
import { SafariConfigurator, VideoGallery, InstagramFeed, BookingWidget, generateVehiclePDF } from "./components";
import { HeroSection } from "./components/hero-section";

export default function VehiclesPage() {
    const t = useTranslations();
    const [activeTab, setActiveTab] = useState("all");
    const [selectedVehicle, setSelectedVehicle] = useState(0);
    const [galleryFilter, setGalleryFilter] = useState("all");
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const { trackEvent } = useAnalytics();

    // Memoize expensive computations
    const tabs = useMemo(() => [
        { id: "all", label: t('vehicles.tabs.all'), icon: Grid, shortLabel: 'All' },
        { id: "fleets", label: t('vehicles.tabs.fleets'), icon: ListFilter, shortLabel: 'Fleet' },
        { id: "gallery", label: t('vehicles.tabs.gallery'), icon: Images, shortLabel: 'Gallery' },
        { id: "moments", label: t('vehicles.tabs.moments'), icon: Heart, shortLabel: 'Moments' },
        { id: "configurator", label: t('vehicles.tabs.configurator'), icon: Settings, shortLabel: 'Config' },
        { id: "videos", label: t('vehicles.tabs.videos'), icon: Video, shortLabel: 'Videos' },
        { id: "instagram", label: t('vehicles.tabs.instagram'), icon: Heart, shortLabel: 'Insta' },
        { id: "booking", label: t('vehicles.tabs.booking'), icon: Calendar, shortLabel: 'Book' }
    ], [t]);

    // Track tab changes
    useEffect(() => {
        trackEvent('tab_view', { tab: activeTab });
    }, [activeTab, trackEvent]);

    // Memoize tab content rendering
    const renderTabContent = useMemo(() => {
        switch (activeTab) {
            case "all":
                return <AllVehiclesSection vehicles={vehicles} />;
            case "fleets":
                return <FleetsSection vehicles={vehicles} selectedVehicle={selectedVehicle} setSelectedVehicle={setSelectedVehicle} onDownloadPDF={generateVehiclePDF} />;
            case "gallery":
                return <GallerySection vehicles={vehicles} galleryFilter={galleryFilter} setGalleryFilter={setGalleryFilter} setLightboxImage={setLightboxImage} trackEvent={trackEvent} />;
            case "moments":
                return <MomentsSection moments={safariMoments} tips={photographyTips} testimonials={testimonialsData} currentTestimonial={currentTestimonial} setCurrentTestimonial={setCurrentTestimonial} trackEvent={trackEvent} />;
            case "configurator":
                return <SafariConfigurator />;
            case "videos":
                return <VideoGallery />;
            case "instagram":
                return <InstagramFeed />;
            case "booking":
                return <BookingWidget />;
            default:
                return <AllVehiclesSection vehicles={vehicles} />;
        }
    }, [activeTab, selectedVehicle, galleryFilter, lightboxImage, currentTestimonial, trackEvent]);

    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section - Optimized for LCP */}
            <HeroSection />

            {/* Sticky Tab Navigation - Mobile Optimized */}
            <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-sm">
                <div className="container px-2 md:px-4">
                    {/* Mobile: Scrollable tabs with gradient indicators */}
                    <div className="relative md:hidden">
                        {/* Left gradient fade */}
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background/95 to-transparent z-10 pointer-events-none" />
                        {/* Right gradient fade */}
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background/95 to-transparent z-10 pointer-events-none" />

                        <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide px-2 snap-x snap-mandatory">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center justify-center flex-shrink-0 px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-300 whitespace-nowrap snap-start ${activeTab === tab.id
                                            ? 'bg-primary text-white shadow-lg scale-105'
                                            : 'bg-card text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border/30'
                                            }`}
                                    >
                                        <Icon className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                                        <span className="truncate">{tab.shortLabel}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Desktop: Centered tabs */}
                    <div className="hidden md:flex justify-center space-x-2 py-4">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-primary text-white shadow-lg scale-105'
                                        : 'bg-card text-muted-foreground hover:bg-primary/10 hover:text-primary'
                                        }`}
                                >
                                    <Icon className="w-4 h-4 mr-2" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <section id="fleet-details" className="py-12 md:py-16 lg:py-20 bg-background">
                <div className="container px-4">
                    {renderTabContent}
                </div>
            </section>

            {/* Lightbox Modal */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                    onClick={() => setLightboxImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white hover:text-primary transition-colors"
                        onClick={() => setLightboxImage(null)}
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <div
                        className="relative max-w-6xl max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={lightboxImage}
                            alt="Gallery image"
                            width={1200}
                            height={800}
                            className="object-contain rounded-lg"
                        />
                    </div>
                </div>
            )}

            {/* CTA Section */}
            <section className="py-16 md:py-20 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
                <div className="container px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                        {t('vehicles.cta.title')}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        {t('vehicles.cta.description')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6" nativeButton={false} render={<I18nLink href="/contact" className="inline-flex items-center" />}>
                            {t('vehicles.cta.consultation')}
                            <Phone className="w-5 h-5 ml-2" />
                        </Button>
                        <Button size="lg" variant="outline" className="px-8 py-6" nativeButton={false} render={<I18nLink href="/safaris-tours" className="inline-flex items-center" />}>
                            {t('vehicles.cta.viewPackages')}
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    );
}

// ==================== TAB CONTENT COMPONENTS ====================

function AllVehiclesSection({ vehicles }: { vehicles: Vehicle[] }) {
    const t = useTranslations();
    return (
        <div className="space-y-12">
            {/* Comparison Table */}
            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border/50 shadow-sm">
                <h3 className="text-2xl font-bold text-foreground mb-6 text-center">{t('vehicles.comparison.title')}</h3>
                <div className="overflow-x-auto relative">
                    {/* Mobile scroll hint */}
                    <div className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none bg-gradient-to-l from-background to-transparent w-16 h-full z-10 flex items-center justify-end pr-2">
                        <span className="text-xs text-muted-foreground animate-pulse">→</span>
                    </div>
                    <table className="w-full text-sm" style={{ tableLayout: 'fixed' }}>
                        <colgroup>
                            <col style={{ width: '25%' }} />
                            <col style={{ width: '25%' }} />
                            <col style={{ width: '25%' }} />
                            <col style={{ width: '25%' }} />
                        </colgroup>
                        <thead>
                            <tr className="border-b-2 border-primary/20">
                                <th className="text-left py-3 px-2 md:px-4 text-muted-foreground font-semibold text-xs md:text-sm">{t('vehicles.comparison.feature')}</th>
                                {vehicles.map(v => (
                                    <th key={v.id} className="text-center py-3 px-2 md:px-4 text-foreground font-bold text-xs md:text-sm">{v.name.split(' ').slice(-2).join(' ')}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-border/30">
                                <td className="py-3 px-2 md:px-4 text-muted-foreground text-xs md:text-sm">{t('vehicles.comparison.capacity')}</td>
                                {vehicles.map(v => (
                                    <td key={v.id} className="text-center py-3 px-2 md:px-4 text-foreground font-medium text-xs md:text-sm">{v.capacity}</td>
                                ))}
                            </tr>
                            <tr className="border-b border-border/30">
                                <td className="py-3 px-2 md:px-4 text-muted-foreground text-xs md:text-sm">{t('vehicles.comparison.priceRange')}</td>
                                {vehicles.map((v, idx) => (
                                    <td key={v.id} className="text-center py-3 px-2 md:px-4 font-bold text-xs md:text-sm">
                                        <div className="flex items-center justify-center gap-1">
                                            <span className="text-primary">{idx === 0 ? '$$$$' : idx === 1 ? '$$$' : '$$'}</span>
                                            <span className="text-foreground">{v.priceRange}</span>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                            <tr className="border-b border-border/30">
                                <td className="py-3 px-2 md:px-4 text-muted-foreground text-xs md:text-sm">{t('vehicles.comparison.popUpRoof')}</td>
                                {vehicles.map(v => (
                                    <td key={v.id} className="text-center py-3 px-2 md:px-4">
                                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary mx-auto" />
                                    </td>
                                ))}
                            </tr>
                            <tr className="border-b border-border/30">
                                <td className="py-3 px-2 md:px-4 text-muted-foreground text-xs md:text-sm">{t('vehicles.comparison.refrigerator')}</td>
                                {vehicles.map((v, i) => (
                                    <td key={v.id} className="text-center py-3 px-2 md:px-4">
                                        {i === 0 ? <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary mx-auto" /> : <span className="text-muted-foreground text-lg">—</span>}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="py-3 px-2 md:px-4 text-muted-foreground text-xs md:text-sm">{t('vehicles.comparison.rating')}</td>
                                {vehicles.map(v => (
                                    <td key={v.id} className="text-center py-3 px-2 md:px-4">
                                        <div className="flex items-center justify-center gap-1">
                                            <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-current" />
                                            <span className="font-bold text-foreground text-xs md:text-sm">{v.rating}</span>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Vehicle Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50">
                        <div className="relative aspect-[4/3] overflow-hidden">
                            <Image
                                src={vehicle.imageUrl}
                                alt={vehicle.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                loading="lazy"
                            />
                            <div className="absolute top-3 left-3 flex gap-2">
                                <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                                    {vehicle.capacity}
                                </span>
                                <span className="px-3 py-1 bg-accent text-white text-xs font-bold rounded-full flex items-center gap-1">
                                    {vehicle.id === 1 ? '$$$$' : vehicle.id === 2 ? '$$$' : '$$'} {vehicle.priceRange}
                                </span>
                            </div>
                        </div>

                        <div className="p-6">
                            <h4 className="text-xl font-bold text-foreground mb-2">{vehicle.name}</h4>
                            <p className="text-sm text-muted-foreground mb-4">{vehicle.category}</p>

                            <div className="flex items-center gap-2 mb-4">
                                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                                <span className="font-bold text-foreground">{vehicle.rating}</span>
                                <span className="text-muted-foreground">({vehicle.reviews} {t('vehicles.comparison.reviews')})</span>
                            </div>

                            <div className="mb-4">
                                <p className="text-xs text-muted-foreground mb-2 font-semibold">{t('vehicles.comparison.bestFor')}</p>
                                <div className="flex flex-wrap gap-2">
                                    {vehicle.bestFor.map((tag, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <ul className="space-y-2 mb-6">
                                {vehicle.features.slice(0, 4).map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button className="w-full" variant="outline">
                                {t('buttons.viewDetails')}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FleetsSection({
    vehicles,
    selectedVehicle,
    setSelectedVehicle,
    onDownloadPDF
}: {
    vehicles: Vehicle[];
    selectedVehicle: number;
    setSelectedVehicle: (idx: number) => void;
    onDownloadPDF: (vehicle: Vehicle) => void;
}) {
    const t = useTranslations();
    const vehicle = vehicles[selectedVehicle];

    return (
        <div className="space-y-8">
            {/* Vehicle Selector Tabs */}
            <div className="flex justify-center space-x-2 md:space-x-4">
                {vehicles.map((v, idx) => (
                    <button
                        key={v.id}
                        onClick={() => setSelectedVehicle(idx)}
                        className={`px-4 md:px-6 py-3 rounded-xl text-sm md:text-base font-semibold transition-all duration-300 ${selectedVehicle === idx
                            ? 'bg-primary text-white shadow-lg scale-105'
                            : 'bg-card text-muted-foreground hover:bg-primary/10 border border-border/50'
                            }`}
                    >
                        {v.name}
                    </button>
                ))}
            </div>

            {/* Selected Vehicle Details */}
            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border/50 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Vehicle Image & Quick Info */}
                    <div>
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-6">
                            <Image
                                src={vehicle.imageUrl}
                                alt={vehicle.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                priority
                            />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">{vehicle.name}</h3>
                        <p className="text-muted-foreground mb-4">{vehicle.category}</p>
                        <Button onClick={() => onDownloadPDF(vehicle)} className="w-full">
                            <Send className="w-4 h-4 mr-2" />
                            {t('vehicles.fleets.downloadPDF')}
                        </Button>
                    </div>

                    {/* Specifications */}
                    <div className="space-y-6">
                        {/* Engine & Performance */}
                        <div>
                            <h4 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                <Settings className="w-5 h-5 text-primary" />
                                {t('vehicles.fleets.enginePerformance')}
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(vehicle.specifications).map(([key, value]) => (
                                    <div key={key} className="bg-muted/50 rounded-lg p-3">
                                        <p className="text-xs text-muted-foreground capitalize mb-1">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </p>
                                        <p className="text-sm font-semibold text-foreground">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Safety Features */}
                        <div>
                            <h4 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-primary" />
                                {t('vehicles.fleets.safetyFeatures')}
                            </h4>
                            <div className="grid grid-cols-1 gap-2">
                                {vehicle.safetyFeatures.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                                        <span className="text-foreground">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Safari Equipment */}
                        <div>
                            <h4 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                <Camera className="w-5 h-5 text-primary" />
                                {t('vehicles.fleets.safariEquipment')}
                            </h4>
                            <div className="grid grid-cols-1 gap-2">
                                {vehicle.safariEquipment.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                                        <span className="text-foreground">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function GallerySection({
    vehicles,
    galleryFilter,
    setGalleryFilter,
    setLightboxImage,
    trackEvent
}: {
    vehicles: Vehicle[];
    galleryFilter: string;
    setGalleryFilter: (filter: string) => void;
    setLightboxImage: (img: string | null) => void;
    trackEvent: (name: string, data?: any) => void;
}) {
    const t = useTranslations();
    const galleryFilters = [
        { id: "all", label: t('vehicles.gallery.allViews') },
        { id: "exterior", label: t('vehicles.gallery.exterior') },
        { id: "interior", label: t('vehicles.gallery.interior') },
        { id: "action", label: t('vehicles.gallery.actionShots') }
    ];

    const getAllImages = () => {
        const images: { src: string; alt: string; category: string }[] = [];

        vehicles.forEach(vehicle => {
            if (galleryFilter === "all" || galleryFilter === "exterior") {
                vehicle.exteriorImages.forEach((img, idx) => {
                    images.push({ src: img, alt: `${vehicle.name} exterior ${idx + 1}`, category: "exterior" });
                });
            }
            if (galleryFilter === "all" || galleryFilter === "interior") {
                vehicle.interiorImages.forEach((img, idx) => {
                    images.push({ src: img, alt: `${vehicle.name} interior ${idx + 1}`, category: "interior" });
                });
            }
            if (galleryFilter === "all" || galleryFilter === "action") {
                vehicle.actionShots.forEach((img, idx) => {
                    images.push({ src: img, alt: `${vehicle.name} action ${idx + 1}`, category: "action" });
                });
            }
        });

        return images;
    };

    const allImages = getAllImages();

    return (
        <div className="space-y-8">
            {/* Filter Bar */}
            <div className="flex flex-wrap justify-center gap-2">
                {galleryFilters.map(filter => (
                    <button
                        key={filter.id}
                        onClick={() => {
                            setGalleryFilter(filter.id);
                            trackEvent('gallery_filter_change', { filter: filter.id });
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${galleryFilter === filter.id
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-card text-muted-foreground hover:bg-primary/10 border border-border/50'
                            }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Masonry Gallery Grid */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                {allImages.slice(0, 12).map((img, idx) => (
                    <div
                        key={idx}
                        className="break-inside-avoid group relative cursor-pointer overflow-hidden rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300"
                        onClick={() => {
                            setLightboxImage(img.src);
                            trackEvent('gallery_image_click', { image: img.alt, category: img.category });
                        }}
                    >
                        <div className="relative aspect-[4/3]">
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                loading={idx < 4 ? "eager" : "lazy"}
                                quality={idx < 4 ? 85 : 75}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <ZoomIn className="w-12 h-12 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
                {allImages.length > 12 && (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground text-sm">Showing 12 of {allImages.length} images. Use filters to see more.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function MomentsSection({
    moments,
    tips,
    testimonials,
    currentTestimonial,
    setCurrentTestimonial,
    trackEvent
}: {
    moments: typeof safariMoments;
    tips: typeof photographyTips;
    testimonials: Testimonial[];
    currentTestimonial: number;
    setCurrentTestimonial: (idx: number) => void;
    trackEvent: (name: string, data?: any) => void;
}) {
    const t = useTranslations();
    const nextTestimonial = () => {
        setCurrentTestimonial((currentTestimonial + 1) % testimonials.length);
        trackEvent('testimonial_navigation', { direction: 'next' });
    };

    const prevTestimonial = () => {
        setCurrentTestimonial(currentTestimonial === 0 ? testimonials.length - 1 : currentTestimonial - 1);
        trackEvent('testimonial_navigation', { direction: 'prev' });
    };

    return (
        <div className="space-y-12">
            {/* Hero Quote */}
            <div className="text-center max-w-3xl mx-auto">
                <Quote className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
                <blockquote className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-relaxed">
                    {t('vehicles.moments.quote')}
                </blockquote>
                <p className="text-muted-foreground">{t('vehicles.moments.quoteSubtitle')}</p>
            </div>

            {/* Safari Moments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {moments.map(moment => (
                    <div key={moment.id} className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 group">
                        <div className="relative aspect-[4/3]">
                            <Image
                                src={moment.photo}
                                alt={moment.caption}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-muted-foreground italic mb-4 line-clamp-3">"{moment.caption}"</p>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-foreground text-sm">{moment.guest}</p>
                                    <p className="text-xs text-muted-foreground">{moment.location}</p>
                                </div>
                                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                                    {moment.vehicle}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Photography Tips */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 md:p-8 border border-primary/20">
                <h3 className="text-2xl font-bold text-foreground mb-6 text-center">{t('vehicles.moments.photoTips')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tips.map((tip, idx) => {
                        const Icon = tip.icon;
                        return (
                            <div key={idx} className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground mb-1">{tip.title}</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{tip.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Testimonials Carousel */}
            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border/50 shadow-sm">
                <h3 className="text-2xl font-bold text-foreground mb-6 text-center">{t('vehicles.moments.testimonials')}</h3>
                <div className="max-w-3xl mx-auto">
                    <div className="relative">
                        <div className="text-center">
                            <div className="flex justify-center mb-4">
                                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                                    <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
                                ))}
                            </div>
                            <p className="text-lg text-muted-foreground italic mb-6 leading-relaxed">
                                "{testimonials[currentTestimonial].text}"
                            </p>
                            <div>
                                <p className="font-bold text-foreground">{testimonials[currentTestimonial].guest}</p>
                                <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial].location}</p>
                                <p className="text-xs text-primary mt-2">{testimonials[currentTestimonial].vehicle}</p>
                            </div>
                        </div>

                        {/* Navigation Controls */}
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <button
                                onClick={prevTestimonial}
                                className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-white transition-all flex items-center justify-center"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="flex gap-2">
                                {testimonials.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentTestimonial(idx)}
                                        className={`w-2 h-2 rounded-full transition-all ${idx === currentTestimonial ? 'bg-primary w-6' : 'bg-muted'
                                            }`}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={nextTestimonial}
                                className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-white transition-all flex items-center justify-center"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Share Your Moments CTA */}
            <div className="text-center bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
                <h4 className="text-xl font-bold text-foreground mb-3">{t('vehicles.moments.shareMoments.title')}</h4>
                <p className="text-muted-foreground mb-4">{t('vehicles.moments.shareMoments.description')}</p>
                <div className="inline-flex items-center px-4 py-2 bg-white dark:bg-card rounded-full border border-border/50">
                    <span className="text-primary font-semibold">#SenzaLuceSafaris</span>
                </div>
            </div>
        </div>
    );
}
