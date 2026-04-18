-- ========================================
-- COMPLETE TOURS MIGRATION - ALL 33 TOURS
-- ========================================
-- Generated automatically from src/data/tours.ts
-- Copy ALL of this SQL and paste in:
-- https://supabase.com/dashboard/project/lmpvkxnudhyxjigugnzj/sql/new
-- Then click "Run"
-- ========================================

-- Tour 1: 5 Days Tanzania Wildlife Safari
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('5 Days Tanzania Wildlife Safari', '5-days-wildlife', 'Wildlife Safari', 'A classic Northern Circuit safari covering Tarangire, Serengeti, and Ngorongoro', 'A classic Northern Circuit safari covering Tarangire, Serengeti, and Ngorongoro. Best for first-time visitors seeking a wildlife-focused experience.', '["First-time visitors", "Wildlife focus"]'::jsonb, '5 days / 4 nights', 'Arusha', '[
            "Big cats in Serengeti",
            "Ngorongoro Crater game drive",
            "Iconic baobabs + elephants in Tarangire"
        ]'::jsonb, '[]'::jsonb, '[
            "Professional driver-guide",
            "Park fees",
            "Safari vehicle + fuel",
            "Meals as per itinerary",
            "Bottled water"
        ]'::jsonb, '[
            "International flights",
            "Visa + travel insurance",
            "Tips",
            "Alcoholic drinks"
        ]'::jsonb, '/images/destinations/serengeti.jpg', 2450, 9.4, 87, 'Moderate', true, true, 1);

-- Tour 2: 9 Days Safari + Zanzibar Beach Experience
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('9 Days Safari + Zanzibar Beach Experience', '9-days-safari-zanzibar', 'Safari & Beach', 'Combine Tanzania''s top parks with a relaxing Zanzibar beach stay', 'Combine Tanzania''s top parks with a relaxing Zanzibar beach stay. Perfect for travelers seeking both wildlife adventure and beach relaxation.', '["Wildlife + beach", "Honeymoon", "Families"]'::jsonb, '9 days', 'Arusha • Zanzibar', '[
            "Serengeti wildlife viewing",
            "Ngorongoro Crater",
            "Zanzibar white-sand beaches"
        ]'::jsonb, '[]'::jsonb, '[
            "Safari vehicle + driver-guide",
            "Park fees (mainland)",
            "Domestic flight to Zanzibar (if included in your package)",
            "Meals + accommodations as per itinerary"
        ]'::jsonb, '[
            "International flights",
            "Visa + travel insurance",
            "Tips",
            "Optional activities"
        ]'::jsonb, '/images/destinations/zanzibar-beach.jpg', 4280, 9.6, 124, 'Moderate', true, true, 2);

-- Tour 3: Mount Kilimanjaro Trekking
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('Mount Kilimanjaro Trekking', 'kilimanjaro-trekking', 'Trekking', 'Climb Mount Kilimanjaro with experienced guides and strong safety standards', 'Climb Mount Kilimanjaro with experienced mountain guides and strong safety standards. Choose from multiple routes to suit your fitness and experience level.', '["Adventure seekers", "Physical challenge", "Bucket list experience"]'::jsonb, '6-8 days (route dependent)', 'Arusha / Moshi', '[
            "Summit Africa''s highest peak",
            "Experienced mountain guides",
            "Multiple route options",
            "Strong safety standards"
        ]'::jsonb, '[]'::jsonb, '[
            "Mountain guides + porters",
            "Park fees",
            "Tents (if camping route)",
            "Meals on the mountain",
            "Safety equipment"
        ]'::jsonb, '[
            "International flights",
            "Visa + travel insurance",
            "Tips for guides and porters",
            "Personal gear rental",
            "Hotel before/after trek"
        ]'::jsonb, '/images/safaris/kilimanjaro.jpg', 1850, 9.2, 156, 'Moderate', true, true, 3);

-- Tour 4: 6 Days Northern Circuit Safari - Mount Kilimanjaro Views
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('6 Days Northern Circuit Safari - Mount Kilimanjaro Views', '6-day-northern-circuit', 'Wildlife Safari', 'Experience Tanzania''s iconic parks with stunning Kilimanjaro views', 'A comprehensive safari covering Tarangire, Lake Manyara, Serengeti, and Ngorongoro Crater with breathtaking views of Mount Kilimanjaro.', '["First-time visitors", "Photography", "Big Five"]'::jsonb, '6 days / 5 nights', 'Arusha', '[
            "Big Five game viewing",
            "Ngorongoro Crater exploration",
            "Serengeti endless plains",
            "Kilimanjaro vistas"
        ]'::jsonb, '[]'::jsonb, '["Professional guide", "Park fees", "4x4 safari vehicle", "Meals", "Accommodation"]'::jsonb, '["Flights", "Visa", "Tips", "Drinks"]'::jsonb, '/images/destinations/serengeti/serengeti.jpg', 3300, 9.5, 92, 'Moderate', true, true, 4);

-- Tour 5: 4 Days Zanzibar Beach Holiday - Stone Town & Spice Tour
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('4 Days Zanzibar Beach Holiday - Stone Town & Spice Tour', '4-day-zanzibar-beach', 'Safari & Beach', 'Relax on pristine beaches and explore historic Stone Town', 'Perfect beach getaway combining relaxation on white sand beaches with cultural exploration of Stone Town and spice plantations.', '["Beach lovers", "Culture", "Relaxation"]'::jsonb, '4 days / 3 nights', 'Zanzibar', '[
            "White sand beaches",
            "Stone Town UNESCO site",
            "Spice plantation tour",
            "Sunset dhow cruise"
        ]'::jsonb, '[]'::jsonb, '["Airport transfers", "Hotel accommodation", "Breakfast daily", "Stone Town tour", "Spice tour"]'::jsonb, '["Flights", "Lunch/dinner", "Optional activities", "Tips"]'::jsonb, '/images/destinations/zanzibar/zanzibar-beach.jpg', 1150, 9.1, 78, 'Moderate', true, true, 5);

