# Handoff Report: Requirements R2 & R5 Investigation

## 1. Observation

### R2 Observations
1. **`src/components/ui/tour-comparison.tsx` (lines 242–250)**:
   ```tsx
   export function useTourComparison() {
       const [compareTours, setCompareTours] = useState<TourPackage[]>(() => {
           if (typeof window === 'undefined') return [];
           try {
               const saved = localStorage.getItem('compareTours');
               return saved ? JSON.parse(saved) : [];
           } catch {
               return [];
           }
       });
   ```
2. **`src/app/safaris-tours/tours-content.tsx` (lines 128–134 & 453)**:
   ```tsx
   const { compareTours, addTour, removeTour, isAdded, clearAll } = useTourComparison();
   ...
   <TourCard
       key={tour.id}
       tour={tour}
       onBookClick={handleBookClick}
       onCompareToggle={handleCompareToggle}
       isComparing={isAdded(tour.id)}
   />
   ```
3. **`src/components/ui/tour-card.tsx` (lines 213 & 218)**:
   ```tsx
   {"$" + price.toLocaleString()}
   {"$" + perDayPrice.toLocaleString() + "/day"}
   ```

### R5 Observations
1. **`public/sw.js` (line 11)**:
   ```js
   const CACHE_NAME = 'senza-safaris-v5-no-html-cache';
   ```
2. **`public/sw.js` (line 30)**:
   ```js
   self.skipWaiting(); // Automatically activate new service worker
   ```
3. **`public/sw.js` (lines 98–130)**:
   ```js
   const isStaticAsset =
       url.pathname.startsWith('/_next/static/') ||
       url.pathname.startsWith('/images/') || ...
   ```
   Uses pure Cache-First (`caches.match()`) without background revalidation for unhashed static media files.
4. **`src/components/PWARegistration.tsx` (lines 92–95)**:
   Listens for `worker.state === 'installed' && navigator.serviceWorker.controller` to present update prompt, but `self.skipWaiting()` in `sw.js` bypasses the `installed` waiting state and instantly triggers `controllerchange` page reload.
5. **`next.config.ts` (lines 117–134)**:
   Contains `no-store` headers for `/sw.js` and `manifest.json`, but missing explicit `Cache-Control` headers for `/_next/static/(.*)` and `/api/(.*)`.

---

## 2. Logic Chain

### R2 Logic Chain
1. **Observation 1 & 2**: `useTourComparison` initializes `compareTours` from `localStorage` synchronously during `useState` initialization on the client side.
2. **Inference**: On the server (SSR), `typeof window === 'undefined'` is `true`, so `compareTours` initializes to `[]` and `isAdded(id)` is `false`. On the client, during the initial render pass, `localStorage` is read and `compareTours` initializes to any saved tours (`isAdded(id) = true`).
3. **Deduction**: The initial DOM produced on the client (`✓ Added` button state + floating `ComparisonBar`) differs from the DOM rendered on the server (`Compare` button state + empty DOM for `ComparisonBar`).
4. **Conclusion**: React throws a Hydration Mismatch error (`Hydration failed because the initial UI does not match what was rendered on the server`).
5. **Secondary Inference (Observation 3)**: Unspecified locale in `price.toLocaleString()` can produce `$1,500` on server and `$1.500` on German/French client browsers, causing string hydration mismatch.

### R5 Logic Chain
1. **Observation 1**: `public/sw.js` uses a static `CACHE_NAME` (`senza-safaris-v5-no-html-cache`).
2. **Inference**: When new code is deployed without modifying `sw.js`, the browser sees no byte changes in `sw.js` and does not run the service worker update cycle.
3. **Observation 3**: Static unhashed images (`/images/*`) use pure Cache-First strategy.
4. **Deduction**: Existing clients will serve stale images indefinitely even if image files are updated on the server.
5. **Observation 2 & 4**: `public/sw.js` auto-calls `self.skipWaiting()` while `PWARegistration.tsx` tries to manage controlled updates via UI prompt.
6. **Conclusion**: `self.skipWaiting()` causes instant activation and triggers `controllerchange` hard page reload without user consent during active site usage.
7. **Observation 5**: `next.config.ts` lacks explicit headers for static chunks (`/_next/static/`) and API routes (`/api/`).

---

## 3. Caveats
- **Local Storage Clearing**: If a user clears browser cookies/storage, `compareTours` will be empty and mismatch won't trigger until items are added to `localStorage`.
- **E2E Test SW Suppression**: `PWARegistration.tsx` explicitly skips SW registration when `navigator.webdriver` is true to avoid interfering with Playwright tests. Manual verification in real browsers is required.

---

## 4. Conclusion

1. **R2 Solution**:
   - Defer reading `localStorage` in `useTourComparison` to a post-mount `useEffect` and introduce a `hydrated` state (identical to `useFavourites`).
   - Add explicit `'en-US'` parameter to `toLocaleString('en-US')` calls in `tour-card.tsx`.

2. **R5 Solution**:
   - Update `public/sw.js` to use **Stale-While-Revalidate** for unhashed static media assets (`/images/`, `/fonts/`, `/icons/`).
   - Remove automatic `self.skipWaiting()` from `public/sw.js` `install` event to allow user-triggered updates via `PWARegistration.tsx`.
   - Add explicit `Cache-Control` headers for `/_next/static/(.*)` (`public, max-age=31536000, immutable`) and `/api/(.*)` (`no-store, max-age=0`) in `next.config.ts`.

---

## 5. Verification Method

### Step 1: Verify R2 Fix
1. Open browser developer console on `/safaris-tours`.
2. Execute: `localStorage.setItem('compareTours', JSON.stringify([{ id: 'tour-1', name: 'Test Tour', priceFrom: 1000, duration: '3 days', startEnd: 'Arusha', category: 'Safari', highlights: [], included: [], excluded: [], imageUrl: '' }]));`
3. Reload `/safaris-tours` page (hard reload).
4. Verify console contains **0 hydration warnings or errors**.
5. Verify the tour card transitions smoothly to "✓ Added" state after initial load.

### Step 2: Verify R5 SW & Caching Fix
1. Inspect response headers for `/sw.js`: `Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate`.
2. Inspect response headers for `/_next/static/...`: `Cache-Control: public, max-age=31536000, immutable`.
3. Verify updated service worker script activates gracefully without unexpected forced reloads.
