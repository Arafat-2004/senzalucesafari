import { Component, ReactNode } from 'react';
import { logger } from '@/lib/reliability/logger';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  eventId: string | null;
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

export default class ErrorBoundary extends Component<Props, ErrorBoundaryState> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, eventId: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, eventId: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    logger.error('[ErrorBoundary]', { error: error instanceof Error ? error.message : String(error), componentStack: errorInfo?.componentStack });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            padding: '2rem',
            maxWidth: '600px',
            margin: '2rem auto',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <h1 className="mb-4 text-destructive">
            Something went wrong
          </h1>
          <p className="mb-4 text-muted-foreground">
            We encountered an unexpected error. Our team has been notified.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details
              className="mb-4 rounded bg-muted p-4 text-muted-foreground"
            >
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Error details
              </summary>
              <pre style={{ overflow: 'auto', marginTop: '0.5rem' }}>
                {this.state.error.message}
                {'\n'}
                {this.state.error.stack}
              </pre>
            </details>
          )}
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null, eventId: null });
              window.location.reload();
            }}
            className="cursor-pointer rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary-dark"
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
