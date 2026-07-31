# Original User Request

## Initial Request — 2026-07-31T11:29:11Z

Implement comprehensive UI/UX improvements, mobile responsiveness fixes, text contrast corrections, full-card touch target anchors, and tab navigation states across the Vehicles, Support, Contact, and Destination details pages of the Senza Luce Safaris website.

Working directory: c:\WORKSPACE\ARAFAT\senzalucesafaris
Integrity mode: development

## Requirements

### R1. Vehicle Specs Modal Mobile Polish
- Ensure header title text does not overlap bright parts of the background image by adding a dark gradient overlay/scrim on the image bottom. Set dynamic title size `text-xl sm:text-2xl`.
- Convert key metrics row on mobile viewports (< 640px) to a scrollable horizontal snap row or a 2-column grid.
- Adjust columns ratio of technical specifications table (`grid-cols-[40%_60%]`) on mobile to give values primary visual space and prevent awkward wrapping.
- Layer z-indices such that the modal sits above the main page fixed floating CTA bar. Make the [BOOK SAFARI] button sticky to the bottom of the modal overlay above the floating CTA bar.
- Add a circular floating close (X) button in the top-right corner of the modal header image.
- Apply alternating light grey background zebra stripes or border dividers between specification table rows.

### R2. Support / Help Center Page (/support) Enhancements
- Add a search bar directly under the hero subheading to allow users to search for topics, booking info, or FAQs.
- Convert quick contact cards layout on mobile to a horizontal flex scroll row or a compact 2-column grid with left-aligned icons and text.
- Wrap all three quick contact cards in full-card interactive anchor links (`mailto:`, `tel:`, `/contact`) with border transitions and shadow lifts on hover/focus.
- Enhance visual contrast of contact card icon backgrounds and support action prompts with clear buttons.
- Add horizontal/sticky filter pills at the top of the FAQ section (`[All]`, `[Booking]`, etc.) to jump/filter categories.
- Convert FAQ items into collapsible Accordion items.
- Add bottom padding offset (`pb-28`) to prevent sticky bottom floating bar overlap at the bottom of the page.

### R3. Contact & Safari Inquiry Page (/contact) Optimization
- Adjust negative top margin of contact cards on mobile to prevent clipping with the hero content.
- Apply a darker gradient overlay mask across the hero image to ensure legible white text.
- Clean up form input placeholder styles to use standard muted color classes.
- Ensure all form inputs have minimum height `48px` and comfortable padding on mobile touch targets.
- Increase checkbox and radio button group spacing to prevent misclicks on touch screens.
- Hide or adapt the middle "Enquire Now" button on the floating CTA bar specifically for the `/contact` route.

### R4. Vehicles Listing Page (/vehicles) Usability Refinements
- Apply a darker gradient mask across the hero image background for clear text readability.
- Hide the star rating badge entirely or display a "New Addition" label when a vehicle's review count is zero.
- Add bottom padding offset (`pb-24`) to the main page wrapper to clear the fixed bottom floating CTA bar.

### R5. Destination Detail Page (/destinations/[slug]) Tab Navigation
- Darken hero background images across destinations templates using a gradient mask.
- Convert the vertical layout of destination sub-sections into interactive tab panels (Overview, Wildlife, Experiences, Best Time, Where to Stay, Sample Itineraries, Travel Info) with Overview active by default.
- Sync active tab changes with query parameters or sub-routes (e.g. `?tab=wildlife`).
- Make the destination tabs navigation sticky on scroll with backdrop blur.
- Wrap tabs in a horizontally scrollable container on mobile viewports.

## Acceptance Criteria

### Visual Design & Contrast
- [ ] White heading text on hero headers passes contrast checks on all modified pages.
- [ ] Vehicle modal header text does not overlap or conflict with light spots of the backing image.
- [ ] zebra stripes or border dividers exist between technical specs rows.

### Layout & Responsiveness
- [ ] Quick contact cards render as horizontal scroll rows or 2-column grids on mobile screens.
- [ ] Destination sub-sections render under active tab panels instead of long vertical list layout.
- [ ] Modal close button (X) is visible in the top-right corner of the vehicle specs modal overlay.
- [ ] Fixed bottom floating CTA bar does not obscure any footer links or bottom buttons.

### Functionality & Navigation
- [ ] Quick contact cards are fully clickable (tapping anywhere triggers action).
- [ ] Sticky tabs bar on destination details page scrolls correctly and remains visible.
- [ ] Searching or filtering FAQs works without console warnings.
- [ ] Application builds successfully (`npm run build`).
