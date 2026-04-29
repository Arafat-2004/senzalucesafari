'use client';

import { useEffect, useState } from 'react';

/**
 * PWA Registration Component
 * 
 * Registers the service worker and handles PWA updates.
 * Should be added to the root layout.
 */
export function PWARegistration() {
    const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
    const [showReload, setShowReload] = useState(false);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker
                    .register('/sw.js')
                    .then((registration) => {
                        console.log('Service Worker registered with scope:', registration.scope);

                        // Check for updates
                        registration.addEventListener('updatefound', () => {
                            const newWorker = registration.installing;
                            if (!newWorker) return;

                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // New service worker available, prompt user to reload
                                    setWaitingWorker(newWorker);
                                    setShowReload(true);
                                }
                            });
                        });
                    })
                    .catch((error) => {
                        console.error('Service Worker registration failed:', error);
                    });
            });
        }
    }, []);

    const handleReload = () => {
        if (waitingWorker) {
            waitingWorker.postMessage({ type: 'SKIP_WAITING' });
        }
        window.location.reload();
    };

    if (!showReload) {
        return <></>;
    }

    return (
        <div className="fixed bottom-24 lg:bottom-8 left-4 right-4 z-50 max-w-md mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 border-2 border-green-500 dark:border-green-600">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            Update Available
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                            A new version of Senza Safaris is ready
                        </p>
                    </div>
                    <button
                        onClick={handleReload}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PWARegistration;