-- Tour 6: 3 Days Luxury Serengeti Safari - Paradise & Star Beds
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('3 Days Luxury Serengeti Safari - Paradise & Star Beds', '3-day-luxury-safari', 'Wildlife Safari', 'Ultimate luxury safari experience in premium lodges', 'Short but luxurious safari staying in top-tier lodges with exceptional service, gourmet dining, and prime wildlife viewing locations.', '["Luxury travelers", "Short trips", "Honeymoon"]'::jsonb, '3 days / 2 nights', 'Arusha', '[
            "Luxury tented camps",
            "Private game drives",
            "Gourmet bush dinners",
            "Star bed experience"
        ]'::jsonb, '[]'::jsonb, '["Domestic flights", "Luxury accommodation", "All meals", "Private guide", "Premium beverages"]'::jsonb, '["International flights", "Gratuities", "Spa treatments", "Additional activities"]'::jsonb, '/images/accommodations/luxury/luxury-lodge.jpg', 2800, 9.8, 45, 'Moderate', true, true, 6);

-- Tour 7: 7 Days Great Migration Safari - River Crossings & Predator Action
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('7 Days Great Migration Safari - River Crossings & Predator Action', '7-day-great-migration', 'Wildlife Safari', 'Witness the spectacular wildebeest migration river crossings', 'Timed to coincide with the Great Migration river crossings, this safari offers front-row seats to nature''s most dramatic spectacle.', '["Wildlife enthusiasts", "Photographers", "Migration season"]'::jsonb, '7 days / 6 nights', 'Arusha', '[
            "River crossing action",
            "Predator hunting scenes",
            "Hot air balloon safari",
            "Maasai village visit"
        ]'::jsonb, '[]'::jsonb, '["Expert guide", "Park fees", "Vehicle", "Meals", "Balloon safari"]'::jsonb, '["Flights", "Visa", "Tips", "Alcoholic drinks"]'::jsonb, '/images/blog/great-migration.jpg', 4200, 9.7, 134, 'Moderate', true, true, 7);

-- Tour 8: 5 Days Family Adventure Safari - Kid-Friendly Lodges & Activities
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('5 Days Family Adventure Safari - Kid-Friendly Lodges & Activities', '5-day-family-adventure', 'Wildlife Safari', 'Tailored safari designed specifically for families with children', 'Family-focused safari with kid-friendly accommodations, flexible schedules, and engaging activities suitable for all ages.', '["Families with kids", "Educational", "Multi-generational"]'::jsonb, '5 days / 4 nights', 'Arusha', '[
            "Kid-friendly guides",
            "Junior ranger program",
            "Swimming pools",
            "Flexible timing"
        ]'::jsonb, '[]'::jsonb, '["Family guide", "Park fees", "Vehicle", "Meals", "Kids activities"]'::jsonb, '["Flights", "Visa", "Tips", "Personal items"]'::jsonb, '/images/destinations/serengeti/serengeti.jpg', 2650, 9.3, 67, 'Moderate', true, true, 8);

-- Tour 9: 8 Days Photography Safari - Professional Guide & Optimal Lighting
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('8 Days Photography Safari - Professional Guide & Optimal Lighting', '8-day-photography-safari', 'Wildlife Safari', 'Specialized safari for photography enthusiasts with expert guidance', 'Designed for photographers with optimal timing for golden hour shots, specialized vehicles with camera mounts, and expert photography guidance.', '["Photographers", "Wildlife photography", "Advanced techniques"]'::jsonb, '8 days / 7 nights', 'Arusha', '[
            "Photography specialist guide",
            "Bean bag camera mounts",
            "Golden hour focus",
            "Post-processing tips"
        ]'::jsonb, '[]'::jsonb, '["Photo specialist guide", "Camera equipment support", "Park fees", "Vehicle", "Meals"]'::jsonb, '["Camera gear", "Flights", "Visa", "Tips"]'::jsonb, '/images/blog/big-five.jpg', 4800, 9.6, 52, 'Moderate', true, true, 9);

-- Tour 10: 10 Days Grand Tanzania Safari - Complete Northern Circuit Experience
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('10 Days Grand Tanzania Safari - Complete Northern Circuit Experience', '10-day-grand-tanzania', 'Wildlife Safari', 'Comprehensive safari covering all major northern parks', 'The ultimate Tanzania safari experience visiting every major park in the northern circuit with extended game viewing time.', '["Complete experience", "Serious wildlife watchers", "Extended vacation"]'::jsonb, '10 days / 9 nights', 'Arusha', '[
            "All northern parks",
            "Extended game drives",
            "Cultural experiences",
            "Premium accommodations"
        ]'::jsonb, '[]'::jsonb, '["Expert guide", "All park fees", "Vehicle", "All meals", "Cultural visits"]'::jsonb, '["Flights", "Visa", "Tips", "Optional activities"]'::jsonb, '/images/destinations/serengeti.jpg', 5500, 9.8, 89, 'Moderate', true, true, 10);

-- Tour 11: 6 Days Bush & Beach Combo - Serengeti & Zanzibar
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('6 Days Bush & Beach Combo - Serengeti & Zanzibar', '6-day-bush-beach', 'Safari & Beach', 'Perfect blend of safari adventure and beach relaxation', 'Ideal combination package offering the best of both worlds - thrilling safari followed by relaxing beach time in Zanzibar.', '["Best of both worlds", "Honeymoon", "Balanced vacation"]'::jsonb, '6 days / 5 nights', 'Arusha • Zanzibar', '[
            "Serengeti game drives",
            "Zanzibar beaches",
            "Seamless logistics",
            "Two distinct experiences"
        ]'::jsonb, '[]'::jsonb, '["Domestic flights", "Safari vehicle", "Beach hotel", "Meals as specified", "Transfers"]'::jsonb, '["International flights", "Visa", "Tips", "Optional excursions"]'::jsonb, '/images/destinations/serengeti/serengeti-sunset.jpg', 3800, 9.4, 103, 'Moderate', true, false, 11);

