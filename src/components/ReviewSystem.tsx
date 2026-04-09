'use client';

import { useState } from 'react';
import { Star, User, Calendar, ThumbsUp, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Review {
    id: string;
    author: string;
    rating: number;
    title: string;
    content: string;
    date: string;
    safariPackage: string;
    helpful: number;
    verified: boolean;
    images?: string[];
}

interface ReviewCardProps {
    review: Review;
    onHelpful?: (reviewId: string) => void;
}

/**
 * Review Card Component
 * Displays an individual customer review with rating, content, and interaction options.
 */
export function ReviewCard({ review, onHelpful }: ReviewCardProps) {
    const [showFullContent, setShowFullContent] = useState(false);
    const isLongReview = review.content.length > 200;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                        {review.author.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                {review.author}
                            </h4>
                            {review.verified && (
                                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                                    Verified
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-5 h-5 ${i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-gray-200 dark:fill-gray-600 text-gray-200 dark:text-gray-600'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Safari Package */}
            <div className="mb-3">
                <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                    {review.safariPackage}
                </span>
            </div>

            {/* Review Content */}
            <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                    {review.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {isLongReview && !showFullContent
                        ? `${review.content.substring(0, 200)}...`
                        : review.content}
                </p>
                {isLongReview && (
                    <button
                        onClick={() => setShowFullContent(!showFullContent)}
                        className="text-sm text-green-600 dark:text-green-400 hover:underline font-medium"
                    >
                        {showFullContent ? 'Show less' : 'Read more'}
                    </button>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => onHelpful?.(review.id)}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Helpful ({review.helpful})</span>
                </button>
                <button className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span>Reply</span>
                </button>
            </div>
        </div>
    );
}

interface ReviewSummaryProps {
    reviews: Review[];
}

/**
 * Review Summary Component
 * Displays average rating and rating distribution.
 */
export function ReviewSummary({ reviews }: ReviewSummaryProps) {
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
        rating,
        count: reviews.filter(r => r.rating === rating).length,
        percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100,
    }));

    return (
        <div className="bg-gradient-to-br from-green-50 to-orange-50 dark:from-green-900/10 dark:to-orange-900/10 rounded-xl p-6 border border-green-200 dark:border-green-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Average Rating */}
                <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {averageRating.toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-6 h-6 ${i < Math.round(averageRating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'fill-gray-300 dark:fill-gray-600 text-gray-300 dark:text-gray-600'
                                    }`}
                            />
                        ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                    {ratingDistribution.map(({ rating, count, percentage }) => (
                        <div key={rating} className="flex items-center gap-3">
                            <div className="flex items-center gap-1 w-16">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {rating}
                                </span>
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            </div>
                            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-500 to-orange-500 rounded-full transition-all"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                                {count}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

interface ReviewFormProps {
    onSubmit: (review: Omit<Review, 'id' | 'date' | 'helpful'>) => void;
}

/**
 * Review Form Component
 * Allows customers to submit new reviews.
 */
export function ReviewForm({ onSubmit }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [safariPackage, setSafariPackage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0 || !title || !content || !author) {
            alert('Please fill in all required fields');
            return;
        }

        onSubmit({
            author,
            rating,
            title,
            content,
            safariPackage: safariPackage || 'General Safari',
            verified: true,
        });

        // Reset form
        setRating(0);
        setTitle('');
        setContent('');
        setAuthor('');
        setSafariPackage('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Your Rating *
                </label>
                <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="transition-transform hover:scale-110"
                        >
                            <Star
                                className={`w-8 h-8 ${star <= (hoveredRating || rating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'fill-gray-200 dark:fill-gray-600 text-gray-200 dark:text-gray-600'
                                    }`}
                            />
                        </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {rating > 0 ? `${rating} out of 5` : 'Click to rate'}
                    </span>
                </div>
            </div>

            {/* Author Name */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Your Name *
                </label>
                <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="John Doe"
                    required
                />
            </div>

            {/* Safari Package */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Safari Package
                </label>
                <select
                    value={safariPackage}
                    onChange={(e) => setSafariPackage(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value="">Select a package (optional)</option>
                    <option value="3 Days Serengeti Explorer">3 Days Serengeti Explorer</option>
                    <option value="5 Days Tanzania Wildlife Safari">5 Days Tanzania Wildlife Safari</option>
                    <option value="7 Days Great Migration">7 Days Great Migration</option>
                    <option value="9 Days Safari + Zanzibar Beach">9 Days Safari + Zanzibar Beach</option>
                    <option value="Mount Kilimanjaro Trekking">Mount Kilimanjaro Trekking</option>
                </select>
            </div>

            {/* Review Title */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Review Title *
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Summarize your experience"
                    required
                />
            </div>

            {/* Review Content */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Your Review *
                </label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    placeholder="Share your safari experience..."
                    required
                />
            </div>

            {/* Submit */}
            <Button type="submit" size="lg" className="w-full">
                <User className="w-4 h-4 mr-2" />
                Submit Review
            </Button>
        </form>
    );
}

export default ReviewCard;
