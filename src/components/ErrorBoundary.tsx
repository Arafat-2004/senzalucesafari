'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { logger } from '@/lib/reliability/logger';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of the crashed component.
 * 
 * Usage:
 * <ErrorBoundary fallback={<CustomFallback />}>
 *   <ComponentThatMayCrash />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console in development (with safety checks)
        if (process.env.NODE_ENV === 'development') {
            try {
                logger.error('ErrorBoundary caught an error', { error: error instanceof Error ? error.message : String(error) });
                if (errorInfo?.componentStack) {
                    logger.error('Component stack', { componentStack: errorInfo.componentStack });
                }
            } catch {
                // Silently ignore logging errors to prevent cascading failures
            }
        }

        // Call custom error handler if provided
        if (this.props.onError) {
            try {
                this.props.onError(error, errorInfo);
            } catch {
                // Silently ignore handler errors
            }
        }
    }

    public render() {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="min-h-[400px] flex items-center justify-center p-8">
                    <div className="max-w-md w-full text-center space-y-6">
          <div className="tone-danger mx-auto flex h-16 w-16 items-center justify-center rounded-full border">
            <AlertTriangle className="h-8 w-8" />
                        </div>

                        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
                                Something went wrong
                            </h2>
          <p className="text-muted-foreground">
                                We apologize for the inconvenience. Please try refreshing the page.
                            </p>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="rounded-lg border bg-muted/60 p-4 text-left">
              <summary className="cursor-pointer font-mono text-sm text-foreground">
                                    Error Details (Development Only)
                                </summary>
              <pre className="mt-2 overflow-auto font-mono text-xs text-destructive">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}

                        <div className="flex gap-3 justify-center">
                            <Button
                                onClick={() => window.location.reload()}
                                variant="default"
                                className="gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Refresh Page
                            </Button>
                            <Button
                                onClick={() => this.setState({ hasError: false, error: null })}
                                variant="outline"
                            >
                                Try Again
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
