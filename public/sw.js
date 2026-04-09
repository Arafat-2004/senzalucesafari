/**
 * Custom Service Worker for Offline Support
 * 
 * This worker handles:
 * - Caching static assets (JS, CSS, images)
 * - Offline fallback for pages
 * - Background sync for form submissions
 * - Push notifications (future)
 */

const CACHE_NAME = 'senza-safaris-v1';
const OFFLINE_PAGE = '/offline';
const STATIC_ASSETS = [
    '/',
    '/en',
    '/offline',
    '/manifest.json',
    '/favicon.ico',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Service Worker: Caching static assets');
            return cache.addAll(STATIC_ASSETS).catch((error) => {
                console.error('Service Worker: Failed to cache assets', error);
            });
        })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName))
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then((response) => {
                // Don't cache error responses
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Clone the response
                const responseToCache = response.clone();

                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            }).catch(() => {
                // If both cache and network fail, show offline page
                if (event.request.destination === 'document') {
                    return caches.match(OFFLINE_PAGE);
                }
                return null;
            });
        })
    );
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-enquiry-form') {
        event.waitUntil(syncEnquiryForm());
    }
});

async function syncEnquiryForm() {
    // TODO: Implement background sync for enquiry form
    console.log('Service Worker: Syncing enquiry form data');
}

// Push notification handler (future implementation)
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'New update from Senza Luce Safaris!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
        },
        actions: [
            { action: 'view', title: 'View Safari Packages' },
            { action: 'close', title: 'Close' },
        ],
    };

    event.waitUntil(
        self.registration.showNotification('Senza Luce Safaris', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'view') {
        event.waitUntil(
            self.clients.openWindow('/en/safaris-tours')
        );
    }
});

// Message handler for communication with main app
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