-- Tour 12: 4 Days Quick Safari Express - Ngorongoro & Lake Manyara
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('4 Days Quick Safari Express - Ngorongoro & Lake Manyara', '4-day-quick-safari', 'Wildlife Safari', 'Compact safari perfect for short stays or stopovers', 'Efficiently designed short safari maximizing wildlife viewing in limited time, ideal for business travelers or those with tight schedules.', '["Time-constrained", "Stopover", "Quick experience"]'::jsonb, '4 days / 3 nights', 'Arusha', '[
            "Ngorongoro Crater",
            "Lake Manyara",
            "Efficient routing",
            "Quality over quantity"
        ]'::jsonb, '[]'::jsonb, '["Guide", "Park fees", "Vehicle", "Meals", "Accommodation"]'::jsonb, '["Flights", "Visa", "Tips", "Drinks"]'::jsonb, '/images/destinations/ngorongoro.jpg', 1950, 8.9, 71, 'Moderate', true, false, 12);

-- Tour 13: 12 Days Ultimate Tanzania - Safari, Zanzibar & Culture
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('12 Days Ultimate Tanzania - Safari, Zanzibar & Culture', '12-day-ultimate-tanzania', 'Safari & Beach', 'The complete Tanzania experience with everything included', 'Comprehensive journey combining extensive safari, beach relaxation, cultural immersion, and optional Kilimanjaro views.', '["Ultimate experience", "Extended vacation", "Once-in-a-lifetime"]'::jsonb, '12 days / 11 nights', 'Arusha • Zanzibar', '[
            "Complete northern circuit",
            "Zanzibar extension",
            "Maasai cultural visit",
            "Coffee farm tour"
        ]'::jsonb, '[]'::jsonb, '["Expert guide", "All parks", "Flights to Zanzibar", "All meals", "Cultural visits"]'::jsonb, '["International flights", "Visa", "Tips", "Personal expenses"]'::jsonb, '/images/safaris/serengeti-migration.jpg', 6200, 9.9, 67, 'Moderate', true, false, 13);

-- Tour 14: 5 Days Budget Camping Safari - Authentic Bush Experience
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('5 Days Budget Camping Safari - Authentic Bush Experience', '5-day-budget-safari', 'Wildlife Safari', 'Affordable safari with comfortable camping accommodations', 'Budget-friendly option offering authentic camping experience without compromising on wildlife viewing quality or safety.', '["Budget travelers", "Adventure seekers", "Young travelers"]'::jsonb, '5 days / 4 nights', 'Arusha', '[
            "Camping under stars",
            "Same parks as luxury",
            "Authentic experience",
            "Great value"
        ]'::jsonb, '[]'::jsonb, '["Camping equipment", "Guide", "Park fees", "Meals", "Vehicle"]'::jsonb, '["Sleeping bags (rental available)", "Flights", "Visa", "Tips"]'::jsonb, '/images/destinations/serengeti/serengeti-lions.jpg', 1450, 8.7, 94, 'Moderate', true, false, 14);

-- Tour 15: 7 Days Honeymoon Luxury Safari - Romance & Wildlife
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('7 Days Honeymoon Luxury Safari - Romance & Wildlife', '7-day-honeymoon-luxury', 'Safari & Beach', 'Romantic luxury safari designed for honeymooners', 'Specially crafted romantic safari with luxury accommodations, private experiences, and intimate settings perfect for newlyweds.', '["Honeymoon", "Romance", "Luxury couples"]'::jsonb, '7 days / 6 nights', 'Arusha • Zanzibar', '[
            "Private game drives",
            "Bush dinners",
            "Couples spa treatments",
            "Beach sunset cruises"
        ]'::jsonb, '[]'::jsonb, '["Private guide", "Luxury accommodations", "All meals", "Private transfers", "Romantic extras"]'::jsonb, '["International flights", "Visa", "Additional spa treatments", "Tips"]'::jsonb, '/images/accommodations/luxury/luxury-lodge.jpg', 7500, 9.9, 38, 'Moderate', true, false, 15);

-- Tour 16: 9 Days Wildlife & Bird Photography - Expert-Led Workshop
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('9 Days Wildlife & Bird Photography - Expert-Led Workshop', '9-days-wildlife-photography', 'Wildlife Safari', 'Intensive photography workshop with professional instruction', 'Advanced photography safari led by professional wildlife photographer with hands-on instruction, critique sessions, and optimal shooting conditions.', '["Serious photographers", "Workshop participants", "Skill development"]'::jsonb, '9 days / 8 nights', 'Arusha', '[
            "Professional photographer guide",
            "Daily critique sessions",
            "Optimal lighting times",
            "Equipment advice"
        ]'::jsonb, '[]'::jsonb, '["Pro photographer guide", "Critique sessions", "Park fees", "Vehicle", "Meals"]'::jsonb, '["Camera equipment", "Flights", "Visa", "Tips"]'::jsonb, '/images/blog/big-five.jpg', 5200, 9.7, 41, 'Moderate', true, false, 16);

-- Tour 17: 3 Days Mid-range Safari - Tarangire, Ngorongoro & Lake Manyara
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('3 Days Mid-range Safari - Tarangire, Ngorongoro & Lake Manyara', '3-days-tarangire-ngorongoro-manyara', 'Wildlife Safari', 'Explore three iconic parks in 3 days with comfortable lodges', 'A perfect introduction to Tanzania''s northern circuit covering Tarangire, Ngorongoro Crater, and Lake Manyara. Stay in comfortable mid-range lodges, enjoy full-board meals, and travel in a private 4x4 safari vehicle. Ideal for time-constrained travelers seeking maximum wildlife experiences.', '["Short trips", "First-time visitors", "Budget-conscious", "Three parks experience"]'::jsonb, '3 days / 2 nights', 'Arusha', '[
            "Elephant herds and baobabs in Tarangire",
            "Ngorongoro Crater wildlife viewing",
            "Tree-climbing lions in Lake Manyara",
            "Private 4x4 Land Cruiser with WiFi",
            "Full-board meals included"
        ]'::jsonb, '[]'::jsonb, '[
            "Professional driver-guide",
            "Private 4x4 Toyota Land Cruiser with WiFi",
            "Mineral water, beer & wine during safari",
            "All national park entry fees",
            "All activities listed in itinerary",
            "Full-board meals (Day 1-2), Breakfast & lunch (Day 3)",
            "Airport/lodge transfers"
        ]'::jsonb, '[
            "International flights",
            "Visa fees",
            "Drinks at lodges",
            "Laundry services",
            "Tips and personal expenses",
            "Travel insurance",
            "Extra accommodation before/after safari"
        ]'::jsonb, '/images/tours/3-days-tarangire-ngorongoro-manyara/hero.jpg', 990, 0, 0, 'Moderate', true, false, 17);

