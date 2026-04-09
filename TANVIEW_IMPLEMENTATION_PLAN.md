# Tanview Safaris Clone - Implementation Plan

## Project Overview
**Goal:** Transform Senza Luce Safaris website to match TanviewSafaris.com design and functionality exactly.

**Reference Screenshots Analyzed:**
- ✅ Home page layout
- ✅ Destinations page  
- ✅ Safari & Tours page
- ✅ About Us page
- ✅ Contact Us section
- ✅ Enquiry Now form
- ✅ Footer structure
- ✅ Blog/News quick links
- ✅ FAQs navigation
- ✅ Our Vehicles quick link

---

## Completed Tasks ✅

### 1. Color Scheme Update ✅
**Status:** COMPLETE
- Changed primary color to Tanview Safari Green: `oklch(0.65 0.15 130)`
- Updated secondary to Light Sage: `oklch(0.92 0.04 130)`
- Accent: Golden Orange: `oklch(0.72 0.16 65)`
- Background: Off-white: `oklch(0.995 0.002 95)`
- Border radius increased to `0.75rem` for softer look

**Files Modified:**
- `src/app/globals.css` - All CSS variables updated

### 2. Button Styles ✅
**Status:** COMPLETE
- Created `.btn-safari` - Green pill-shaped buttons with shadow
- Created `.btn-outline` - White outline variant
- Hover effects with translateY(-2px) and enhanced shadows
- Rounded-full (pill shape) matching Tanview

### 3. Card Styles ✅
**Status:** COMPLETE
- `.safari-card` - White cards with subtle shadows, rounded-xl
- `.destination-card` - Enhanced hover effects with overlay
- Smooth transitions with cubic-bezier easing
- Border color changes on hover

### 4. Header Redesign ✅
**Status:** COMPLETE
- Added top bar with contact info (phone, email, location)
- Two-line logo: "Senza Luce" (bold) + "Safaris" (uppercase small)
- Desktop navigation with underline hover effect
- Green pill "Enquiry Now" button
- Mobile drawer menu with full contact info

**Files Modified:**
- `src/components/layout/header.tsx` - Complete redesign

### 5. Hero Section ✅
**Status:** COMPLETE
- Full-screen video background (already existed)
- Centered text: "Experience the Magic of Tanzania"
- Large heading (text-8xl on desktop)
- Two CTAs: Green pill button + Outline button
- Scroll indicator at bottom

**Files Modified:**
- `src/components/home/hero-section.tsx` - Updated button styles

---

## Pending Tasks 📋

### Priority 1: Core Components (Critical)

#### Task 4: Destination Cards Matching Tanview Style 🔴 HIGH
**Reference:** `destinations page.png`

**Requirements:**
- Grid layout: 3 columns on desktop, 2 on tablet, 1 on mobile
- Each card features:
  - Large hero image (aspect-ratio 16/10)
  - Badge in top-right corner (e.g., "Elephant Haven", "Great Migration")
  - Title with location pin icon
  - Short description (2-3 lines)
  - Feature badges (icons + text): e.g., "Baobab", "3,000+ Elephants", "550 Birds"
  - "Best time" badge
  - "Discover →" link with arrow
  
**Implementation Plan:**
1. Create new `DestinationCard` component
2. Update `/destinations/page.tsx` to use new card design
3. Add feature badge system with icons
4. Implement hover overlay effect

**Estimated Time:** 2-3 hours

---

#### Task 5: Tour Package Cards with Pricing Badges 🔴 HIGH
**Reference:** `safari & tour page.png`

**Requirements:**
- List/grid view toggle (optional)
- Each tour card includes:
  - Image gallery (main image + thumbnail count)
  - Duration badge (e.g., "5 Days")
  - Price badge (top-right, prominent)
  - Title
  - Rating stars + review count
  - Short description
  - Feature tags (e.g., "Game Drive", "Accommodation")
  - Two buttons: "Book Now" (green) + "Details" (outline)
  
**Implementation Plan:**
1. Create `TourCard` component with pricing badge
2. Update `/safaris-tours/page.tsx` 
3. Add filter sidebar (duration, price, type)
4. Implement sorting options

**Estimated Time:** 3-4 hours

---

