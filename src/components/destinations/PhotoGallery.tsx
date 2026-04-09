"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface PhotoGalleryProps {
    images: string[];
    destinationName: string;
}

export default function PhotoGallery({ images, destinationName }: PhotoGalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openLightbox = (index: number) => {
        setCurrentIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (!images || images.length === 0) return null;

    return (
        <>
            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="relative aspect-[4/3] overflow-hidden rounded-xl cursor-pointer group bg-muted"
                        onClick={() => openLightbox(index)}
                    >
                        <Image
                            src={image}
                            alt={`${destinationName} - Photo ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <span className="text-white font-semibold text-sm">View</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                    onClick={closeLightbox}
                >
                    <button
                        className="absolute top-4 right-4 text-white hover:text-primary transition-colors z-10 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        onClick={closeLightbox}
                        aria-label="Close gallery"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <button
                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 text-white hover:text-primary transition-colors z-10 min-h-[44px] min-w-[44px] flex items-center justify-center bg-black/30 rounded-full p-2"
                        onClick={prevImage}
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="w-6 h-6 md:w-10 md:h-10" />
                    </button>

                    <button
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-white hover:text-primary transition-colors z-10 min-h-[44px] min-w-[44px] flex items-center justify-center bg-black/30 rounded-full p-2"
                        onClick={nextImage}
                        aria-label="Next image"
                    >
                        <ChevronRight className="w-6 h-6 md:w-10 md:h-10" />
                    </button>

                    <div
                        className="relative max-w-6xl max-h-[90vh] w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={images[currentIndex]}
                            alt={`${destinationName} - Photo ${currentIndex + 1}`}
                            width={1200}
                            height={800}
                            className="object-contain rounded-lg w-full h-auto"
                        />
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
                            {currentIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
