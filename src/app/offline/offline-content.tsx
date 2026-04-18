'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WifiOff, Home, RefreshCw } from 'lucide-react';

export default function OfflineContent() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-orange-50 dark:from-green-950/20 dark:to-orange-950/20 p-4">
            <div className="max-w-md w-full text-center space-y-8">
                {/* Icon */}
                <div className="mx-auto w-24 h-24 rounded-full bg-white dark:bg-gray-800 shadow-xl flex items-center justify-center">
                    <WifiOff className="w-12 h-12 text-gray-400" />
                </div>

                {/* Message */}
                <div className="space-y-3">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        You&apos;re Offline
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        It looks like you&apos;ve lost your internet connection. Don&apos;t worry, some safari content is still available!
                    </p>
                </div>

                {/* Suggestions */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg space-y-4">
                    <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-left">
                        What you can do:
                    </h2>
                    <ul className="text-left space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                            <span>View previously visited pages (if cached)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                            <span>Check your internet connection</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                            <span>Try refreshing the page when back online</span>
                        </li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={() => window.location.reload()}
                        size="lg"
                        className="gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </Button>
                    <Link href="/">
                        <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                            <Home className="w-4 h-4" />
                            Go Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
