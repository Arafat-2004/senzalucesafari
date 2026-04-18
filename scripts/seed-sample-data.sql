-- ============================================
-- SENZA LUCE SAFARIS - SAMPLE DATA SEED SCRIPT
-- ============================================
-- Run this in Supabase SQL Editor to populate empty tables

-- ============================================
-- 1. FAQS (10 essential FAQs)
-- ============================================

INSERT INTO faqs (id, question, answer, category, isActive) VALUES
(gen_random_uuid()::text, 
 'What is the best time to visit Tanzania for a safari?', 
 'The best time for wildlife viewing is during the dry season from June to October. The Great Migration river crossings typically occur from July to September. For bird watching, November to April is ideal when migratory birds arrive.',
 'Safari', true),

(gen_random_uuid()::text, 
 'Do I need a visa to visit Tanzania?', 
 'Most visitors require a visa. You can obtain an e-Visa online before travel or a visa on arrival at major airports. The tourist visa costs $50 USD for most nationalities and is valid for 90 days. We recommend applying online in advance to avoid delays.',
 'Visa', true),

(gen_random_uuid()::text, 
 'What vaccinations are required for Tanzania?', 
 'Yellow fever vaccination is required if arriving from an infected area. We highly recommend Hepatitis A & B, Typhoid, and Tetanus. Malaria prophylaxis is strongly advised. Consult your travel doctor 6-8 weeks before departure.',
 'Health', true),

(gen_random_uuid()::text, 
 'What should I pack for a safari?', 
 'Pack light, neutral-colored clothing (khaki, beige, olive). Bring layers for cool mornings, a warm jacket, comfortable walking shoes, hat, sunglasses, sunscreen, insect repellent, binoculars, and camera equipment. Avoid bright colors and camouflage patterns.',
 'Packing', true),

(gen_random_uuid()::text, 
 'How much does a Tanzania safari cost?', 
 'Safari costs vary based on duration, accommodation level, and group size. Budget safaris start from $150-250 per person per day, mid-range from $300-500, and luxury from $600-1000+. Our packages range from $1,500 to $5,000+ per person depending on the itinerary.',
 'Pricing', true),

(gen_random_uuid()::text, 
 'Is Tanzania safe for tourists?', 
 'Tanzania is one of Africa''s safest safari destinations. Crime against tourists is rare, especially on organized safaris. We recommend standard precautions: don''t display valuables, use hotel safes, and follow your guide''s advice. Wildlife safety is ensured by professional guides.',
 'Safety', true),

(gen_random_uuid()::text, 
 'What is included in your safari packages?', 
 'Our packages include: professional English-speaking guide, 4x4 safari vehicle with pop-up roof, park entrance fees, accommodation, meals as specified, airport transfers, and bottled water. International flights, visas, travel insurance, and personal items are excluded.',
 'Booking', true),

(gen_random_uuid()::text, 
 'Can I customize my safari itinerary?', 
 'Absolutely! We specialize in custom safaris tailored to your preferences, budget, and schedule. Contact us with your ideas, and we''ll create a personalized itinerary. Customization may affect pricing based on your specific requirements.',
 'Booking', true),

(gen_random_uuid()::text, 
 'What is the Great Migration and when does it happen?', 
 'The Great Migration is the annual movement of over 1.5 million wildebeest, zebras, and gazelles between Tanzania''s Serengeti and Kenya''s Masai Mara. River crossings (July-September) are the most dramatic. The migration is year-round, with different highlights each season.',
 'Safari', true),

(gen_random_uuid()::text, 
 'How do I book a safari with Senza Luce?', 
 'You can book directly through our website by selecting your preferred tour and clicking "Book Now". You can also email us at info@senzalucesafaris.com or call us. We require a 30% deposit to confirm your booking, with the balance due 60 days before departure.',
 'Booking', true);

-- ============================================
-- 2. GUIDES (5 experienced safari guides)
-- ============================================

INSERT INTO guides (id, "firstName", "lastName", email, phone, languages, specialties, experience, bio, certifications, "licenseNumber", avatar, rating, "reviewCount", "isActive") VALUES
(gen_random_uuid()::text,
 'Joseph', 'Mwakasege', 'joseph.m@senzalucesafaris.com', '+255 768 123 456',
 ARRAY['English', 'Swahili', 'German'],
 ARRAY['Wildlife Expert', 'Big Five Specialist', 'Bird Watching'],
 15,
 'Joseph is one of Tanzania''s most experienced safari guides with 15 years in the field. Born and raised near Serengeti, he has an extraordinary ability to spot wildlife and shares fascinating insights about animal behavior and local ecosystems.',
 ARRAY['Tanzania Professional Guide License', 'First Aid Certified', 'Wildlife Conservation Certificate'],
 'GUIDE-TZ-2009-1234',
 NULL,
 4.9,
 87,
 true),

