# Safari Pricing & Booking System - Testing Guide

## Quick Test Checklist

### 1. Test Pricing Engine (Manual Verification)

Open browser console on any page and run:

```javascript
// Import won't work in browser, but you can verify calculations manually
// Test Case 1: Solo traveler, mid-range
// Base: $2,450, Travelers: 1, Accommodation: mid-range (1.0x)
// Expected: $2,450 per person, $2,450 total, 0% discount

// Test Case 2: Couple, luxury
// Base: $2,450, Travelers: 2, Accommodation: luxury (1.4x)
// Calculation: $2,450 × 1.4 = $3,430, 5% discount = $171.50 off
// Expected: $3,259 per person, $6,518 total, 5% discount

// Test Case 3: Small group, budget
// Base: $2,450, Travelers: 4, Accommodation: budget (0.85x)
// Calculation: $2,450 × 0.85 = $2,082.50, 10% discount = $208.25 off
// Expected: $1,874 per person, $7,496 total, 10% discount
```

### 2. Test Booking Flow - Tour Cards

**Steps:**
1. Navigate to homepage
2. Scroll to "Featured Safaris" section
3. Click "Book Now" on any tour card
4. **Expected:** Booking modal opens with complete tour details
5. Verify modal shows:
   - ✅ Tour name and image
   - ✅ Duration and locations
   - ✅ Rating and reviews
   - ✅ Highlights
   - ✅ Traveler count selector (default: 2)
   - ✅ Accommodation level buttons
   - ✅ Pricing breakdown
   - ✅ "Inquire About This Safari" button

**Test Different Scenarios:**
- [ ] Change travelers to 1 → Price should increase per person
- [ ] Change travelers to 5 → Should show 15% discount
- [ ] Change to "Luxury" → Price should increase by 40%
- [ ] Change to "Budget" → Price should decrease by 15%
- [ ] Click "Inquire About This Safari" → Should navigate to enquiry form with package data

### 3. Test Booking Flow - Tour Detail Page

**Steps:**
1. Navigate to `/safaris-tours`
2. Click on any tour to view details
3. Scroll to bottom sticky CTA bar
4. Click "Book Now" button
5. **Expected:** Same booking modal opens with full tour data
6. **Expected:** "Customize" button links to `/enquiry` with package params

**Verify URL params on Customize click:**
```
/enquiry?package=5%20Days%20Tanzania%20Wildlife%20Safari&slug=5-days-wildlife&duration=5%20days%20%2F%204%20nights&basePrice=2450&category=Wildlife%20Safari
```

### 4. Test Enquiry Form with Package Context

**Steps:**
1. From booking modal, click "Inquire About This Safari"
2. **Expected:** Enquiry form opens with:
   - ✅ Package summary banner at top
   - ✅ Package name prominently displayed
   - ✅ Duration, travelers, category shown
   - ✅ Pricing breakdown box with calculations
   - ✅ Message field auto-filled with package details
   - ✅ Number of travelers field pre-filled
   - ✅ Safari type field pre-filled

**Verify Package Summary Banner shows:**
```
You're Inquiring About:
5 Days Tanzania Wildlife Safari

Duration: 5 days / 4 nights
Travelers: 3 people
Category: Wildlife Safari

Pricing Breakdown:
Base price: $2,450 /person
Group discount: -10%
Your price: $2,205 /person
Estimated Total: $6,615

Note: This is an inquiry, not a confirmed booking...
```

### 5. Test Enquiry Form without Package Context

**Steps:**
1. Navigate directly to `/enquiry` (no URL params)
2. **Expected:** 
   - ✅ No package summary banner
   - ✅ Standard safari type dropdown
   - ✅ All form fields empty
   - ✅ Form works normally for general inquiries

### 6. Test PDF Generation

**Steps:**
1. Complete and submit enquiry form with package context
2. After submission, click "Download Booking Details (PDF)"
3. Open downloaded PDF
4. **Expected sections:**
   - ✅ Senza Luce Safaris header
   - ✅ Safari Inquiry title
   - ✅ Booking reference (SLS-XXXXXXXX)
   - ✅ Contact Information section
   - ✅ Safari Details section with package name
   - ✅ **Pricing Breakdown section** (new!)
     - Base price
     - Group discount
     - Estimated total
   - ✅ Preferences section
   - ✅ Location data (if permission granted)

### 7. Test All Tour Packages

Test booking flow for at least one tour from each category:

**Wildlife Safari:**
- [ ] 5 Days Tanzania Wildlife Safari
- [ ] Any other wildlife safari

**Safari & Beach:**
- [ ] 9 Days Safari + Zanzibar Beach Experience
- [ ] Any other beach package

**Trekking:**
- [ ] Mount Kilimanjaro Trekking (any route)
- [ ] Any other trekking package

### 8. Test Edge Cases

**Solo Traveler:**
- [ ] Set travelers to 1
- [ ] Verify NO discount applied
- [ ] Verify NO savings message shown
- [ ] Price should equal base price × accommodation multiplier

**Maximum Group:**
- [ ] Set travelers to 20
- [ ] Verify 25% discount applied
- [ ] Verify "Premium Group" tier shown
- [ ] Total price calculation correct

