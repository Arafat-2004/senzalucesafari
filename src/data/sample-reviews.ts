import type { Review } from '@/components/ReviewSystem';

/**
 * Sample customer reviews for demonstration
 * In production, these would come from a database
 */
export const sampleReviews: Review[] = [
    {
        id: '1',
        author: 'Sarah Johnson',
        rating: 5,
        title: 'Absolutely Life-Changing Experience!',
        content: 'Our 5-day Tanzania Wildlife Safari exceeded all expectations. The guides were incredibly knowledgeable, pointing out animals we would have never spotted on our own. Witnessing the Great Migration in the Serengeti was a dream come true. The lodges were comfortable and the food was surprisingly excellent. Every detail was perfectly organized. This was truly the trip of a lifetime!',
        date: '2024-03-15',
        safariPackage: '5 Days Tanzania Wildlife Safari',
        helpful: 47,
        verified: true,
    },
    {
        id: '2',
        author: 'Michael Chen',
        rating: 5,
        title: 'Best Family Vacation Ever',
        content: 'We traveled with our two teenagers and everyone had an amazing time. The itinerary was well-paced, not too rushed. Our kids are still talking about the elephants at Tarangire and the hippos at Lake Manyara. The team at Senza Luce was incredibly accommodating with our dietary restrictions. Highly recommend for families!',
        date: '2024-02-28',
        safariPackage: '7 Days Great Migration',
        helpful: 32,
        verified: true,
    },
    {
        id: '3',
        author: 'Emma & David Williams',
        rating: 5,
        title: 'Perfect Honeymoon Safari + Beach Combo',
        content: 'The 9-day Safari + Zanzibar package was the perfect honeymoon. The safari portion was thrilling (we saw the Big 5!), and then relaxing on Zanzibar beaches was exactly what we needed. The sunset dhow cruise in Zanzibar was incredibly romantic. Thank you Senza Luce for making our honeymoon unforgettable!',
        date: '2024-02-10',
        safariPackage: '9 Days Safari + Zanzibar Beach',
        helpful: 56,
        verified: true,
    },
    {
        id: '4',
        author: 'Robert Martinez',
        rating: 4,
        title: 'Kilimanjaro Challenge - Worth Every Step',
        content: 'Climbing Kilimanjaro was the hardest physical challenge of my life, but the support from the guides and porters made it possible. The scenery changes from rainforest to alpine desert to arctic summit were mind-blowing. Reaching Uhuru Peak at sunrise was an emotional moment I\'ll never forget. Only giving 4 stars because the toilets at some camps could be better, but that\'s expected on a mountain!',
        date: '2024-01-22',
        safariPackage: 'Mount Kilimanjaro Trekking',
        helpful: 28,
        verified: true,
    },
    {
        id: '5',
        author: 'Lisa Thompson',
        rating: 5,
        title: 'Incredible Value for Money',
        content: 'As a solo traveler on a budget, I was worried about the cost. Senza Luce offered the best value I found after researching dozens of companies. The small group size (only 6 of us) meant personalized attention. Our guide Joseph knew every bird call and animal behavior. The photography tips he gave me resulted in award-winning shots! Already planning my return trip.',
        date: '2024-01-05',
        safariPackage: '3 Days Serengeti Explorer',
        helpful: 41,
        verified: true,
    },
    {
        id: '6',
        author: 'James & Patricia O\'Brien',
        rating: 5,
        title: 'Third Time with Senza - Still Amazing',
        content: 'This was our third safari with Senza Luce Safaris, and they continue to impress. Each trip has been unique and special. This time we did the Ngorongoro Crater and it was spectacular - saw a leopard in a tree within the first hour! The team remembers us from previous trips which makes it feel like visiting old friends. That\'s the kind of service you can\'t put a price on.',
        date: '2023-12-18',
        safariPackage: '5 Days Tanzania Wildlife Safari',
        helpful: 35,
        verified: true,
    },
];

export function getAverageRating(reviews: Review[]): number {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
}

export function getReviewsByPackage(packageName: string): Review[] {
    return sampleReviews.filter(review => review.safariPackage === packageName);
}

export function getVerifiedReviews(): Review[] {
    return sampleReviews.filter(review => review.verified);
}