#### Task 6: Advanced Enquiry Form 🔴 CRITICAL
**Reference:** `enquire now page (button).png`, `contact us section.png`

**Requirements:**
Multi-step or comprehensive single-page form with:

**Section 1: Personal Info**
- Full Name (First + Last)
- Email
- Phone
- Country

**Section 2: Trip Details**
- Trip Type (dropdown: Classic Safari, Beach Holiday, Trekking, etc.)
- Destinations (checkboxes: Serengeti, Ngorongoro, Kilimanjaro, Zanzibar, etc.)
- Flexible Dates (radio: Yes/No)
- Start Date / End Date (date pickers)
- Adults count (+/- buttons)
- Children count + ages
- Accommodation Level (dropdown: Budget, Mid-range, Luxury)

**Section 3: Preferences**
- Vehicle Preference (dropdown: 4x4 Safari Jeep, Minivan, etc.)
- Activity Interests (checkboxes: Game Drives, Hot Air Balloon, Walking Safari, Night Safari, Cultural Visit, Beach Relaxation, Mountain Hiking, Diving/Snorkeling)
- Budget Range (slider or input: USD)
- Payment Preference (dropdown)
- Pickup/Drop-off Location
- Dietary Requirements (textarea)
- Medical Conditions (textarea)
- Special Requests (textarea)

**Features:**
- Form validation
- Progress indicator (if multi-step)
- Success confirmation modal
- Email notification to admin
- Save to database/CRM

**Implementation Plan:**
1. Create `EnquiryForm` component with all fields
2. Add form validation with react-hook-form
3. Create API route to handle submissions
4. Set up email notifications (Resend/SendGrid)
5. Add success/error states

**Estimated Time:** 6-8 hours

---

#### Task 7: Footer Redesign 🔴 HIGH
**Reference:** All screenshots show consistent footer

**Requirements:**
4-column layout on desktop, stacked on mobile:

**Column 1: Company Info**
- Logo (white version)
- Tagline: "Crafting unforgettable journeys through Tanzania's wilderness and culture"
- Social media icons (Facebook, Instagram, Twitter, TikTok)

**Column 2: Company Links**
- Home
- About Us
- Tours & Safaris
- Contact Us
- Our Vehicles

**Column 3: Quick Links**
- Support
- Privacy Policy
- Terms & Condition
- FAQ
- Blog & News

**Column 4: Contact**
- Phone: +255 789 918 540
- Email: info@tanviewsafaris.com
- Location: Arusha-Tanzania
- WhatsApp button

**Bottom Bar:**
- Copyright: "Copyright © 2026 All Right Reserved Tanview Safaris"
- Payment method icons (optional)

**Implementation Plan:**
1. Update `src/components/layout/footer.tsx`
2. Add social media icons
3. Make all links functional
4. Add WhatsApp integration

**Estimated Time:** 2 hours

---

### Priority 2: Additional Pages (Important)

#### Task 8: Missing Pages 🟡 MEDIUM

**Pages to Create:**

**A. Blog & News Page**
- Grid of blog posts
- Featured post (large)
- Categories sidebar
- Search functionality
- Pagination

**B. Our Vehicles Page**
- Gallery of safari vehicles
- Specifications for each vehicle
- Capacity, features, amenities
- Booking CTA

**C. FAQ Page**
- Accordion-style Q&A
- Categories (Booking, Safari, Payment, Safety, etc.)
- Search/filter questions
- "Still have questions?" contact CTA

**D. Individual Destination Detail Pages**
Already exist but need redesign to match Tanview style:
- Hero image with overlay title
- Description
- Highlights with icons
- Best time to visit calendar
- Suggested itineraries
- Photo gallery
- Map integration
- Related tours

**E. Individual Tour Detail Pages**
Already exist but need redesign:
- Image gallery
- Pricing table
- Day-by-day itinerary (collapsible)
- What's included/excluded
- Booking form sidebar
- Reviews section
- Similar tours

**Estimated Time:** 12-16 hours total

---

### Priority 3: Responsive & Polish (Essential)

#### Task 9: Full Responsiveness 🟢 REQUIRED
**Status:** Partially complete, needs refinement

