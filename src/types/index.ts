/**
 * Global TypeScript type definitions
 * 
 * Shared types used across multiple features and components.
 * Feature-specific types should live in their respective feature directories.
 */

// ===========================================
// GLOBAL TYPE DEFINITIONS
// ===========================================

// Tour types
export type { TourPackage, Tour, DayItinerary } from './tours';

// Destination types
export type {
    Destination,
    Wildlife,
    Activity,
    DestinationAccommodation,
    Itinerary,
    TravelTip,
    DestinationFAQ,
} from './destinations';

// Accommodation types
export type { AccommodationOption } from './accommodations';

// Blog types
export type { BlogArticle, BlogSection, RelatedPost } from './blogs';

// Review types
export type { Review } from './reviews';

// ============================================
// Navigation & Routing
// ============================================

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// ============================================
// SEO & Metadata
// ============================================

export interface PageSEO {
  title: string;
  description: string;
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// Form Types
// ============================================

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// ============================================
// Common UI Types
// ============================================

export interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export interface CardItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  href?: string;
}

// ============================================
// Utility Types
// ============================================

/** Make specific properties of T required */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/** Make all properties of T optional except for K */
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

/** Extract the element type from an array type */
export type ArrayElement<T extends readonly unknown[]> = T extends readonly (infer U)[] ? U : never;
