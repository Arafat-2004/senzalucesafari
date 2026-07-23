import { revalidatePath, revalidateTag } from 'next/cache';
import { info, warn } from './logger';

export type CacheEntity = 'vehicles' | 'tours' | 'blog' | 'bookings' | 'inquiries' | 'reviews' | 'destinations' | 'settings' | 'guides' | 'faqs' | 'accommodations' | 'newsletters';

const REVALIDATION_ROUTES: Record<CacheEntity, string[]> = {
    vehicles: ['/vehicles', '/api/public/vehicles'],
    tours: ['/', '/safaris-tours', '/safaris-tours/[slug]', '/api/tours', '/api/tours/ids'],
    blog: ['/blog', '/blog/[slug]', '/api/blog', '/api/posts'],
    bookings: ['/api/bookings'],
    inquiries: ['/api/enquiries', '/api/enquiry'],
    reviews: ['/api/reviews', '/', '/safaris-tours', '/safaris-tours/[slug]'],
    destinations: ['/', '/destinations', '/destinations/[slug]', '/api/destinations'],
    settings: ['/api/settings', '/admin/settings'],
    guides: ['/about-us'],
    faqs: ['/faq'],
    accommodations: ['/accommodations', '/'],
    newsletters: ['/api/newsletter'],
};

const revalidationRecords: Array<{
    entity: CacheEntity;
    action: 'invalidate' | 'refresh';
    timestamp: number;
    path?: string;
}> = [];

export function invalidateCache(entity: CacheEntity, _path?: string): void {
    const routes = REVALIDATION_ROUTES[entity] || [];
    
    for (const route of routes) {
        try {
            revalidatePath(route);
            revalidationRecords.push({
                entity,
                action: 'invalidate',
                timestamp: Date.now(),
                path: route,
            });
            
            info(`Cache invalidated: ${entity}`, { path: route, entity });
        } catch (err) {
            warn(`Failed to invalidate cache: ${entity}`, { 
                path: route, 
                entity, 
                error: err instanceof Error ? err.message : String(err) 
            });
        }
    }
}

export function invalidateVehicles(): void {
    invalidateCache('vehicles');
}

export function invalidateTours(): void {
    invalidateCache('tours');
}

export function invalidateBlog(): void {
    revalidateTag('blogs', 'max');
    revalidateTag('blog-detail', 'max');
    invalidateCache('blog');
}

export function invalidateBookings(): void {
    invalidateCache('bookings');
}

export function invalidateInquiries(): void {
    invalidateCache('inquiries');
}

export function invalidateReviews(): void {
    invalidateCache('reviews');
}

export function invalidateDestinations(): void {
    invalidateCache('destinations');
}

export function invalidateSettings(): void {
    invalidateCache('settings');
}

export function refreshAllCaches(): void {
    const entities = Object.keys(REVALIDATION_ROUTES) as CacheEntity[];
    
    for (const entity of entities) {
        invalidateCache(entity);
    }
    
    info('All caches refreshed', { entityCount: entities.length });
}

export function getCacheStatus(): {
    entity: CacheEntity;
    routes: string[];
}[] {
    return Object.entries(REVALIDATION_ROUTES).map(([entity, routes]) => ({
        entity: entity as CacheEntity,
        routes,
    }));
}

export function getRecentInvalidations(limit = 20): typeof revalidationRecords {
    return revalidationRecords.slice(-limit);
}