-- Tour 18: 3 Days Zanzibar Beach Escape - Nur Beach Hotel
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('3 Days Zanzibar Beach Escape - Nur Beach Hotel', '3-days-zanzibar-beach-escape', 'Beach Holiday', 'Relaxing beach getaway at affordable Nur Beach Hotel', 'Experience the beauty and tranquility of Zanzibar with this relaxing 3-day beach escape. Perfect for budget-conscious travelers who want to unwind by the Indian Ocean, enjoy tropical atmosphere, and experience warm Zanzibari hospitality at Nur Beach Hotel.', '["Budget travelers", "Beach relaxation", "Short breaks", "Tropical escape"]'::jsonb, '3 days / 2 nights', 'Zanzibar Airport', '[
            "White sandy beaches of Zanzibar",
            "Warm Indian Ocean swimming",
            "Comfortable beachfront accommodation",
            "Daily breakfast included",
            "Private airport transfers"
        ]'::jsonb, '[]'::jsonb, '[
            "Airport pick-up and drop-off",
            "2 nights accommodation at Nur Beach Hotel",
            "Daily breakfast at hotel",
            "Private airport transfers",
            "Tanview Safaris representative assistance",
            "All government taxes and service charges"
        ]'::jsonb, '[
            "Lunch and dinner meals",
            "Personal expenses (snacks, drinks, souvenirs)",
            "Optional activities and excursions",
            "Travel insurance",
            "International and domestic flights",
            "Tips and gratuities"
        ]'::jsonb, '/images/tours/3-days-zanzibar-beach-escape/hero.jpg', 508, 0, 0, 'Moderate', true, false, 18);

-- Tour 19: 3 Days Amazing Safari - Serengeti & Ngorongoro Crater (Fly-in)
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('3 Days Amazing Safari - Serengeti & Ngorongoro Crater (Fly-in)', '3-days-serengeti-ngorongoro-fly', 'Wildlife Safari', 'Fly-in safari to Serengeti and Ngorongoro with luxury lodges', 'Experience Tanzania''s top two destinations in just 3 days with convenient domestic flights. Stay at Kubukubu Lodge in Serengeti and Ngorongoro Serena Lodge on the crater rim. Includes private 4x4 Land Cruiser with WiFi, full-board meals, and professional guide.', '["Short trips", "Luxury experience", "Serengeti focus", "Time-efficient"]'::jsonb, '3 days / 2 nights', 'Arusha (with domestic flight)', '[
            "Domestic flight to Serengeti (saves time)",
            "Kubukubu Lodge in Serengeti",
            "Ngorongoro Serena Lodge on crater rim",
            "Morning game drives when animals most active",
            "Private 4x4 Land Cruiser with WiFi"
        ]'::jsonb, '[]'::jsonb, '[
            "Professional driver-guide",
            "Private 4x4 Toyota Land Cruiser",
            "Domestic flight Arusha to Seronera",
            "All national park entry fees",
            "Bottled mineral water during safari",
            "All activities in itinerary",
            "Full-board meals (Days 1-2), Breakfast & lunch (Day 3)"
        ]'::jsonb, '[
            "International flights",
            "Visa fees",
            "Drinks at lodges/camps",
            "Laundry services",
            "Tips and personal expenses",
            "Travel insurance",
            "Extra accommodation before/after safari"
        ]'::jsonb, '/images/tours/3-days-serengeti-ngorongoro-fly/hero.jpg', 1312, 0, 0, 'Moderate', true, false, 19);

-- Tour 20: 5 Days Luxury Safari - Northern Tanzania Parks
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('5 Days Luxury Safari - Northern Tanzania Parks', '5-days-luxury-northern-parks', 'Luxury Safari', 'Premium 5-day safari with Gran Melia and Serena lodges', 'Unforgettable 5-day luxury safari across Tarangire, Serengeti, Ngorongoro Crater, and Lake Manyara. Stay at prestigious Gran Melia Arusha, Lake Manyara Serena Safari Lodge, and Serengeti Serena Safari Lodge. Private game drives, breathtaking sunsets, and tranquil evenings immersed in nature.', '["Luxury travelers", "Premium experience", "Brand-name lodges", "All 4 parks"]'::jsonb, '5 days / 4 nights', 'Arusha', '[
            "Gran Melia Arusha (5-star luxury)",
            "Serena Safari Lodges (premium brand)",
            "All 4 northern circuit parks",
            "Private game drives with expert guide",
            "Sunset game drives in Serengeti"
        ]'::jsonb, '[]'::jsonb, '[
            "Professional driver-guide",
            "Private 4x4 Toyota Land Cruiser",
            "Mineral water during safari",
            "All national park entry fees",
            "All activities in itinerary",
            "Meals as specified per day",
            "Airport/lodge transfers"
        ]'::jsonb, '[
            "International flights",
            "Visa fees",
            "Drinks at lodges",
            "Laundry services",
            "Tips and personal expenses",
            "Travel insurance",
            "Extra accommodation before/after safari"
        ]'::jsonb, '/images/tours/5-days-luxury-northern-parks/hero.jpg', 2124, 0, 0, 'Moderate', true, false, 20);

-- Tour 21: 6 Days Zanzibar Beach Holiday - Paradise & Fun Beach Resorts
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('6 Days Zanzibar Beach Holiday - Paradise & Fun Beach Resorts', '6-days-zanzibar-beach-holiday', 'Beach Holiday', 'Extended 6-day beach escape with two beautiful resorts', 'Enjoy a relaxing 6-day island escape in Zanzibar with turquoise waters, white sandy beaches, and tropical charm. Stay at two beautiful beach resorts - Paradise Beach Resort and Fun Beach Hotel. Perfect combination of comfort, beach relaxation, and peaceful island atmosphere.', '["Extended beach stay", "Two-resort experience", "Relaxation", "Tropical paradise"]'::jsonb, '6 days / 5 nights', 'Zanzibar Airport', '[
            "Two different beach resorts",
            "5 nights of pure relaxation",
            "White sandy beaches and turquoise waters",
            "Daily breakfast included",
            "Private airport transfers"
        ]'::jsonb, '[]'::jsonb, '[
            "Airport pick-up and drop-off",
            "1 night at Paradise Beach Resort",
            "4 nights at Fun Beach Hotel",
            "Daily breakfast at hotels",
            "Private airport transfers",
            "Tanview Safaris representative assistance",
            "All government taxes and service charges"
        ]'::jsonb, '[
            "Lunch and dinner meals",
            "Personal expenses (snacks, drinks, souvenirs)",
            "Optional activities and excursions",
            "Travel insurance",
            "International and domestic flights",
            "Tips and gratuities"
        ]'::jsonb, '/images/tours/6-days-zanzibar-beach-holiday/hero.jpg', 1195, 0, 0, 'Moderate', true, false, 21);

