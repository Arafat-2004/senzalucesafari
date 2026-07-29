import { test, expect } from '@playwright/test';

const publicRoutes = [
  '/',
  '/about',
  '/safaris-tours',
  '/destinations',
  '/accommodations',
  '/vehicles',
  '/blog',
  '/faq',
  '/contact',
  '/enquiry',
  '/support',
  '/terms',
  '/privacy',
];

const viewports = [
  { width: 320, height: 568, name: 'Mobile_Small' },      // iPhone SE
  { width: 390, height: 844, name: 'Mobile_Standard' },   // iPhone 13/14
  { width: 768, height: 1024, name: 'Tablet_Portrait' },   // iPad Mini/Air
  { width: 1024, height: 768, name: 'Tablet_Landscape' }, // iPad Landscape
  { width: 1440, height: 900, name: 'Laptop_Standard' },  // Macbook 14"
  { width: 1920, height: 1080, name: 'Desktop_FHD' },     // Desktop 1080p
];

test.describe('Responsive Design and Overflow Audit', () => {
  for (const viewport of viewports) {
    test.describe(`Viewport: ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } });

      for (const route of publicRoutes) {
        test(`Audit route: ${route}`, async ({ page }) => {
          await page.goto(route);
          await page.waitForLoadState('load');
          await page.locator('header').first().waitFor({ state: 'visible', timeout: 15000 });
          await page.locator('footer').first().waitFor({ state: 'visible', timeout: 15000 });
          // Settle hydration / active transitions with a soft networkidle wait
          await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
          // Small delay to ensure execution context is stable and won't be destroyed by Next.js router transition
          await page.waitForTimeout(500);

          // Check for horizontal overflow
          const overflowMetrics = await page.evaluate(() => {
            const scrollWidth = document.documentElement.scrollWidth;
            const clientWidth = document.documentElement.clientWidth;
            const hasOverflow = scrollWidth > clientWidth;
            
            let overflowingElements: any[] = [];
            if (hasOverflow) {
              const elements = document.querySelectorAll('*');
              const width = window.innerWidth;
              elements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.right > width || rect.left < 0) {
                  overflowingElements.push({
                    tagName: el.tagName,
                    id: el.id,
                    className: el.className,
                    rect: { left: rect.left, right: rect.right, width: rect.width }
                  });
                }
              });
            }
            return { scrollWidth, clientWidth, hasOverflow, overflowingElements };
          });

          if (overflowMetrics.hasOverflow) {
            console.warn(
              `[Overflow Warning] Route "${route}" has horizontal overflow on ${viewport.name}. ` +
              `scrollWidth: ${overflowMetrics.scrollWidth}, clientWidth: ${overflowMetrics.clientWidth}. ` +
              `Overflowing elements:`,
              JSON.stringify(overflowMetrics.overflowingElements.slice(0, 5), null, 2)
            );
          }

          // We expect no critical overflow where scrollWidth exceeds clientWidth by more than 1px (due to rounding)
          expect(overflowMetrics.scrollWidth - overflowMetrics.clientWidth).toBeLessThanOrEqual(1);
        });
      }
    });
  }
});
