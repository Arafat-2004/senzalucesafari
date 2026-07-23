'use client'

import Link from 'next/link'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html lang="en">
            <body className="antialiased">
                <div className="min-h-screen flex items-center justify-center px-4 bg-background">
                    <div className="text-center max-w-lg">
                        <h1 className="mb-4 text-6xl font-bold text-destructive/40">Error</h1>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">
                            Something went wrong
                        </h2>
                        <p className="text-muted-foreground mb-8">
                            We apologize for the inconvenience. An unexpected error occurred.
                            {error.digest && (
                                <span className="block text-xs mt-2 text-muted-foreground/60">
                                    Error ID: {error.digest}
                                </span>
                            )}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={reset}
                                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
                            >
                                Try Again
                            </button>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    )
}