**Checklist:**
- [ ] Test all pages on iPhone SE (375px)
- [ ] Test on iPhone 14 Pro (393px)
- [ ] Test on iPad (768px)
- [ ] Test on iPad Pro (1024px)
- [ ] Test on laptop (1366px)
- [ ] Test on desktop (1920px+)
- [ ] Fix any horizontal scrolling
- [ ] Ensure touch targets ≥ 44px
- [ ] Optimize images for each breakpoint
- [ ] Test navigation on all devices

**Estimated Time:** 4-6 hours

---

## Implementation Strategy

### Phase 1: Foundation (Days 1-2) ✅ STARTED
- [x] Color scheme
- [x] Typography
- [x] Buttons
- [x] Cards
- [x] Header
- [x] Hero section
- [ ] Footer
- [ ] Basic responsive fixes

### Phase 2: Core Components (Days 3-5)
- [ ] Destination cards
- [ ] Tour package cards
- [ ] Enquiry form
- [ ] Filter/search systems

### Phase 3: Content Pages (Days 6-8)
- [ ] Blog page
- [ ] Vehicles page
- [ ] FAQ page
- [ ] Enhanced destination details
- [ ] Enhanced tour details

### Phase 4: Polish & Testing (Days 9-10)
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Final responsive checks
- [ ] Bug fixes

---

## Technical Stack

**Current:**
- Next.js 16.2.2
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide React icons

**To Add:**
- `react-hook-form` - Form handling
- `zod` - Schema validation
- `resend` or `sendgrid` - Email notifications
- `date-fns` - Date formatting
- `framer-motion` - Smooth animations (optional)

---

## File Structure (Target)

```
senzalucesafaris/
├── src/
│   ├── app/
│   │   ├── about/
│   │   ├── blog/              # NEW
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── contact/
│   │   ├── destinations/
│   │   │   ├── page.tsx       # UPDATE
│   │   │   └── [slug]/page.tsx # UPDATE
│   │   ├── faq/               # NEW
│   │   │   └── page.tsx
│   │   ├── safaris-tours/
│   │   │   ├── page.tsx       # UPDATE
│   │   │   └── [slug]/page.tsx # UPDATE
│   │   ├── vehicles/          # NEW
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   └── enquiry/route.ts # NEW
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── home/
│   │   ├── layout/
│   │   │   ├── header.tsx     ✅ UPDATED
│   │   │   └── footer.tsx     # UPDATE
│   │   ├── ui/
│   │   │   ├── destination-card.tsx    # NEW
│   │   │   ├── tour-card.tsx           # NEW
│   │   │   ├── enquiry-form.tsx        # NEW
│   │   │   └── ...
│   │   └── sections/
│   │       ├── featured-destinations.tsx  # NEW
│   │       ├── popular-tours.tsx          # NEW
│   │       └── ...
│   ├── data/
│   │   ├── company.ts
│   │   ├── destinations.ts
│   │   ├── tours.ts
│   │   ├── vehicles.ts         # NEW
│   │   ├── blog.ts             # NEW
│   │   └── faq.ts              # NEW
│   └── lib/
│       ├── utils.ts
│       └── validations.ts      # NEW
└── public/
    ├── videos/
    │   └── hero-video.mp4      ✅ EXISTS
    └── images/
```

---

## Next Immediate Actions

1. **Update Footer** (2 hours)
   - Match Tanview 4-column layout
   - Add all links and contact info
   - Add social media icons

2. **Create Destination Card Component** (3 hours)
   - Build reusable component
   - Add feature badges
   - Implement hover effects

3. **Create Tour Card Component** (4 hours)
   - Build with pricing badge
   - Add duration/rating display
   - Include action buttons

4. **Build Enquiry Form** (8 hours)
   - Multi-section form
   - Validation
   - API integration
   - Email notifications

5. **Test & Refine** (ongoing)
   - Check all pages load
   - Fix any styling issues
   - Ensure responsiveness

---

## Success Metrics

- ✅ Visual match to TanviewSafaris.com screenshots
- ✅ All pages fully responsive
- ✅ Forms functional with validation
- ✅ No console errors
- ✅ Fast load times (<2s)
- ✅ High Lighthouse scores (>90)

---

**Last Updated:** April 4, 2026  
**Progress:** 30% Complete  
**Next Milestone:** Complete core components (Tasks 4-7)
