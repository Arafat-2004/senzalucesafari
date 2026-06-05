import Image from "next/image";
import { MapPin, Calendar, Clock, Mountain } from "lucide-react";

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
            <section className="relative h-[70vh] min-h-[600px] flex items-end overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60 pointer-events-none" />
                </div>

                <div className="relative z-10 container px-4 pb-12 md:pb-16">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-2 text-white/90 mb-4">
                            <MapPin className="w-5 h-5" />
                            <span className="text-sm md:text-base font-medium">{region}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            {name}
                        </h1>

                        <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mb-8">
                            {fullDescription.split('\n\n')[0]}
                        </p>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                            <div className="text-center">
                                <Mountain className="w-6 h-6 text-primary mx-auto mb-2" />
                                <p className="text-xs text-white/70 mb-1">Park Size</p>
                                <p className="text-white font-bold text-sm">{parkSize}</p>
                            </div>
                            <div className="text-center">
                                <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
                                <p className="text-xs text-white/70 mb-1">Established</p>
                                <p className="text-white font-bold text-sm">{established}</p>
                            </div>
                            <div className="text-center">
                                <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                                <p className="text-xs text-white/70 mb-1">Recommended Stay</p>
                                <p className="text-white font-bold text-sm">{recommendedStay}</p>
                            </div>
                            <div className="text-center">
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