-- Tour 22: 3 Days Calving Season Safari - Ndutu Great Migration
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('3 Days Calving Season Safari - Ndutu Great Migration', '3-days-calving-season-ndutu', 'Wildlife Safari', 'Witness the miracle of Ndutu calving season with newborn animals', 'Experience one of nature''s most spectacular events - the Ndutu calving season. Witness thousands of wildebeest giving birth, attracting predators like lions, cheetahs, and hyenas. This fast-paced 3-day safari offers incredible wildlife action and the chance to see the circle of life unfold in real-time.', '["Calving season", "Predator action", "Photography", "Unique wildlife experience"]'::jsonb, '3 days / 2 nights', 'Arusha', '[
            "Newborn wildebeest and herbivores",
            "Predators in hunting mode",
            "Safari Haven Migration Camp",
            "Ngorongoro Crater visit",
            "Fast-paced wildlife adventure"
        ]'::jsonb, '[]'::jsonb, '[
            "Professional driver-guide",
            "Private 4x4 Toyota Land Cruiser",
            "Bottled mineral water during safari",
            "All national park entry fees",
            "All activities in itinerary",
            "Meals as specified (Lunch & dinner Day 1, all meals Day 2, breakfast Day 3)",
            "Free round-trip airport transfers"
        ]'::jsonb, '[
            "International flights",
            "Visa fees",
            "Drinks at lodges and camps",
            "Laundry services",
            "Tips and personal expenses",
            "Travel insurance",
            "Extra accommodation before/after safari"
        ]'::jsonb, '/images/tours/3-days-calving-season-ndutu/hero.jpg', 948, 0, 0, 'Moderate', true, false, 22);

-- Tour 23: 4 Days Zanzibar Beach Holiday - Hyatt & Nungwi Beach Resort
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('4 Days Zanzibar Beach Holiday - Hyatt & Nungwi Beach Resort', '4-days-zanzibar-beach-hyatt-nungwi', 'Beach Holiday', 'Luxury 4-day beach escape with Hyatt Zanzibar and Nungwi Beach Resort', 'Discover the beauty of Zanzibar on this relaxing 4-day beach escape. Stay in luxurious beachfront hotels - Hyatt Zanzibar and Nungwi Beach Resort. Enjoy tropical activities, unwind on pristine sands, and experience the vibrant coastal atmosphere of this tropical paradise.', '["Luxury beach", "Two-resort experience", "Water sports", "Romantic getaway"]'::jsonb, '4 days / 3 nights', 'Zanzibar Airport', '[
            "Hyatt Zanzibar luxury stay",
            "Nungwi Beach Resort",
            "Turquoise waters and white sand",
            "Optional water sports",
            "Scenic coastal drives"
        ]'::jsonb, '[]'::jsonb, '[
            "Airport pick-up and drop-off",
            "1 night at Hyatt Zanzibar",
            "2 nights at Nungwi Beach Resort",
            "Daily breakfast at hotels",
            "Private airport transfers",
            "Tanview Safaris representative assistance",
            "All government taxes and service charges"
        ]'::jsonb, '[
            "Lunch and dinner meals",
            "Personal expenses (snacks, drinks, souvenirs)",
            "Optional activities and excursions",
            "Travel insurance",
            "International and domestic flights",
            "Tips and gratuities"
        ]'::jsonb, '/images/tours/4-days-zanzibar-beach-hyatt-nungwi/hero.jpg', 858, 0, 0, 'Moderate', true, false, 23);

-- Tour 24: 6 Days Best of Northern Tanzania Parks - Affordable Safari
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('6 Days Best of Northern Tanzania Parks - Affordable Safari', '6-days-northern-tanzania-affordable', 'Wildlife Safari', 'Affordable 6-day safari covering Tarangire, Serengeti, Ngorongoro & Manyara', 'Embark on a remarkable 6-day private safari visiting Tanzania''s iconic parks - Tarangire, Serengeti, Ngorongoro Crater, and Lake Manyara. Witness incredible wildlife, breathtaking landscapes, and stay in comfortable lodges, all at an affordable price. Experienced guides and exciting game drives promise unforgettable moments without stretching your budget.', '["Budget-conscious", "Complete circuit", "First-time visitors", "Value for money"]'::jsonb, '6 days / 5 nights', 'Arusha', '[
            "All 4 northern circuit parks",
            "Elephant herds in Tarangire",
            "Serengeti migration viewing",
            "Ngorongoro Crater exploration",
            "Tree-climbing lions in Manyara"
        ]'::jsonb, '[]'::jsonb, '[
            "Professional driver-guide",
            "Private 4x4 Toyota Land Cruiser (safari-equipped)",
            "Bottled mineral water during safari",
            "All national park entry fees",
            "All activities in program",
            "Free round-trip airport transfers",
            "Meals as specified per day"
        ]'::jsonb, '[
            "International flights",
            "Visa fees",
            "Drinks at lodges and camps",
            "Laundry services",
            "Tips and personal expenses",
            "Travel insurance",
            "Extra accommodation before/after safari"
        ]'::jsonb, '/images/tours/6-days-northern-tanzania-affordable/hero.jpg', 1546, 0, 0, 'Moderate', true, false, 24);

