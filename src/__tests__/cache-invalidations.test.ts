// Mock next/cache before importing cache-manager
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}));

import { getCacheStatus } from '@/lib/reliability/cache-manager';

describe('Cache Invalidation Routes', () => {
  it('should invalidate homepage when tours change', () => {
    const status = getCacheStatus();
    const toursConfig = status.find(s => s.entity === 'tours');
    expect(toursConfig?.routes).toContain('/');
    expect(toursConfig?.routes).toContain('/safaris-tours/[slug]');
  });

  it('should invalidate homepage when destinations change', () => {
    const status = getCacheStatus();
    const destConfig = status.find(s => s.entity === 'destinations');
    expect(destConfig?.routes).toContain('/');
    expect(destConfig?.routes).toContain('/destinations/[slug]');
  });

  it('should invalidate tour detail pages when tours change', () => {
    const status = getCacheStatus();
    const toursConfig = status.find(s => s.entity === 'tours');
    expect(toursConfig?.routes).toContain('/safaris-tours');
    expect(toursConfig?.routes).toContain('/safaris-tours/[slug]');
  });

  it('should invalidate destination detail pages when destinations change', () => {
    const status = getCacheStatus();
    const destConfig = status.find(s => s.entity === 'destinations');
    expect(destConfig?.routes).toContain('/destinations');
    expect(destConfig?.routes).toContain('/destinations/[slug]');
  });

  it('should invalidate homepage and tour pages when reviews change', () => {
    const status = getCacheStatus();
    const reviewsConfig = status.find(s => s.entity === 'reviews');
    expect(reviewsConfig?.routes).toContain('/');
    expect(reviewsConfig?.routes).toContain('/safaris-tours');
    expect(reviewsConfig?.routes).toContain('/safaris-tours/[slug]');
  });

  it('should invalidate blog detail pages when blog posts change', () => {
    const status = getCacheStatus();
    const blogConfig = status.find(s => s.entity === 'blog');
    expect(blogConfig?.routes).toContain('/blog');
    expect(blogConfig?.routes).toContain('/blog/[slug]');
  });

  it('should invalidate homepage when accommodations change', () => {
    const status = getCacheStatus();
    const accConfig = status.find(s => s.entity === 'accommodations');
    expect(accConfig?.routes).toContain('/');
    expect(accConfig?.routes).toContain('/accommodations');
  });
});
