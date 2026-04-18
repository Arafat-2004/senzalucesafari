-- Database Performance Indexes
-- Run this in Supabase SQL Editor

-- =====================================================
-- BOOKING INDEXES
-- =====================================================

-- Index for status filtering (e.g., WHERE status = 'PENDING')
CREATE INDEX IF NOT EXISTS idx_booking_status ON "Booking"(status);

-- Index for payment status filtering
CREATE INDEX IF NOT EXISTS idx_booking_payment_status ON "Booking"("paymentStatus");

-- Index for travel date queries (e.g., WHERE travelDate >= NOW())
CREATE INDEX IF NOT EXISTS idx_booking_travel_date ON "Booking"("travelDate");

-- Index for sorting by created date (dashboard queries)
CREATE INDEX IF NOT EXISTS idx_booking_created_at ON "Booking"("createdAt" DESC);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_booking_email ON "Booking"(email);

-- Index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_booking_user_id ON "Booking"("userId");

-- Composite index for common dashboard query (status + createdAt)
CREATE INDEX IF NOT EXISTS idx_booking_status_created ON "Booking"(status, "createdAt" DESC);

-- =====================================================
-- TOUR INDEXES
-- =====================================================

-- Index for filtering active tours
CREATE INDEX IF NOT EXISTS idx_tour_is_active ON "Tour"("isActive");

-- Index for featured tours
CREATE INDEX IF NOT EXISTS idx_tour_is_featured ON "Tour"("isFeatured");

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_tour_category ON "Tour"(category);

-- Index for price ordering
CREATE INDEX IF NOT EXISTS idx_tour_price_from ON "Tour"("priceFrom" ASC);

-- Index for slug (single tour pages)
CREATE INDEX IF NOT EXISTS idx_tour_slug ON "Tour"(slug) UNIQUE;

-- Index for sorting
CREATE INDEX IF NOT EXISTS idx_tour_display_order ON "Tour"("displayOrder" ASC);

-- =====================================================
-- DESTINATION INDEXES
-- =====================================================

-- Index for filtering active destinations
CREATE INDEX IF NOT EXISTS idx_destination_is_active ON "Destination"("isActive");

-- Index for slug
CREATE INDEX IF NOT EXISTS idx_destination_slug ON "Destination"(slug) UNIQUE;

-- Index for region filtering
CREATE INDEX IF NOT EXISTS idx_destination_region ON "Destination"(region);

-- =====================================================
-- ACCOMMODATION INDEXES
-- =====================================================

-- Index for filtering active accommodations
CREATE INDEX IF NOT EXISTS idx_accommodation_is_active ON "Accommodations"("isActive");

-- Index for type filtering
CREATE INDEX IF NOT EXISTS idx_accommodation_type ON "Accommodations"(type);

-- Index for location
CREATE INDEX IF NOT EXISTS idx_accommodation_location ON "Accommodations"(location);

-- =====================================================
-- REVIEW INDEXES
-- =====================================================

-- Index for approved reviews
CREATE INDEX IF NOT EXISTS idx_review_is_approved ON "Review"("isApproved");

-- Index for featured reviews
CREATE INDEX IF NOT EXISTS idx_review_is_featured ON "Review"("isFeatured");

-- Index for tour reviews
CREATE INDEX IF NOT EXISTS idx_review_tour_id ON "Review"("tourId");

-- =====================================================
-- CONTACT INQUIRY INDEXES
-- =====================================================

-- Index for reply status
CREATE INDEX IF NOT EXISTS idx_contact_inquiry_is_replied ON "ContactInquiry"("isReplied");

-- Index for read status
CREATE INDEX IF NOT EXISTS idx_contact_inquiry_is_read ON "ContactInquiry"("isRead");

-- Index for created date
CREATE INDEX IF NOT EXISTS idx_contact_inquiry_created ON "ContactInquiry"("createdAt" DESC);

-- =====================================================
-- NEWSLETTER INDEXES
-- =====================================================

-- Index for active subscribers
CREATE INDEX IF NOT EXISTS idx_newsletter_is_active ON "Newsletter"("isActive");

-- =====================================================
-- BLOG POST INDEXES
-- =====================================================

-- Index for published posts
CREATE INDEX IF NOT EXISTS idx_blog_post_is_published ON "BlogPost"("isPublished");

-- Index for published date
CREATE INDEX IF NOT EXISTS idx_blog_post_published_at ON "BlogPost"("publishedAt" DESC);

-- Index for slug
CREATE INDEX IF NOT EXISTS idx_blog_post_slug ON "BlogPost"(slug) UNIQUE;

-- Index for category
CREATE INDEX IF NOT EXISTS idx_blog_post_category ON "BlogPost"(category);

-- =====================================================
-- GUIDE INDEXES
-- =====================================================

-- Index for active guides
CREATE INDEX IF NOT EXISTS idx_guide_is_active ON "Guide"("isActive");

-- =====================================================
-- VEHICLE INDEXES
-- =====================================================

-- Index for active vehicles
CREATE INDEX IF NOT EXISTS idx_vehicle_is_active ON "Vehicle"("isActive");

-- Index for category
CREATE INDEX IF NOT EXISTS idx_vehicle_category ON "Vehicle"(category);

-- =====================================================
-- FAQ INDEXES
-- =====================================================

-- Index for active FAQs
CREATE INDEX IF NOT EXISTS idx_faq_is_active ON "FAQ"("isActive");

-- Index for ordering
CREATE INDEX IF NOT EXISTS idx_faq_display_order ON "FAQ"("displayOrder" ASC);

-- =====================================================
-- Print confirmation
-- =====================================================
SELECT 'Indexes created successfully!' as result;