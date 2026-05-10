import { TourPackage } from "@/data/tours";
import { CheckCircle, XCircle, Star, Tag, CalendarDays, DollarSign, Image as ImageIcon, Users, Clock, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import NextImage from "next/image";

interface TourDetailTabsProps {
    tour: TourPackage;
    relatedTours: TourPackage[];
    t: (key: string) => string;
}

export function TourDetailTabs({ tour, relatedTours, t }: TourDetailTabsProps) {
    return (
        <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 h-auto p-1">
                <TabsTrigger value="overview" className="flex items-center gap-2 py-3">
                    <Star className="w-4 h-4 hidden sm:inline" />
                    <span className="text-xs sm:text-sm">{t('tourDetail.overview')}</span>
                </TabsTrigger>
                <TabsTrigger value="itinerary" className="flex items-center gap-2 py-3">
                    <CalendarDays className="w-4 h-4 hidden sm:inline" />
                    <span className="text-xs sm:text-sm">{t('tourDetail.itinerary')}</span>
                </TabsTrigger>
                <TabsTrigger value="pricing" className="flex items-center gap-2 py-3">
                    <DollarSign className="w-4 h-4 hidden sm:inline" />
                    <span className="text-xs sm:text-sm">{t('tourDetail.pricing')}</span>
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex items-center gap-2 py-3">
                    <Star className="w-4 h-4 hidden sm:inline" />
                    <span className="text-xs sm:text-sm">{t('tourDetail.reviews')}</span>
                </TabsTrigger>
                <TabsTrigger value="gallery" className="flex items-center gap-2 py-3 col-span-2 lg:col-span-1">
                    <ImageIcon className="w-4 h-4 hidden sm:inline" />
                    <span className="text-xs sm:text-sm">{t('tourDetail.gallery')}</span>
                </TabsTrigger>
                <TabsTrigger value="related" className="flex items-center gap-2 py-3 col-span-2 lg:col-span-1">
                    <Users className="w-4 h-4 hidden sm:inline" />
                    <span className="text-xs sm:text-sm">{t('tourDetail.related')}</span>
                </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6 space-y-8">
                <section>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{t('tourDetail.overview')}</h2>
                    <div className="prose prose-lg max-w-none text-muted-foreground">
                        <p className="leading-relaxed text-base md:text-lg">{tour.overview}</p>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                        <Star className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                        {t('tourDetail.highlights')}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {tour.highlights.map((highlight, index) => (
                            <div key={index} className="flex items-start space-x-3 p-4 bg-card border border-border/50 rounded-xl hover:shadow-md transition-shadow">
                                <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span className="text-foreground">{highlight}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                        <Tag className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                        {t('tourDetail.bestFor')}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {tour.bestFor.map((item, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium text-sm border border-primary/20"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </section>
            </TabsContent>

            {/* Itinerary Tab */}
            <TabsContent value="itinerary" className="mt-6">
                <section>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                        <CalendarDays className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                        {t('tourDetail.dayByDayItinerary')}
                    </h2>
                    <Accordion type="single" collapsible className="space-y-3">
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
                </section>
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing" className="mt-6">
                <section className="space-y-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                            <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                            {t('tourDetail.pricingAndPackages')}
                        </h2>
                        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 md:p-8 border border-primary/20">
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-sm text-muted-foreground">Starting from</span>
                            </div>
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-4xl md:text-5xl font-bold text-primary">${tour.priceFrom.toLocaleString()}</span>
                                <span className="text-muted-foreground">per person</span>
                            </div>
                            <div className="grid sm:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <span className="text-muted-foreground">Duration:</span>
                                    <span className="font-semibold text-foreground">{tour.duration}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <span className="text-muted-foreground">Start/End:</span>
                                    <span className="font-semibold text-foreground">{tour.startEnd}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-primary" />
                                    <span className="text-muted-foreground">Group Size:</span>
                                    <span className="font-semibold text-foreground">Up to 20 people</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                {t('tourDetail.whatsIncluded')}
                            </h3>
                            <ul className="space-y-3">
                                {tour.included.map((item, index) => (
                                    <li key={index} className="flex items-start space-x-3 p-3 bg-green-500/5 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-foreground">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                                <XCircle className="w-6 h-6 text-red-600" />
                                {t('tourDetail.whatsExcluded')}
                            </h3>
                            <ul className="space-y-3">
                                {tour.excluded.map((item, index) => (
                                    <li key={index} className="flex items-start space-x-3 p-3 bg-red-500/5 rounded-lg">
                                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-foreground">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-6">
                <section>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                        <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />
                        {t('tourDetail.reviewsAndRatings')}
                    </h2>
                    <div className="text-center py-12 bg-muted/30 rounded-2xl">
                        <Star className="w-16 h-16 text-yellow-500 mx-auto mb-4 fill-current" />
                        <p className="text-3xl font-bold text-foreground mb-2">{tour.rating}/10</p>
                        <p className="text-muted-foreground">{tour.reviewCount} reviews</p>
                        <p className="text-sm text-muted-foreground mt-4">Reviews coming soon!</p>
                    </div>
                </section>
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery" className="mt-6">
                <section>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                        <ImageIcon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                        {t('tourDetail.photoGallery')}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="col-span-2 row-span-2 relative aspect-square rounded-xl overflow-hidden group">
                            <NextImage
                                src={tour.imageUrl}
                                alt={tour.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 66vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {tour.highlights.slice(0, 4).map((highlight, index) => (
                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-muted flex items-center justify-center group">
                                <div className="text-center p-4">
                                    <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                                    <p className="text-xs font-medium text-foreground line-clamp-2">{highlight}</p>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>
                </section>
            </TabsContent>

            {/* Related Tours Tab */}
            <TabsContent value="related" className="mt-6">
                {relatedTours.length > 0 ? (
                    <section>
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
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                                            From ${relatedTour.priceFrom.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                            {relatedTour.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                            {relatedTour.shortDescription}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">{relatedTour.duration}</span>
                                            <span className="text-primary font-semibold text-sm group-hover:underline">{t('tourCard.viewDetails')} →</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                ) : (
                    <div className="text-center py-12 bg-muted/30 rounded-2xl">
                        <p className="text-muted-foreground">No related tours available.</p>
                    </div>
                )}
            </TabsContent>
        </Tabs>
    );
}
