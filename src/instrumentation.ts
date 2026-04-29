// Sentry instrumentation - DISABLED in development to avoid Turbopack conflicts
// Only enabled in production builds
import * as Sentry from '@sentry/nextjs';

export async function register() {
  // Skip Sentry initialization in development mode
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
  
  if (!SENTRY_DSN) {
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV,
    
    // Performance monitoring
    tracesSampleRate: 0.1,
    
    // Session replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Release tracking
    release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    
    // Filter events
    beforeSend(event, hint) {
      // Don't send events in development
      if (process.env.NODE_ENV !== 'production') {
        return null;
      }
      
      // Filter out specific errors if needed
      const error = hint.originalException;
      if (error instanceof Error) {
        // Ignore expected client-side errors
        if (error.message.includes('ResizeObserver')) {
          return null;
        }
      }
      
      return event;
    },
    
    // Ignore certain routes
    ignoreErrors: [
      'NetworkError',
      'Navigator.onLine',
      /loading chunk \d+ failed/i,
    ],
  });
}