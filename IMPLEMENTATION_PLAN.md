# Senza Luce Safaris - Complete Tanview-Style Redesign Implementation Plan

## ✅ COMPLETED (Step 1):

### Design System Overhaul
- [x] Changed primary color from gold (#D4AF37) to warm coral/orange (#FF6B4A equivalent in OKLCH)
- [x] Updated typography from Montserrat to Poppins (cleaner, more minimalist)
- [x] Simplified button styles (removed gradients, shimmers, shadows)
- [x] Reduced card shadow intensity (from dramatic to subtle)
- [x] Changed border radius from xl to lg (more conservative)
- [x] Updated scrollbar to minimalist design
- [x] Reduced hero section height for cleaner look
- [x] Simplified all animations and transitions

**Files Modified:**
- `src/app/globals.css` - Complete color palette and typography update
- `src/components/home/hero-section.tsx` - Cleaner, simpler hero

---

## 🔄 IN PROGRESS (Steps 2-8):

### Step 2: Add Safari Categories Section
**Location**: Create new component `src/components/home/safari-categories-section.tsx`

**Features to Include:**
- 4 Category Cards:
  1. Wildlife Safaris (icon: paw/elephant)
  2. Climbing Kilimanjaro (icon: mountain)
  3. Beach Holidays (icon: umbrella/waves)
  4. Cultural Experiences (icon: users/music)

**Design Specs:**
- White cards with subtle borders
- Icon on top (colored in primary orange)
- Title below icon
- Short description
- "Learn More" link or arrow
- Grid layout: 2x2 on mobile, 4-across on desktop

---

### Step 3: Add Accommodation Section
**Location**: Create `src/components/home/accommodations-section.tsx`

**Features:**
- 3-Tier Display:
  1. Luxury Lodges ($740/night, 9.2 rating)
  2. Mid-range ($520/night, 8.6 rating)
  3. Budget ($260/night, 7.8 rating)

**Each Card Includes:**
- Image header
- Title + Rating badge (e.g., "9.2 - Exceptional")
- Amenity icons (meals, wifi, pool, A/C)
- Starting price
- "View [Category]" button

---

### Step 4: Add FAQ Section
**Location**: Create `src/components/home/faq-section.tsx`

**Questions to Include:**
1. What is included in a typical safari package?
2. How can I book a safari?
3. Are safaris customizable?
4. What is the best time to visit Tanzania?
5. Is Tanzania safe for safari travelers?

**Design:**
- Accordion-style expandable questions
- Clean, simple answers
- Plus/minus icons for expansion
- Max-width centered layout

---

### Step 5: Add Experience/Comfort Section
**Location**: Create `src/components/home/experience-section.tsx`

**Content:**
- "Enjoy Your Tanzania Safari with Comfort"
- 4 Key Points:
  1. Safety & comfort first
  2. Expert local guides
  3. Tailor-made itineraries
  4. Simple & flexible booking
- Supporting images (wildlife gallery)
- "Know More" CTA linking to About page

---

### Step 6: Add Image Gallery/Carousel
**Location**: Create `src/components/ui/image-carousel.tsx`

**Features:**
- Auto-sliding carousel
- 3-5 wildlife images
- Navigation arrows
- Dot indicators
- Smooth transitions
- Responsive sizing

---

### Step 7: Update Tour Cards with Pricing
**Modify**: `src/components/home/featured-tours-section.tsx`

**Add to Each Card:**
- Duration badge (already present)
- Price display: "From $XXX per person"
- Rating score (optional for now)
- Itinerary highlights as bullet points

---

### Step 8: Add Rating Systems
**Data Structure Update**: Modify tour data files

**Add Fields:**
- `rating: number` (e.g., 9.2)
- `reviewCount: number` (e.g., 127)
- `priceFrom: number` (e.g., 2500)

**Display On:**
- Tour cards
- Destination cards
- Accommodation cards

---

## 📋 REMAINING DESIGN UPDATES:

### Header Component
- Simplify logo gradient
- Reduce navigation hover effects
- Make buttons flatter

### Footer Component  
- Simplify social icons
- Reduce ornamentation
- Clean up link spacing

### All Pages
- Ensure consistent padding/margins
- Verify responsive breakpoints
- Test on mobile devices

---

## 🎯 SUCCESS CRITERIA:

The redesign will be complete when:
1. ✅ Color palette matches Tanview's warm earth tones
2. ✅ Typography is clean and readable (Poppins + Inter)
3. ✅ Buttons are flat with minimal shadows
4. ✅ Cards have subtle, clean styling
5. ✅ All 8 missing features are implemented
6. ✅ Website is fully responsive
7. ✅ No flashy/luxury effects remain
8. ✅ Overall feel is minimalist safari professionalism

---

## 📊 IMPLEMENTATION CHECKLIST:

- [x] Step 1: Design System
- [ ] Step 2: Safari Categories
- [ ] Step 3: Accommodations
- [ ] Step 4: FAQ Section
- [ ] Step 5: Experience Section
- [ ] Step 6: Image Carousel
- [ ] Step 7: Tour Pricing
- [ ] Step 8: Rating Systems
- [ ] Final Polish & Testing

---

**Next Action:** Continue with Step 2 - Create Safari Categories Section component.
