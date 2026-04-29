'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';

interface NewsletterFormProps {
    variant?: 'footer' | 'inline' | 'popup';
    onSuccess?: () => void;
}

/**
 * Newsletter Subscription Form
 * 
 * Integrates with Mailchimp, ConvertKit, or any email service via API.
 * Currently uses a mock implementation - replace with your actual API endpoint.
 * 
 * Usage:
 * <NewsletterForm variant="footer" />
 * <NewsletterForm variant="inline" />
 * <NewsletterForm variant="popup" />
 */
export function NewsletterForm({ variant = 'inline', onSuccess }: NewsletterFormProps) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            setStatus('error');
            setErrorMessage('Please enter a valid email address');
            return;
        }

        setStatus('loading');

        try {
            // Call newsletter subscription API
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to subscribe');
            }

            // Success
            setStatus('success');
            setEmail('');

            if (onSuccess) {
                onSuccess();
            }

            // Reset status after 5 seconds
            setTimeout(() => {
                setStatus('idle');
            }, 5000);
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            setStatus('error');
            setErrorMessage('Failed to subscribe. Please try again.');
        }
    };

    if (variant === 'popup') {
        return <></>; // Handled by parent component
    }

    if (status === 'success') {
        return (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">
                    Thank you for subscribing!
                </span>
            </div>
        );
    }

    if (variant === 'footer') {
        return (
            <form onSubmit={handleSubmit} className="w-full">
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            disabled={status === 'loading'}
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={status === 'loading'}
                        size="sm"
                        className="min-w-[120px]"
                    >
                        {status === 'loading' ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Subscribing...
                            </>
                        ) : (
                            'Subscribe'
                        )}
                    </Button>
                </div>
                {status === 'error' && (
                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errorMessage}</p>
                )}
            </form>
        );
    }

    // Inline variant (default)
    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email for safari updates"
                        className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={status === 'loading'}
                    />
                </div>
                <Button
                    type="submit"
                    disabled={status === 'loading'}
                    size="lg"
                    className="min-w-[160px]"
                >
                    {status === 'loading' ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Subscribing...
                        </>
                    ) : (
                        <>
                            <Mail className="w-4 h-4" />
                            Subscribe
                        </>
                    )}
                </Button>
            </div>
            {status === 'error' && (
                <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
                Join 2,000+ safari enthusiasts. No spam, unsubscribe anytime.
            </p>
        </form>
    );
}

export default NewsletterForm;
