import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Clock, Mountain } from "lucide-react";

interface DestinationHeroProps {
    name: string;
    region: string;
    imageUrl: string;
    fullDescription: string;
    parkSize: string;
    elevation: string;
    established: string;
    recommendedStay: string;
}

export default function DestinationHero({
    name,
    region,
    imageUrl,
    fullDescription,
    parkSize,
    elevation,
    established,
    recommendedStay
}: DestinationHeroProps) {
    return (
        <>
            {/* Hero Section */}
            <section className="relative flex min-h-[620px] items-end overflow-hidden md:h-[78vh] md:max-h-[820px]">
                <div className="absolute inset-0">
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-black/90" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-black/10" />
                </div>

                <div className="container relative z-10 px-4 pb-10 md:pb-14">
                    <div className="max-w-5xl">
                        <Link href="/destinations" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white">
                            <ArrowLeft className="h-4 w-4" />
                            All destinations
                        </Link>
                        <div className="flex items-center gap-2 text-white/90 mb-4">
                            <MapPin className="w-5 h-5" />
                            <span className="text-sm md:text-base font-medium">{region}</span>
                        </div>

                        <h1 className="mb-5 text-4xl font-bold leading-[1.05] tracking-tight text-white drop-shadow-lg md:text-6xl lg:text-7xl">
                            {name}
                        </h1>

                        <p className="mb-7 max-w-3xl text-base leading-relaxed text-white/90 drop-shadow-md md:text-xl">
                            {fullDescription.split('\n\n')[0]}
                        </p>

                        {/* Quick Stats */}
                        <div className="grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/20 bg-white/15 shadow-2xl backdrop-blur-md md:grid-cols-4">
                            <div className="bg-black/15 p-4 text-center md:p-5">
                                <Mountain className="w-6 h-6 text-primary mx-auto mb-2" />
                                <p className="text-xs text-white/70 mb-1">Park Size</p>
                                <p className="text-white font-bold text-sm">{parkSize}</p>
                            </div>
                            <div className="bg-black/15 p-4 text-center md:p-5">
                                <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
                                <p className="text-xs text-white/70 mb-1">Established</p>
                                <p className="text-white font-bold text-sm">{established}</p>
                            </div>
                            <div className="bg-black/15 p-4 text-center md:p-5">
                                <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                                <p className="text-xs text-white/70 mb-1">Recommended Stay</p>
                                <p className="text-white font-bold text-sm">{recommendedStay}</p>
                            </div>
                            <div className="bg-black/15 p-4 text-center md:p-5">
                                <Mountain className="w-6 h-6 text-primary mx-auto mb-2" />
                                <p className="text-xs text-white/70 mb-1">Elevation</p>
                                <p className="text-white font-bold text-sm">{elevation}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
