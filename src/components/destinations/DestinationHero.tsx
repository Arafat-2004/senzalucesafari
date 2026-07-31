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
                    <div className="pointer-events-none absolute inset-0 bg-black/55" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/45" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/35" />
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

                        {/* Quick Stats - 2x2 Grid with Borders */}
                        <div className="grid max-w-xl grid-cols-2 gap-3.5">
                            <div className="bg-black/75 backdrop-blur-sm p-4 text-center rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                                <Mountain className="w-5 h-5 text-primary mx-auto mb-1.5" />
                                <p className="text-[10px] text-amber-400 font-semibold mb-0.5 uppercase tracking-wider">Park Size</p>
                                <p className="text-white font-bold text-sm">{parkSize}</p>
                            </div>
                            <div className="bg-black/75 backdrop-blur-sm p-4 text-center rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                                <Calendar className="w-5 h-5 text-primary mx-auto mb-1.5" />
                                <p className="text-[10px] text-amber-400 font-semibold mb-0.5 uppercase tracking-wider">Established</p>
                                <p className="text-white font-bold text-sm">{established}</p>
                            </div>
                            <div className="bg-black/75 backdrop-blur-sm p-4 text-center rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                                <Clock className="w-5 h-5 text-primary mx-auto mb-1.5" />
                                <p className="text-[10px] text-amber-400 font-semibold mb-0.5 uppercase tracking-wider">Recommended Stay</p>
                                <p className="text-white font-bold text-sm">{recommendedStay}</p>
                            </div>
                            <div className="bg-black/75 backdrop-blur-sm p-4 text-center rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                                <Mountain className="w-5 h-5 text-primary mx-auto mb-1.5" />
                                <p className="text-[10px] text-amber-400 font-semibold mb-0.5 uppercase tracking-wider">Elevation</p>
                                <p className="text-white font-bold text-sm">{elevation}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
