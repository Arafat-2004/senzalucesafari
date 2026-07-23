'use client';

import { useState, useEffect, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { logger } from '@/lib/reliability/logger';

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
            logger.error(`${name} error`, { error: event.error instanceof Error ? event.error.message : String(event.error) });
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
        <div className="tone-warning my-4 rounded-lg border-2 border-dashed p-6">
                <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                    <div className="flex-1">
              <h4 className="font-semibold">
                            {name} encountered an issue
                        </h4>
              <p className="mt-1 text-sm">
                            This section couldn&apos;t load properly. Please try refreshing the page.
                        </p>
                        {process.env.NODE_ENV === 'development' && error && (
                            <details className="mt-3">
                  <summary className="cursor-pointer font-mono text-xs">
                                    View Error Details
                                </summary>
                  <pre className="mt-2 overflow-auto rounded bg-background/50 p-3 font-mono text-xs">
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