**Boundary Testing:**
- [ ] Try setting travelers to 0 → Should not go below 1
- [ ] Try setting travelers to 21 → Should not go above 20
- [ ] Test all 4 accommodation levels work correctly

### 9. Test Responsive Design

**Mobile (375px width):**
- [ ] Booking modal displays correctly
- [ ] Traveler selector buttons are touch-friendly
- [ ] Accommodation buttons stack properly
- [ ] Pricing breakdown readable
- [ ] Enquiry form package banner responsive
- [ ] All buttons easily tappable

**Tablet (768px width):**
- [ ] Two-column layouts work
- [ ] Modal sizing appropriate
- [ ] All elements properly spaced

**Desktop (1440px width):**
- [ ] Full-width modal with max-width constraint
- [ ] Multi-column pricing display
- [ ] Hover states work on buttons

### 10. Test Dark Mode

**Steps:**
1. Toggle to dark mode
2. Test booking modal
3. Test enquiry form with package banner
4. **Expected:**
   - ✅ All text readable
   - ✅ Background colors appropriate
   - ✅ Borders and shadows visible
   - ✅ Pricing breakdown box styled correctly
   - ✅ No white backgrounds on dark mode (except intentional cards)

---

## Automated Testing (Future Enhancement)

### Unit Tests for Pricing Engine

```typescript
// pricing-engine.test.ts
import { calculateSafariPrice, calculateSavings } from './pricing-engine';

describe('Pricing Engine', () => {
  test('Solo traveler pays base price', () => {
    const result = calculateSafariPrice(2450, 1);
    expect(result.pricePerPerson).toBe(2450);
    expect(result.discountPercent).toBe(0);
    expect(result.travelers).toBe(1);
  });

  test('Couple gets 5% discount', () => {
    const result = calculateSafariPrice(2450, 2);
    expect(result.discountPercent).toBe(5);
    expect(result.pricePerPerson).toBe(2328); // 2450 * 0.95
  });

  test('Small group (3-4) gets 10% discount', () => {
    const result = calculateSafariPrice(2450, 3);
    expect(result.discountPercent).toBe(10);
    expect(result.pricePerPerson).toBe(2205); // 2450 * 0.90
  });

  test('Luxury accommodation increases price by 40%', () => {
    const result = calculateSafariPrice(2450, 2, 'luxury');
    expect(result.basePrice).toBe(3430); // 2450 * 1.4
  });

  test('Budget accommodation decreases price by 15%', () => {
    const result = calculateSafariPrice(2450, 2, 'budget');
    expect(result.basePrice).toBe(2083); // 2450 * 0.85 (rounded)
  });

  test('Calculate savings correctly', () => {
    const savings = calculateSavings(2450, 3);
    expect(savings).toBe(735); // 3 * 2450 - (3 * 2205)
  });
});
```

---

## Performance Testing

### Load Time Expectations

- **Booking Modal Open:** < 200ms
- **Price Calculation:** < 10ms (instant)
- **Traveler Count Change:** < 50ms (instant UI update)
- **Accommodation Change:** < 50ms (instant UI update)
- **Enquiry Form Load:** < 500ms (with package context)
- **PDF Generation:** < 1 second

### Browser Console Checks

Open DevTools Console and verify:
- ✅ No errors on page load
- ✅ No errors when opening booking modal
- ✅ No errors when changing travelers/accommodation
- ✅ No errors when navigating to enquiry form
- ✅ No TypeScript runtime errors

---

## Integration Testing (With Backend - Future)

When backend is ready, test:

1. **Form Submission:**
   - Enquiry data sent to API endpoint
   - Response handled correctly
   - Error states managed

2. **Email Notifications:**
   - Confirmation email sent to user
   - Notification email sent to admin
   - PDF attached to emails

3. **Booking Management:**
   - Inquiry appears in admin dashboard
   - Status tracking works
   - Customer can view inquiry status

---

## Known Limitations (Current Version)

1. **No Real-Time Availability:**
   - Pricing assumes availability
   - Backend integration needed for real-time checks

2. **No Payment Processing:**
   - Inquiry-only system
   - No deposits collected
   - Manual quote process

3. **No Seasonal Pricing:**
   - Fixed pricing year-round
   - Can be enhanced with seasonal multipliers

4. **No Child Pricing:**
   - All travelers charged same rate
   - Can add age-based pricing later

---

## Success Criteria

The system is working correctly if:

✅ Users can select traveler count and see updated prices instantly  
✅ Group discounts apply at correct thresholds  
✅ Accommodation level changes affect pricing  
✅ Package context preserved throughout entire booking flow  
✅ Enquiry form shows complete package summary and pricing  
✅ PDF includes pricing breakdown  
✅ No generic contact page redirects for package bookings  
✅ All 33 tour packages work with booking system  
✅ Mobile, tablet, and desktop experiences are excellent  
✅ Dark mode fully supported  
✅ Zero TypeScript compilation errors  
✅ Fast, responsive UI with instant price updates  

---

## Reporting Issues

If you find any issues during testing, please report:

1. **Steps to reproduce**
2. **Expected behavior**
3. **Actual behavior**
4. **Screenshots** (if applicable)
5. **Browser and device** used
6. **Console errors** (if any)

---

**Last Updated:** April 6, 2026  
**System Version:** 1.0.0  
**Status:** Ready for Production Testing
