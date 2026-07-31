# Project: Senza Luce Safaris UI/UX Improvements & Tab Navigation

## Architecture & Scope
Comprehensive UI/UX polish, mobile responsiveness fixes, text contrast corrections, touch target anchors, and tab navigation across Vehicles, Support, Contact, and Destination Detail pages.

## Milestones
| # | Name | Requirements | Scope / Key Target Files | Status |
|---|------|--------------|-------------------------|--------|
| 1 | Vehicles & Vehicle Modal Polish | R1 & R4 | Vehicle Modal component, `/vehicles` page hero, review badges, bottom padding | DONE |
| 2 | Support & Contact Pages Polish | R2 & R3 | `/support` page (search bar, contact cards, FAQ accordion/pills, pb-28), `/contact` page (hero gradient, cards margin, input min-height/muted placeholders, radio/checkbox spacing, hide floating CTA button) | DONE |
| 3 | Destination Detail Tab Navigation | R5 | `/destinations/[slug]` page & sub-components (hero gradient mask, sticky blurred tab nav, tab panels: Overview, Wildlife, Experiences, Best Time, Where to Stay, Sample Itineraries, Travel Info, `?tab=` query sync) | DONE |
| 4 | Verification, Build & Audit | All | `npm run build` pass, Reviewer & Forensic Audit verification | DONE |

## Interface & Design Contracts
- **Vehicle Modal**: Z-index above floating CTA bar (`z-[60]` / `z-50`), sticky book button above CTA, X close button top-right, bottom gradient overlay on header image, 2-col / scrollable key metrics on mobile, `grid-cols-[40%_60%]` specs table with zebra stripes.
- **Support Page**: Search bar under hero subheading, 2-col/scroll contact cards wrapped in `<Link>`/`<a>` full card anchors, elevated contrast & clear buttons, category sticky filter pills + collapsible accordion for FAQs, `pb-28` container padding.
- **Contact Page**: Fix mobile negative margin overlap, darker hero gradient, muted placeholders, `min-h-[48px]` inputs, wider checkbox/radio gap, hide or adapt middle "Enquire Now" CTA button on `/contact` route in floating CTA bar.
- **Vehicles Page**: Dark hero gradient, zero-review star hiding / "New Addition" badge, `pb-24` padding offset.
- **Destinations Detail**: Darker hero image gradient, 7 interactive tabs (Overview default), `?tab=...` URL sync, sticky blurred header, mobile scrollable container.
