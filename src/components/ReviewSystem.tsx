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
    <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-md transition-shadow hover:shadow-lg">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                        {review.author.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
            <h4 className="font-semibold text-foreground">
                                {review.author}
                            </h4>
                            {review.verified && (
              <span className="tone-success rounded-full border px-2 py-0.5 text-xs font-medium">
                                    Verified
                                </span>
                            )}
                        </div>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
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
                  ? 'fill-current text-brand-gold'
                  : 'fill-muted text-muted'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Safari Package */}
            <div className="mb-3">
          <span className="tone-success rounded border px-2 py-1 text-xs font-medium">
                    {review.safariPackage}
                </span>
            </div>

            {/* Review Content */}
            <div className="space-y-2">
      <h3 className="text-lg font-semibold text-foreground">
                    {review.title}
                </h3>
      <p className="leading-relaxed text-muted-foreground">
                    {isLongReview && !showFullContent
                        ? `${review.content.substring(0, 200)}...`
                        : review.content}
                </p>
                {isLongReview && (
                    <button
                        onClick={() => setShowFullContent(!showFullContent)}
            className="text-sm font-medium text-primary hover:underline"
                    >
                        {showFullContent ? 'Show less' : 'Read more'}
                    </button>
                )}
            </div>

            {/* Actions */}
      <div className="mt-4 flex items-center gap-4 border-t pt-4">
                <button
                    onClick={() => onHelpful?.(review.id)}
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Helpful ({review.helpful})</span>
                </button>
        <button className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
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
    <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Average Rating */}
                <div className="text-center">
        <div className="mb-2 text-5xl font-bold text-foreground">
                        {averageRating.toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-6 h-6 ${i < Math.round(averageRating)
                  ? 'fill-current text-brand-gold'
                  : 'fill-muted text-muted'
                                    }`}
                            />
                        ))}
                    </div>
        <p className="text-sm text-muted-foreground">
                        Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                    {ratingDistribution.map(({ rating, count, percentage }) => (
                        <div key={rating} className="flex items-center gap-3">
                            <div className="flex items-center gap-1 w-16">
              <span className="text-sm font-medium text-foreground">
                                    {rating}
                                </span>
              <Star className="h-4 w-4 fill-current text-brand-gold" />
                            </div>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full bg-primary rounded-full transition-all"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
              <span className="w-12 text-right text-sm text-muted-foreground">
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
          <label className="mb-2 block text-sm font-semibold text-foreground">
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
                  ? 'fill-current text-brand-gold'
                  : 'fill-muted text-muted'
                                    }`}
                            />
                        </button>
                    ))}
            <span className="ml-2 text-sm text-muted-foreground">
                        {rating > 0 ? `${rating} out of 5` : 'Click to rate'}
                    </span>
                </div>
            </div>

            {/* Author Name */}
            <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">
                    Your Name *
                </label>
                <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
            className="w-full rounded-lg border border-input bg-card px-4 py-2 text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
                    placeholder="John Doe"
                    required
                />
            </div>

            {/* Safari Package */}
            <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">
                    Safari Package
                </label>
                <select
                    value={safariPackage}
                    onChange={(e) => setSafariPackage(e.target.value)}
            className="w-full rounded-lg border border-input bg-card px-4 py-2 text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
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
          <label className="mb-2 block text-sm font-semibold text-foreground">
                    Review Title *
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-input bg-card px-4 py-2 text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
                    placeholder="Summarize your experience"
                    required
                />
            </div>

            {/* Review Content */}
            <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">
                    Your Review *
                </label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
            className="w-full resize-none rounded-lg border border-input bg-card px-4 py-2 text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
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
