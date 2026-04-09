'use client';

import { useState, useEffect, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    name?: string;
}

/**
 * Section Error Boundary
 * 
 * A lighter-weight error boundary for wrapping individual sections.
 * Shows inline error message without breaking the entire page.
 * 
 * Usage:
 * <SectionErrorBoundary name="Booking Form">
 *   <BookingForm />
 * </SectionErrorBoundary>
 */
export function SectionErrorBoundary({ children, fallback, name = 'Section' }: Props) {
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const errorHandler = (event: ErrorEvent) => {
            console.error(`${name} error:`, event.error);
            setHasError(true);
            setError(event.error);
        };

        window.addEventListener('error', errorHandler);
        return () => window.removeEventListener('error', errorHandler);
    }, [name]);

    if (hasError) {
        if (fallback) {
            return fallback;
        }

        return (
            <div className="p-6 my-4 rounded-lg border-2 border-dashed border-yellow-300 dark:border-yellow-700 bg-yellow-50/50 dark:bg-yellow-900/10">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                        <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">
                            {name} encountered an issue
                        </h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                            This section couldn't load properly. Please try refreshing the page.
                        </p>
                        {process.env.NODE_ENV === 'development' && error && (
                            <details className="mt-3">
                                <summary className="text-xs cursor-pointer font-mono text-yellow-800 dark:text-yellow-200">
                                    View Error Details
                                </summary>
                                <pre className="mt-2 text-xs font-mono bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded overflow-auto">
                                    {error.message}
                                </pre>
                            </details>
                        )}
                        <Button
                            onClick={() => window.location.reload()}
                            variant="outline"
                            size="sm"
                            className="mt-3 gap-2"
                        >
                            <RotateCcw className="w-3 h-3" />
                            Refresh Page
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

export default SectionErrorBoundary;
