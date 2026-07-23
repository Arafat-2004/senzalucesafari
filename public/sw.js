/**
 * Custom Service Worker for Offline Support
 * 
 * This worker handles:
 * - Caching static assets (JS, CSS, images)
 * - Offline fallback for pages
 * - Background sync for form submissions
 * - Push notifications (future)
 */

const CACHE_NAME = 'senza-safaris-v5-no-html-cache';
const OFFLINE_PAGE = '/offline';
const STATIC_ASSETS = [
    '/',
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
    self.skipWaiting(); // Automatically activate new service worker
});

// Activate event - clean up old caches and claim clients immediately
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName))
            );
        }).then(() => {
            return self.clients.claim(); // Take control of all pages immediately
        })
    );
});

async function deleteAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
}

// Fetch event - strategic caching based on resource type
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    const url = new URL(event.request.url);

    // 1. Skip caching entirely for all API / Admin routes
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin/')) {
        return;
    }

    // 2. Network-only strategy for pages / documents (HTML)
    // Never serve cached HTML as the normal fallback. It can make users see
    // an old website after a redesign or deployment. If navigation fails,
    // show only the explicit offline page.
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    return caches.match(OFFLINE_PAGE);
                })
        );
        return;
    }

    // 3. Cache-First for specific static assets (JS, CSS, Images, Fonts)
    const isStaticAsset =
        url.pathname.startsWith('/_next/static/') ||
        url.pathname.startsWith('/images/') ||
        url.pathname.startsWith('/fonts/') ||
        url.pathname.startsWith('/icons/') ||
        url.pathname.endsWith('.png') ||
        url.pathname.endsWith('.jpg') ||
        url.pathname.endsWith('.jpeg') ||
        url.pathname.endsWith('.svg') ||
        url.pathname.endsWith('.ico') ||
        url.pathname.endsWith('.woff2');

    if (isStaticAsset) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request).then((response) => {
                    if (response.status === 200) {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return response;
                }).catch(() => {
                    // Fail silently for static assets
                    return new Response('', { status: 404 });
                });
            })
        );
        return;
    }

    // 4. Default: Network first, fallback to cache
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                if (response.status === 200 && response.type === 'basic') {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {
                return caches.match(event.request);
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
    console.log('Service Worker: Syncing enquiry form data');
}

self.addEventListener('push', (event) => {
    let payload = {};
    try {
        payload = event.data ? event.data.json() : {};
    } catch {
        payload = { body: event.data ? event.data.text() : undefined };
    }
    const options = {
        body: payload.body || 'New update from Senza Luce Safaris!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [200, 100, 200],
        tag: payload.tag || 'senza-admin-alert',
        renotify: true,
        data: {
            url: payload.url || '/admin/notifications',
        },
        actions: [
            { action: 'view', title: 'Open dashboard' },
            { action: 'close', title: 'Close' },
        ],
    };

    event.waitUntil(
        self.registration.showNotification(payload.title || 'Senza Luce Safaris', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'close') return;
    const url = new URL(event.notification.data?.url || '/admin/notifications', self.location.origin).href;
    event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
        for (const client of clients) {
            if ('focus' in client && client.url.startsWith(self.location.origin)) {
                if ('navigate' in client) client.navigate(url);
                return client.focus();
            }
        }
        return self.clients.openWindow(url);
    }));
});

// Message handler for communication with main app
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    if (event.data && event.data.type === 'CLEAR_CACHES') {
        event.waitUntil(deleteAllCaches());
    }
});
