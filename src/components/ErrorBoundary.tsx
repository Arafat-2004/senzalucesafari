'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

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
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('ErrorBoundary caught an error:', error);
            console.error('Component stack:', errorInfo.componentStack);
        }

        // Call custom error handler if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // TODO: Send to error tracking service (Sentry, etc.)
        // if (typeof window !== 'undefined' && (window as any).Sentry) {
        //     (window as any).Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
        // }
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
                        <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                Something went wrong
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                We apologize for the inconvenience. Please try refreshing the page.
                            </p>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="text-left bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                <summary className="cursor-pointer font-mono text-sm text-gray-700 dark:text-gray-300">
                                    Error Details (Development Only)
                                </summary>
                                <pre className="mt-2 text-xs font-mono text-red-600 dark:text-red-400 overflow-auto">
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
