import Link from "next/link";
import Image from "next/image";
import { getToursByDestination } from "@/lib/db";
import { ArrowRight, Calendar, DollarSign, Star } from "lucide-react";

interface RelatedToursProps {
    destinationSlug: string;
}

export default async function RelatedTours({ destinationSlug }: RelatedToursProps) {
    const tours = await getToursByDestination(destinationSlug);

    if (!tours || tours.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours.map((tour) => (
                    <Link
                        key={tour.id}
                        href={`/safaris-tours/${tour.slug}`}
                        className="group bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="relative aspect-[16/9] overflow-hidden">
                            <Image
                                src={tour.imageUrl}
                                alt={tour.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                                From ${tour.priceFrom.toLocaleString()}
                            </div>
                        </div>

                        <div className="p-5">
                            <h3 className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                {tour.name}
                            </h3>

                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {tour.shortDescription}
                            </p>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span>{tour.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <DollarSign className="w-4 h-4 text-primary" />
                                    <span>Starting at ${tour.priceFrom.toLocaleString()} per person</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    <span className="font-semibold">{tour.rating}/10</span>
                                    <span className="text-muted-foreground">({tour.reviewCount} reviews)</span>
                                </div>
                            </div>

                            <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                                View Tour Details
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="text-center pt-4">
                <Link
                    href="/safaris-tours"
                    className="inline-flex items-center text-primary hover:underline font-medium"
                >
                    View All Safari Packages
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
            </div>
        </div>
    );
}