-- Tour 25: 6 Days Memorable Luxury Safari - Northern Tanzania Premium Experience
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('6 Days Memorable Luxury Safari - Northern Tanzania Premium Experience', '6-days-memorable-luxury-safari', 'Luxury Safari', 'Premium 6-day luxury safari with Gran Melia and Escarpment Lodge', 'This 6-day luxury safari takes you through the best of Northern Safari Circuit with premium accommodations. See amazing wildlife in different landscapes - monkeys in forests, lions in trees, elephants among acacia, animals in collapsed volcano. Visit world-famous Serengeti with beautiful scenery creating truly special experience.', '["Luxury travelers", "Premium experience", "Gran Melia stay", "Comprehensive circuit"]'::jsonb, '6 days / 5 nights', 'Arusha', '[
            "Gran Meliá Arusha (5-star luxury)",
            "Escarpment Luxury Lodge Manyara",
            "Tukaone Hembe Camp Serengeti",
            "All 4 northern parks",
            "Premium game drives"
        ]'::jsonb, '[]'::jsonb, '[
            "Dedicated professional driver-guide",
            "Private 4x4 Toyota Land Cruiser (safari-equipped)",
            "Bottled mineral water during safari",
            "All national park entry fees",
            "All activities in program",
            "Free round-trip airport transfers",
            "Meals as specified per day"
        ]'::jsonb, '[
            "International flights",
            "Visa fees",
            "Drinks at lodges and camps",
            "Laundry services",
            "Tips and personal expenses",
            "Travel insurance",
            "Extra accommodation before/after safari"
        ]'::jsonb, '/images/tours/6-days-memorable-luxury-safari/hero.jpg', 2575, 0, 0, 'Moderate', true, false, 25);

-- Tour 26: 4 Days Discover Tarangire, Serengeti & Ngorongoro Crater
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('4 Days Discover Tarangire, Serengeti & Ngorongoro Crater', '4-days-discover-tarangire-serengeti-ngorongoro', 'Wildlife Safari', 'Unforgettable 4-day mid-range safari through Tanzania''s top wildlife destinations', 'Enjoy unforgettable 4-day mid-range safari through Tanzania''s top wildlife destinations - Tarangire National Park, famous Serengeti, and Ngorongoro Crater. See large elephant herds among baobab trees, explore wide Serengeti plains, take in stunning views of Ngorongoro''s crater. Wonderful chance to experience beauty and wildlife of Africa.', '["Mid-range value", "Three major parks", "Great Migration", "Compact safari"]'::jsonb, '4 days / 3 nights', 'Arusha', '[
            "Tarangire elephant herds",
            "Ndutu calving season viewing",
            "Serengeti endless plains",
            "Ngorongoro Crater descent",
            "Hot air balloon option"
        ]'::jsonb, '[]'::jsonb, '[
            "Professional driver-guide",
            "Private 4x4 Toyota Land Cruiser",
            "Bottled mineral water during safari",
            "All national park entry fees",
            "All activities in program",
            "Meals as specified (Lunch & dinner Day 1, all meals Days 2-3, breakfast & lunch Day 4)"
        ]'::jsonb, '[
            "International flights",
            "Visa fees",
            "Drinks at lodges/camps",
            "Laundry services",
            "Tips and personal expenses",
            "Hot air balloon safari (optional extra)",
            "Extra accommodation before/after safari"
        ]'::jsonb, '/images/tours/4-days-discover-tarangire-serengeti-ngorongoro/hero.jpg', 1074, 0, 0, 'Moderate', true, false, 26);

-- Tour 27: 4 Days Luxury Safari - Serena Lodges Tarangire, Serengeti & Ngorongoro
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('4 Days Luxury Safari - Serena Lodges Tarangire, Serengeti & Ngorongoro', '4-days-luxury-safari-serena', 'Luxury Safari', 'Premium 4-day safari staying at prestigious Serena Safari Lodges', 'Enjoy 4-day journey through Tanzania''s most famous parks staying at prestigious Serena Safari Lodges. Encounter incredible wildlife, observe animals in natural habitats, take in stunning landscapes. Led by professional driver-guide ensuring safe, enjoyable, memorable journey. Private 4x4 Land Cruiser with mineral water, power sockets, binoculars. Perfect combination of adventure, comfort, unforgettable experiences.', '["Luxury experience", "Serena brand loyalty", "Premium lodges", "4-day circuit"]'::jsonb, '4 days / 3 nights', 'Arusha', '[
            "Lake Manyara Serena Safari Lodge",
            "Serengeti Serena Safari Lodge",
            "Ngorongoro Serena Safari Lodge",
            "Premium game drives",
            "All 3 major parks"
        ]'::jsonb, '[]'::jsonb, '[
            "Dedicated professional driver-guide",
            "Private 4x4 Toyota Land Cruiser",
            "Bottled mineral water during safari",
            "All national park entry fees",
            "All activities in program",
            "Transfers listed in itinerary",
            "Meals as specified (All meals Days 1-3, breakfast & lunch Day 4)"
        ]'::jsonb, '[
            "International flights",
            "Visa fees",
            "Drinks at lodges/camps",
            "Laundry services",
            "Tips and personal expenses",
            "Anything not explicitly included",
            "Extra accommodation before/after safari"
        ]'::jsonb, '/images/tours/4-days-luxury-safari-serena/hero.jpg', 2064, 0, 0, 'Moderate', true, false, 27);

-- Tour 28: 7 Days Wildlife Safari Experience - Serengeti, Ngorongoro & Zanzibar
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('7 Days Wildlife Safari Experience - Serengeti, Ngorongoro & Zanzibar', '7-days-wildlife-safari-zanzibar-combo', 'Safari & Beach', 'Perfect 7-day combo combining Serengeti/Ndutu/Ngorongoro safari with Zanzibar beach', 'This 7-day safari offers wonderful experience in Northern Tanzania visiting Serengeti, Ndutu, and Ngorongoro Crater. Enjoy rich wildlife, chances to see Big Five, witness wildebeest calving during Ndutu calving season. Comfortable mid-range lodges and beautiful sunsets provide safe, enjoyable, memorable safari adventure. Conclude with Zanzibar beach relaxation.', '["Bush and beach combo", "Calving season", "Extended vacation", "Best of both worlds"]'::jsonb, '7 days / 6 nights', 'Arusha • Zanzibar', '[
            "Fly-in to Serengeti saves time",
            "Ndutu calving season viewing",
            "Ngorongoro Crater exploration",
            "Zanzibar beach extension",
            "Makuyuni Wildlife Area"
        ]'::jsonb, '[]'::jsonb, '[
            "Dedicated professional driver-guide",
            "Private 4x4 Toyota Land Cruiser (safari-equipped)",
            "Bottled mineral water during safari",
            "All national park entry fees",
            "All activities in program",
            "Domestic flights (Arusha-Serengeti, Arusha-Zanzibar)",
            "Free round-trip airport transfers",
            "Meals as specified per day"
        ]'::jsonb, '[
            "International flights",
            "Visa fees",
            "Drinks at lodges and camps",
            "Laundry services",
            "Tips and personal expenses",
            "Optional Zanzibar activities",
            "Extra accommodation before/after safari"
        ]'::jsonb, '/images/tours/7-days-wildlife-safari-zanzibar-combo/hero.jpg', 1820, 0, 0, 'Moderate', true, false, 28);

