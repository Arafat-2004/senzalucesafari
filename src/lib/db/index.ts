// ===========================================
// DATABASE QUERY LAYER
// ===========================================

export {
    getAllTours,
    getTourBySlug,
    getToursByCategory,
    getToursByDestination,
    getFeaturedTours,
    getAllTourSlugs,
} from './tours';

export {
    getAllDestinations,
    getMainDestinations,
    getDestinationBySlug,
    getDestinationsByRegion,
    getAllDestinationSlugs,
} from './destinations';

export {
    getAllAccommodations,
    getAccommodationsByTier,
} from './accommodations';

export {
    getAllBlogArticles,
    getBlogBySlug,
    getAllBlogSlugs,
    getBlogsByCategory,
    getRelatedPosts,
} from './blogs';

export {
    getApprovedReviews,
    getFeaturedReviews,
    getReviewsByTour,
    getFeaturedTestimonials,
} from './reviews';

export {
    subscribeNewsletter,
    unsubscribeNewsletter,
} from './newsletter';

export {
    createBooking,
    getBookingByRef,
    getBookingsByEmail,
} from './bookings';

export {
    createEnquiry,
    getUnreadEnquiriesCount,
    markEnquiryAsRead,
    markEnquiryAsReplied,
} from './enquiries';
