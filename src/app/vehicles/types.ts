// Vehicle Types and Interfaces
import type React from "react";

export interface VehicleSpecifications {
    engine: string;
    power?: string;
    torque?: string;
    transmission: string;
    drive: string;
    suspension: string;
    tires: string;
    fuelCapacity?: string;
    groundClearance?: string;
    length?: string;
    width?: string;
}

export interface Vehicle {
    id: number;
    name: string;
    category: string;
    imageUrl: string;
    capacity: string;
    rating: number;
    reviews: number;
    priceRange: string;
    bestFor: string[];
    features: string[];
    specifications: VehicleSpecifications;
    safetyFeatures: string[];
    safariEquipment: string[];
    interiorImages: string[];
    exteriorImages: string[];
    actionShots: string[];
}

export interface SafariMoment {
    id: number;
    photo: string;
    caption: string;
    guest: string;
    location: string;
    vehicle: string;
    date: string;
    rating: number;
}

export interface PhotographyTip {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
}

export interface Testimonial {
    id: number;
    text: string;
    guest: string;
    location: string;
    rating: number;
    vehicle: string;
}

export interface InstagramPost {
    id: number;
    imageUrl: string;
    caption: string;
    likes: number;
    comments: number;
    timestamp: string;
    hashtag: string;
}