-- Tour 29: 6 Days Kilimanjaro Machame Route - Ethical Ascents
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('6 Days Kilimanjaro Machame Route - Ethical Ascents', '6-days-kilimanjaro-machame-route', 'Trekking', 'Conquer Africa''s highest peak via scenic Machame ''Whiskey'' Route', 'The Machame Route is a popular trekking route known as the ''Whiskey Route'' due to its challenging nature. Considered one of most scenic routes offering stunning views of mountain and surrounding landscape. Takes 6-7 days, best suited for experienced hikers with good physical fitness. Greater chance of acclimatization and higher success rate for reaching summit. Start at Machame Gate, pass through lush forest, reach Shira Plateau, cross Barranco Wall, summit at Uhuru Peak.', '["Experienced trekkers", "Scenic route", "High success rate", "Physical challenge"]'::jsonb, '6 days / 5 nights on mountain', 'Moshi / Arusha', '[
            "Machame ''Whiskey'' Route",
            "Stunning mountain views",
            "Better acclimatization profile",
            "Uhuru Peak summit (5,895m)",
            "Professional mountain guides"
        ]'::jsonb, '[]'::jsonb, '[
            "Arrival and departure transfers from/to Kilimanjaro International Airport",
            "Accommodation during trekking (huts/hotel)",
            "Meals during trekking (breakfast, lunch, dinner)",
            "Professional First Aider trained mountain guide",
            "All park fees, mountain rescue fees, government taxes",
            "Crew team, porters and cook",
            "Transport to and from mountain",
            "Emergency oxygen cylinder",
            "Summit certificates"
        ]'::jsonb, '[
            "International flights",
            "Visa fees",
            "Travel insurance",
            "Personal gear rental",
            "Tips for crew (recommended: $10-15/porter/day, $15-20/cook/day, $20-25/guide/day)",
            "Medical equipment (hyperbaric chamber)",
            "Items of personal nature",
            "Extra accommodation before/after trek"
        ]'::jsonb, '/images/tours/6-days-kilimanjaro-machame-route/hero.jpg', 1850, 0, 0, 'Moderate', true, false, 29);

-- Tour 30: 7 Days Shira Route Trekking - Kilimanjaro Alternative Path
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('7 Days Shira Route Trekking - Kilimanjaro Alternative Path', '7-days-shira-route-trekking', 'Trekking', 'Unique Kilimanjaro trek via Shira Plateau with excellent acclimatization', 'The Shira Route offers a unique approach to Kilimanjaro starting at higher elevation via Shira Plateau. This alternative path provides excellent acclimatization opportunities and stunning volcanic landscapes. Trek through shrubs and giant heather, explore grassy moorland, visit Shira Cathedral rock formation, cross Lava Tower, climb Barranco Wall, and summit at Uhuru Peak. Ideal for trekkers seeking less crowded trails with spectacular scenery.', '["Alternative route", "Acclimatization focus", "Volcanic landscapes", "Less crowded"]'::jsonb, '7 days / 6 nights on mountain', 'Moshi', '[
            "Shira Plateau crossing",
            "Shira Cathedral rock formation",
            "Lava Tower acclimatization",
            "Barranco Wall climb",
            "Uhuru Peak summit (5,895m)"
        ]'::jsonb, '[]'::jsonb, '[
            "Arrival and departure transfers from/to Kilimanjaro International Airport",
            "Accommodation during trekking (tents/camps)",
            "Meals during trekking (breakfast, lunch, dinner - 3 times daily)",
            "Private portable toilet",
            "Professional First Aider trained guide",
            "All park fees, mountain rescue fees, government taxes",
            "Crew team, porters and cook",
            "Highest quality tents (Eureka or Mountain Hardware)",
            "Transport to and from mountain",
            "Emergency oxygen cylinder",
            "Mattress and sleeping bag",
            "Summit certificates"
        ]'::jsonb, '[
            "International flights",
            "Visa fees",
            "Travel insurance",
            "Personal gear beyond provided equipment",
            "Tips for crew (recommended: $10-15/porter/day, $15-20/cook/day, $20-25/guide/day)",
            "Medical equipment (hyperbaric chamber)",
            "Items of personal nature",
            "Extra accommodation before/after trek"
        ]'::jsonb, '/images/tours/7-days-shira-route-trekking/hero.jpg', 2100, 0, 0, 'Moderate', true, false, 30);

