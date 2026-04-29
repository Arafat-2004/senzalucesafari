'use client';

import { ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SafeRenderProps {
  children: ReactNode;
  fallback?: ReactNode;
  loading?: ReactNode;
  isLoading?: boolean;
  error?: Error | null;
  errorFallback?: ReactNode;
}

export function SafeRender({
  children,
  fallback = null,
  loading,
  isLoading = false,
  error = null,
  errorFallback
}: SafeRenderProps) {
  if (isLoading) {
    return loading ?? (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    if (errorFallback) {
      return errorFallback;
    }
    
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3 text-center max-w-md">
          <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="font-medium text-foreground">Something went wrong</p>
            <p className="text-sm text-muted-foreground mt-1">
              {error.message || 'An unexpected error occurred'}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (children === null || children === undefined) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface DataRendererProps<T> {
  data: T | null | undefined;
  isLoading?: boolean;
  error?: Error | null;
  render: (data: T) => ReactNode;
  fallback?: ReactNode;
}

export function DataRenderer<T>({
  data,
  isLoading = false,
  error = null,
  render,
  fallback = null
}: DataRendererProps<T>) {
  return (
    <SafeRender isLoading={isLoading} error={error} fallback={fallback}>
      {data !== null && data !== undefined ? render(data) : fallback}
    </SafeRender>
  );
}