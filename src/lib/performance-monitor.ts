/**
 * Performance Monitoring Utility
 * Helps identify and track performance bottlenecks
 */

export function measureTTFB(): number {
    if (typeof window === 'undefined') return 0;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return 0;

    return navigation.responseStart - navigation.requestStart;
}

export function measureLCP(): Promise<number> {
    return new Promise((resolve) => {
        if (typeof window === 'undefined') {
            resolve(0);
            return;
        }

        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            if (entries.length > 0) {
                const lcp = entries[entries.length - 1] as PerformanceEntry;
                resolve(lcp.startTime);
            }
        });

        observer.observe({ type: 'largest-contentful-paint', buffered: true });

        // Timeout after 10 seconds
        setTimeout(() => {
            observer.disconnect();
            resolve(0);
        }, 10000);
    });
}

export function measureCLS(): Promise<number> {
    return new Promise((resolve) => {
        if (typeof window === 'undefined') {
            resolve(0);
            return;
        }

        let clsValue = 0;

        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!(entry as PerformanceEntry & { hadRecentInput?: boolean }).hadRecentInput) {
                    clsValue += (entry as PerformanceEntry & { value?: number }).value ?? 0;
                }
            }
        });

        observer.observe({ type: 'layout-shift', buffered: true });

        // Report after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                observer.disconnect();
                resolve(clsValue);
            }, 5000);
        });
    });
}

export function logPerformanceMetrics(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', async () => {
        const ttfb = measureTTFB();
        const lcp = await measureLCP();
        const cls = await measureCLS();

        console.group('📊 Performance Metrics');
        console.log(`TTFB: ${ttfb.toFixed(0)}ms ${ttfb < 800 ? '✅' : ttfb < 1800 ? '⚠️' : '❌'}`);
        console.log(`LCP: ${lcp.toFixed(0)}ms ${lcp < 2500 ? '✅' : lcp < 4000 ? '⚠️' : '❌'}`);
        console.log(`CLS: ${cls.toFixed(3)} ${cls < 0.1 ? '✅' : cls < 0.25 ? '⚠️' : '❌'}`);
        console.groupEnd();

        // Send to analytics if needed
        if (typeof (window as unknown as Record<string, unknown>).gtag === 'function') {
            ((window as unknown as Record<string, (...args: unknown[]) => void>).gtag)('event', 'performance_metrics', {
                ttfb: Math.round(ttfb),
                lcp: Math.round(lcp),
                cls: cls.toFixed(3),
            });
        }
    });
}

export function observeLongTasks(callback: (duration: number) => void): void {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
                callback(entry.duration);
            }
        }
    });

    observer.observe({ type: 'longtask', buffered: true });
}
