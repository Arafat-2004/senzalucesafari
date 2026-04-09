import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { getDestinationBySlug } from "@/data/destinations";

interface RelatedDestinationsProps {
    destinationSlugs: string[];
}

export default function RelatedDestinations({ destinationSlugs }: RelatedDestinationsProps) {
    if (!destinationSlugs || destinationSlugs.length === 0) return null;

    const related = destinationSlugs
        .map(slug => getDestinationBySlug(slug))
        .filter((dest): dest is NonNullable<typeof dest> => dest !== undefined);

    if (related.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((dest) => (
                <Link
                    key={dest.slug}
                    href={`/destinations/${dest.slug}`}
                    className="group bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                    <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                            src={dest.imageUrl}
                            alt={dest.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center gap-2 text-white/90 text-sm mb-1">
                                <MapPin className="w-4 h-4" />
                                <span>{dest.region}</span>
                            </div>
                            <h3 className="text-white font-bold text-lg">{dest.name}</h3>
                        </div>
                    </div>
                    <div className="p-4">
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{dest.shortDescription}</p>
                        <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                            Explore Destination
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
