"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Play, X, Video } from "lucide-react";
import Image from "next/image";

interface VideoItem {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    videoUrl: string;
    platform: "youtube" | "vimeo" | "self-hosted";
    duration: string;
    category: string;
}

const sampleVideos: VideoItem[] = [
    {
        id: 1,
        title: "360° Virtual Tour - Land Cruiser VX",
        description: "Explore every angle of our luxury safari vehicle",
        thumbnail: "/images/vehicles/vx-exterior-1.jpg",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual video
        platform: "youtube",
        duration: "3:45",
        category: "360° Tour"
    },
    {
        id: 2,
        title: "Safari Walkthrough - Pop-Up Roof Demo",
        description: "See how the pop-up roof works for optimal wildlife viewing",
        thumbnail: "/images/vehicles/vx-popup-roof.jpg",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual video
        platform: "youtube",
        duration: "2:30",
        category: "Walkthrough"
    },
    {
        id: 3,
        title: "Action Footage - River Crossing",
        description: "Watch our vehicles tackle challenging terrain",
        thumbnail: "/images/vehicles/vx-river-crossing.jpg",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual video
        platform: "youtube",
        duration: "1:50",
        category: "Action"
    },
    {
        id: 4,
        title: "Interior Features Tour",
        description: "Discover all the amenities and comfort features",
        thumbnail: "/images/vehicles/vx-interior-1.jpg",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual video
        platform: "youtube",
        duration: "4:15",
        category: "Walkthrough"
    }
];

export default function VideoGallery() {
    const t = useTranslations();
    const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
    const [filter, setFilter] = useState("all");

    const categories = ["all", "360° Tour", "Walkthrough", "Action"];

    const filteredVideos = filter === "all"
        ? sampleVideos
        : sampleVideos.filter(v => v.category === filter);

    return (
        <div className="space-y-8">
            {/* Filter Bar */}
            <div className="flex flex-wrap justify-center gap-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === cat
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-card text-muted-foreground hover:bg-primary/10 border border-border/50'
                            }`}
                    >
                        {cat === "all" ? t('vehicles.videos.allVideos') : cat}
                    </button>
                ))}
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map(video => (
                    <div
                        key={video.id}
                        onClick={() => setSelectedVideo(video)}
                        className="group cursor-pointer bg-card rounded-xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                        {/* Thumbnail */}
                        <div className="relative aspect-video">
                            <Image
                                src={video.thumbnail}
                                alt={video.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Play className="w-8 h-8 text-primary ml-1" />
                                </div>
                            </div>
                            {/* Duration Badge */}
                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                                {video.duration}
                            </div>
                        </div>

                        {/* Video Info */}
                        <div className="p-4">
                            <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded mb-2">
                                {video.category}
                            </span>
                            <h4 className="font-bold text-foreground mb-1 line-clamp-2">{video.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Video Modal */}
            {selectedVideo && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                    onClick={() => setSelectedVideo(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white hover:text-primary transition-colors z-10"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div
                        className="relative w-full max-w-5xl aspect-video"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <iframe
                            src={selectedVideo.videoUrl}
                            title={selectedVideo.title}
                            className="w-full h-full rounded-lg"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                    </div>
                </div>
            )}

            {/* Coming Soon Notice */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/20 text-center">
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <Video className="w-4 h-4" />
                    {t('vehicles.videos.comingSoon')}
                </p>
            </div>
        </div>
    );
}