-- Tour 31: 8 Days Lemosho Route Kilimanjaro - Most Scenic Trail
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('8 Days Lemosho Route Kilimanjaro - Most Scenic Trail', '8-days-lemosho-route-kilimanjaro', 'Trekking', 'Premium 8-day Kilimanjaro climb via most scenic Lemosho Route', 'The Lemosho Route is considered the most scenic trail on Kilimanjaro, granting panoramic vistas on various sides of the mountain. As one of newer routes, Lemosho is superb choice due to ideal balance of low crowds, beautiful scenery, and high summit success rate. Route approaches from west, beginning with long drive to Londorossi Gate. First two days trek through rainforest to Shira Ridge. Cross entire Shira Plateau west to east in pleasant, relatively flat hike. Crowds low until joining Machame route near Lava Tower. Traverse underneath Southern Ice Field on Southern Circuit before summiting from Barafu. Descent via Mweka route.', '["Most scenic route", "High success rate", "Low crowds", "Premium experience"]'::jsonb, '8 days / 7 nights on mountain', 'Moshi', '[
            "Most scenic Kilimanjaro route",
            "Panoramic mountain vistas",
            "Low crowds and solitude",
            "High summit success rate",
            "Shira Plateau crossing",
            "Southern Circuit traverse"
        ]'::jsonb, '[]'::jsonb, '[
            "Arrival and departure transfers from/to Kilimanjaro International Airport",
            "Accommodation during trekking (premium tents)",
            "Meals during trekking (breakfast, lunch, dinner - 3 times daily)",
            "Private portable toilet",
            "Professional First Aider trained guide",
            "All park fees, mountain rescue fees, government taxes",
            "Crew team, porters and cook",
            "Highest quality tents (Eureka or Mountain Hardware)",
            "Transport to and from mountain",
            "Emergency oxygen cylinder",
            "Mattress and sleeping bag",
            "Summit certificates"
        ]'::jsonb, '[
            "International flights",
            "Visa fees",
            "Travel insurance",
            "Personal gear beyond provided equipment",
            "Tips for crew (recommended: $10-15/porter/day, $15-20/cook/day, $20-25/guide/day)",
            "Medical equipment (hyperbaric chamber)",
            "Items of personal nature",
            "Extra accommodation before/after trek"
        ]'::jsonb, '/images/tours/8-days-lemosho-route-kilimanjaro/hero.jpg', 2400, 0, 0, 'Moderate', true, false, 31);

-- Tour 32: 8 Days Northern Circuit Route Kilimanjaro - Newest & Best
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('8 Days Northern Circuit Route Kilimanjaro - Newest & Best', '8-days-northern-circuit-route', 'Trekking', 'Ultimate 8-day Kilimanjaro experience via newest Northern Circuit Route', 'The Northern Circuit Route is the newest route up Mount Kilimanjaro and arguably the best. Combination of all best elements of other routes rolled into one fantastic hike. Looking for beautiful scenery, plenty of solitude, healthy challenge, and potential to spot wildlife? This is definitely the route. Follows same route as Lemosho for first few days, but rather than sticking to south side of Kibo, turns to little-used northern trails instead. Path virtually devoid of other trekkers - campsites quiet, peaceful, practically deserted. Longer than other trails, gives trekkers chance to take in more of mountain. Hike across awe-inspiring Shira Plateau, catch glimpses of Kibo Peak and Uhuru Summit along way. Provides amazing views down onto open plains north of mountain - seen by only handful of other hikers.', '["Newest route", "Maximum solitude", "Best acclimatization", "Wildlife spotting", "Longest trek"]'::jsonb, '8 days / 7 nights on mountain', 'Moshi / Arusha', '[
            "Newest and longest Kilimanjaro route",
            "Virtually no other trekkers",
            "Northern trails solitude",
            "Amazing northern plains views",
            "Best acclimatization profile",
            "Highest summit success rate"
        ]'::jsonb, '[]'::jsonb, '[
            "Arrival and departure transfers from/to Kilimanjaro International Airport",
            "Accommodation during trekking (premium tents)",
            "Meals during trekking (breakfast, lunch, dinner - 3 times daily)",
            "Private portable toilet",
            "Professional First Aider trained guide",
            "All park fees, mountain rescue fees, government taxes",
            "Crew team, porters and cook",
            "Highest quality tents (Eureka or Mountain Hardware)",
            "Transport to and from mountain",
            "Emergency oxygen cylinder",
            "Mattress and sleeping bag",
            "Summit certificates"
        ]'::jsonb, '[
            "International flights",
            "Visa fees",
            "Travel insurance",
            "Personal gear beyond provided equipment",
            "Tips for crew (recommended: $10-15/porter/day, $15-20/cook/day, $20-25/guide/day)",
            "Medical equipment (hyperbaric chamber)",
            "Items of personal nature",
            "Extra accommodation before/after trek"
        ]'::jsonb, '/images/tours/8-days-northern-circuit-route/hero.jpg', 3300, 0, 0, 'Moderate', true, false, 32);

-- Tour 33: 9-Day Best Honeymoon Safari & Zanzibar Beach Relaxation
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('9-Day Best Honeymoon Safari & Zanzibar Beach Relaxation', '9-day-honeymoon-safari-zanzibar', 'Safari & Beach', 'Ultimate 9-day honeymoon combining Tanzania''s top parks with Zanzibar beaches', 'Enjoy 9-day honeymoon safari & Zanzibar beach holiday exploring Tanzania''s top northern parks. Begin in Tarangire known for majestic baobab trees and large herds of African elephants. Visit Lake Manyara - beautiful park for tree-climbing lions and abundant birdlife. Discover breathtaking Ngorongoro Crater home to endangered black rhinos. Experience Serengeti famed for Great Wildebeest Migration. Conclude on Zanzibar Island relaxing and enjoying peaceful beaches. Perfect romantic combination of wildlife adventure and tropical relaxation.', '["Honeymoon", "Romance", "Luxury experience", "Complete Tanzania", "Bush and beach"]'::jsonb, '9 days / 8 nights', 'Arusha • Zanzibar', '[
            "All 4 northern circuit parks",
            "Great Migration viewing",
            "Ngorongoro Crater exploration",
            "Zanzibar beach extension",
            "Premium accommodations throughout",
            "Perfect for honeymooners"
        ]'::jsonb, '[]'::jsonb, '[
            "All transfers as listed in itinerary",
            "Round-trip airport pick-up and drop-off",
            "Domestic flight from Serengeti to Zanzibar",
            "Dedicated professional driver-guide",
            "Private 4x4 Toyota Land Cruiser (safari-equipped)",
            "Bottled mineral water during safari",
            "All national park entry fees",
            "All activities listed in program",
            "Meals as specified per day"
        ]'::jsonb, '[
            "International flights",
            "Visa fees",
            "Drinks at lodges and camps",
            "Laundry services",
            "Tips and personal expenses",
            "Anything not clearly listed as included",
            "Extra accommodation before/after safari"
        ]'::jsonb, '/images/tours/9-day-honeymoon-safari-zanzibar/hero.jpg', 4902, 0, 0, 'Moderate', true, false, 33);