(gen_random_uuid()::text,
 'Amina', 'Hassan', 'amina.h@senzalucesafaris.com', '+255 754 234 567',
 ARRAY['English', 'Swahili', 'French', 'Italian'],
 ARRAY['Bird Specialist', 'Cultural Tours', 'Photography'],
 10,
 'Amina is a passionate naturalist specializing in bird watching and cultural experiences. With expertise in over 500 Tanzanian bird species, she leads exceptional birding safaris and cultural village tours that provide authentic local experiences.',
 ARRAY['Certified Bird Guide', 'Cultural Tourism License', 'Photography Workshop Certified'],
 'GUIDE-TZ-2014-2345',
 NULL,
 4.8,
 62,
 true),

(gen_random_uuid()::text,
 'David', 'Mwanga', 'david.m@senzalucesafaris.com', '+255 776 345 678',
 ARRAY['English', 'Swahili', 'Spanish'],
 ARRAY['Kilimanjaro Trekking', 'Mountain Guide', 'First Aid'],
 12,
 'David is a certified mountain guide who has successfully led over 500 Kilimanjaro treks. His knowledge of mountain ecology, combined with his encouraging personality, makes him the perfect companion for your summit adventure.',
 ARRAY['Kilimanjaro Senior Guide License', 'Wilderness First Responder', 'Mountain Rescue Certified'],
 'GUIDE-TZ-2012-3456',
 NULL,
 4.9,
 124,
 true),

(gen_random_uuid()::text,
 'Grace', 'Lyimo', 'grace.l@senzalucesafaris.com', '+255 784 456 789',
 ARRAY['English', 'Swahili', 'Mandarin'],
 ARRAY['Family Safaris', 'Conservation', 'Education'],
 8,
 'Grace specializes in family safaris and educational tours. She has a gift for engaging children and adults alike, making learning about wildlife conservation fun and memorable. Her warm personality ensures every guest feels welcomed.',
 ARRAY['Professional Guide License', 'Child Safety Certified', 'Conservation Education Certificate'],
 'GUIDE-TZ-2016-4567',
 NULL,
 4.7,
 45,
 true),

(gen_random_uuid()::text,
 'Emmanuel', 'Nkya', 'emmanuel.n@senzalucesafaris.com', '+255 765 567 890',
 ARRAY['English', 'Swahili', 'Japanese'],
 ARRAY['Photography', 'Wildlife Behavior', 'Night Drives'],
 11,
 'Emmanuel is a wildlife photographer turned guide, offering unique photography safaris. His patience and knowledge of animal behavior help guests capture stunning wildlife shots. He also conducts exciting night game drives in permitted areas.',
 ARRAY['Professional Photography License', 'Wildlife Behavior Specialist', 'Night Driving Certified'],
 'GUIDE-TZ-2013-5678',
 NULL,
 4.8,
 73,
 true);

-- ============================================
-- 3. SITE SETTINGS (Essential configuration)
-- ============================================

INSERT INTO site_settings (id, key, value, description) VALUES
(gen_random_uuid()::text, 'site_name', 'Senza Luce Safaris', 'Official website name'),
(gen_random_uuid()::text, 'contact_email', 'info@senzalucesafaris.com', 'Primary contact email'),
(gen_random_uuid()::text, 'contact_phone', '+255 768 000 000', 'Primary contact phone number'),
(gen_random_uuid()::text, 'contact_address', 'Arusha, Tanzania', 'Business physical address'),
(gen_random_uuid()::text, 'booking_deposit_percent', '30', 'Required deposit percentage for bookings'),
(gen_random_uuid()::text, 'balance_due_days', '60', 'Days before departure when balance is due'),
(gen_random_uuid()::text, 'cancellation_policy', 'Free cancellation up to 90 days before departure. 50% refund 60-89 days. No refund within 60 days.', 'Standard cancellation terms'),
(gen_random_uuid()::text, 'currency', 'USD', 'Default currency for all prices'),
(gen_random_uuid()::text, 'tax_rate', '0', 'Tax rate percentage (0 for tax-inclusive pricing)'),
(gen_random_uuid()::text, 'social_facebook', 'https://facebook.com/senzalucesafaris', 'Facebook page URL'),
(gen_random_uuid()::text, 'social_instagram', 'https://instagram.com/senzalucesafaris', 'Instagram profile URL'),
(gen_random_uuid()::text, 'social_twitter', 'https://twitter.com/senzalucesafaris', 'Twitter/X profile URL'),
(gen_random_uuid()::text, 'whatsapp_number', '+255768000000', 'WhatsApp business number'),
(gen_random_uuid()::text, 'google_maps_api_key', '', 'Google Maps API key for location features'),
(gen_random_uuid()::text, 'analytics_enabled', 'true', 'Enable page view tracking');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check inserted data
SELECT 'FAQs' as table_name, COUNT(*) as count FROM faqs WHERE is_active = true
UNION ALL
SELECT 'Guides' as table_name, COUNT(*) as count FROM guides WHERE "isActive" = true
UNION ALL
SELECT 'Settings' as table_name, COUNT(*) as count FROM site_settings;
