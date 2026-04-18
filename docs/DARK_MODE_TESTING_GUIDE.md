# 🧪 Dark Mode Testing Guide

**Quick Reference for Testing Dark Mode Implementation**

---

## 🚀 Quick Start

1. **Open your browser:** http://localhost:3000
2. **Look for theme toggle:** Sun/Moon icon in top-right header
3. **Click it!** Watch the magic happen ✨

---

## ✅ Test Checklist

### 1. Theme Toggle Functionality

- [ ] Click theme toggle button
- [ ] Page smoothly transitions to dark mode
- [ ] Icon changes (Sun ↔ Moon)
- [ ] Refresh page - preference persists
- [ ] Toggle back to light mode
- [ ] Everything looks good in both modes

---

### 2. Homepage Testing

#### Hero Section
- [ ] Video background visible
- [ ] Text readable over video
- [ ] "INQUIRE NOW" button stands out
- [ ] No white flashes or glitches

#### Safari Categories
- [ ] Cards have proper background color
- [ ] Images load with blur placeholder
- [ ] Hover effects work
- [ ] Text readable on cards

#### Experience Section
- [ ] Background matches theme
- [ ] Image and text layout correct
- [ ] No harsh white backgrounds

#### Featured Tours
- [ ] Tour cards properly themed
- [ ] Prices and badges visible
- [ ] Gradient background smooth

#### FAQ Section
- [ ] Accordion items themed correctly
- [ ] Expand/collapse works
- [ ] Text readable when expanded

---

### 3. Navigation Testing

#### Desktop Navigation
- [ ] "Home" link is GONE from menu
- [ ] Logo visible and clickable
- [ ] Click logo → goes to homepage
- [ ] All other links work
- [ ] Active page highlighted
- [ ] Header background adapts to theme

#### Mobile Navigation
- [ ] Hamburger menu works
- [ ] Menu opens smoothly
- [ ] Theme toggle visible in menu
- [ ] All links accessible
- [ ] Close button works

---

### 4. Other Pages

#### Destinations Page
- [ ] Filter buttons themed
- [ ] Destination cards look good
- [ ] Feature badges visible
- [ ] No white backgrounds

#### Safaris & Tours Page
- [ ] Tour cards properly styled
- [ ] Filters themed correctly
- [ ] CTA buttons visible

#### Vehicles Page
- [ ] Vehicle cards themed
- [ ] Tab buttons adapt
- [ ] Specs readable

#### Blog Page
- [ ] Article cards look good
- [ ] Category badges visible
- [ ] Read more buttons themed

#### Contact Page
- [ ] Info cards themed
- [ ] Form inputs readable
- [ ] Submit button visible

#### FAQ Page
- [ ] Category cards themed
- [ ] Questions expand properly
- [ ] Search input readable

---

### 5. Component Testing

#### Cards
- [ ] Safari cards (tour-card.tsx)
- [ ] Destination cards (destination-card.tsx)
- [ ] Blog article cards
- [ ] Vehicle cards
- [ ] All have consistent backgrounds

#### Forms
- [ ] Enquiry form sections themed
- [ ] Input fields readable
- [ ] Labels visible
- [ ] Buttons stand out

#### Badges & Tags
- [ ] Category badges
- [ ] Feature tags
- [ ] Price labels
- [ ] All use theme colors

---

### 6. Color Consistency Check

#### Light Mode Should Have:
- [ ] White/off-white backgrounds
- [ ] Dark text (#1a1a1a or similar)
- [ ] Green primary buttons
- [ ] Subtle shadows

#### Dark Mode Should Have:
- [ ] Deep charcoal backgrounds (not pure black)
- [ ] Light text (#f5f5f5 or similar)
- [ ] Bright green primary buttons
- [ ] Subtle depth with card shadows

#### Common Elements (Both Modes):
- [ ] Primary color = GREEN (not gold/orange)
- [ ] Accent color = Golden orange (sparingly used)
- [ ] Borders subtle but visible
- [ ] Hover states obvious

---

### 7. Accessibility Testing

#### Keyboard Navigation
- [ ] Press `Tab` key
- [ ] Skip link appears (top-left)
- [ ] Can navigate entire page
- [ ] Focus indicators visible

#### Screen Reader
- [ ] Logo has ARIA label
- [ ] Buttons have labels
- [ ] Links descriptive
- [ ] Images have alt text

#### Contrast Check
- [ ] Install "WAVE" browser extension
- [ ] Run audit on homepage
- [ ] No contrast errors
- [ ] All text readable

---

### 8. Responsive Testing

#### Mobile (320px - 480px)
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar
- [ ] Select iPhone SE (375px)
- [ ] All content visible
- [ ] No horizontal scroll
- [ ] Touch targets ≥44px
- [ ] Theme toggle accessible

#### Tablet (768px)
- [ ] Select iPad (768px)
- [ ] Grid layouts adapt
- [ ] Images scale properly
- [ ] Navigation works

#### Desktop (1024px+)
- [ ] Full navigation visible
- [ ] Container centered
- [ ] Max-width respected
- [ ] Everything aligned

---

### 9. Performance Testing

#### Load Time
- [ ] Page loads quickly (<2s)
- [ ] No layout shifts
- [ ] Images lazy load
- [ ] Smooth scrolling

#### Theme Switch
- [ ] Instant transition
- [ ] No flickering
- [ ] No FOUC (flash of unstyled content)

---

## 🐛 Common Issues & Fixes

### Issue: White backgrounds still showing
**Solution:** Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: Theme doesn't persist after refresh
**Solution:** Check localStorage in DevTools → Application → Local Storage

### Issue: Some components still white
**Solution:** Check if they're using hardcoded `bg-white` instead of `bg-card`

### Issue: Text hard to read in dark mode
**Solution:** Verify CSS variables are being used, not hardcoded colors

### Issue: Header still white
**Solution:** Clear cache and reload

---

## 📸 Screenshot Comparison

Take screenshots of these pages in BOTH modes:

1. Homepage (full page)
2. Destinations page
3. Contact page
4. Any tour detail page

Compare side-by-side to ensure:
- ✅ Consistent color scheme
- ✅ Good contrast everywhere
- ✅ Professional appearance
- ✅ No jarring elements

---

## ✅ Final Verification

Before marking as complete:

- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on Safari (if available)
- [ ] Tested on mobile device
- [ ] Tested on tablet (if available)
- [ ] No console errors
- [ ] No visual glitches
- [ ] Smooth animations
- [ ] Fast performance

---

## 🎯 Success Criteria

Dark mode implementation is successful if:

1. ✅ **Visual Quality:** Looks professional and polished
2. ✅ **Consistency:** Same color system throughout
3. ✅ **Accessibility:** WCAG AA/AAA compliant
4. ✅ **Functionality:** Toggle works perfectly
5. ✅ **Performance:** No slowdowns
6. ✅ **Responsiveness:** Works on all devices

---

## 📞 Need Help?

If you find issues:

1. **Check this guide first** - most issues covered here
2. **Open DevTools Console** - look for errors
3. **Inspect element** - verify CSS classes
4. **Check globals.css** - verify color variables
5. **Review modified files** - see DARK_MODE_AND_NAVIGATION_FIX_COMPLETE.md

---

**Happy Testing! 🎉**
