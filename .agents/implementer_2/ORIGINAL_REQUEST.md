## 2026-07-31T08:37:33Z
You are Implementer Worker 2 for Senza Luce Safaris UI/UX Improvements Project (Milestone 2).
Your working directory is: c:\WORKSPACE\ARAFAT\senzalucesafaris\.agents\implementer_2

Your task is to implement and verify requirements R2 and R3 in the codebase.

Requirements:
- R2. Support / Help Center Page (/support) Enhancements:
  1. Open `src/app/support/page.tsx`.
  2. Hero Search Bar: Add a controlled search bar directly under the hero subheading with a Lucide `Search` icon (`Search` from `lucide-react`), placeholder "Search topics, booking info, FAQs...", filtering the FAQ items dynamically based on the input text.
  3. Mobile Quick Contact Cards Layout: Convert the quick contact cards container on mobile to a horizontal flex snap scroll row or compact grid: `flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-3 md:pb-0 scrollbar-hide` with items `snap-center shrink-0 w-[85vw] sm:w-[320px] md:w-auto`.
  4. Full-Card Interactive Anchor Links: Wrap each contact card in full-card clickable anchor links (`<a href="mailto:..." className="...">`, `<a href="tel:..." className="...">`, `<Link href="/contact" className="...">`) with border hover/focus transitions (`border border-border/70 hover:border-primary/50 hover:shadow-lg transition-all rounded-2xl p-6 bg-card flex flex-col justify-between h-full`).
  5. Icon Background Contrast & Action Buttons: Enhance visual contrast of icon backgrounds using a solid mint fill box (`w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary font-bold`). Include clear action buttons (`<Button variant="outline" size="sm">...`).
  6. Sticky Category Filter Pills: Add horizontal/sticky filter pills at top of FAQ section (`[All]`, `[Booking]`, `[Safaris & Tours]`, `[Payment & Visas]`, etc.) (`sticky top-16 sm:top-20 z-30 bg-background/95 backdrop-blur-md border-y border-border/60 py-3 mb-8 flex overflow-x-auto snap-x gap-2 scrollbar-hide`).
  7. Collapsible FAQ Accordion: Convert FAQ items into stateful collapsible accordion cards with `ChevronDown` rotation indicators, expanding and collapsing on click.
  8. Bottom Padding Offset: Add bottom padding offset `pb-28 sm:pb-32` on main page container to clear the sticky bottom floating bar.

- R3. Contact & Safari Inquiry Page (/contact) Optimization:
  1. Mobile Contact Cards Negative Margin: In `src/app/contact/ContactContent.tsx` (or `src/app/contact/page.tsx`), adjust negative top margin on mobile to `-mt-6 sm:-mt-10 md:-mt-14 z-20 relative px-4` to prevent clipping with hero text.
  2. Darker Hero Gradient Mask: In `src/app/contact/page.tsx` or `src/components/ui/hero-section.tsx`, darken hero overlay background for clear white text contrast (`overlayStyle={{ background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.70) 50%, rgba(0, 0, 0, 0.90) 100%)" }}` or overlay class).
  3. Form Input Placeholders & Heights: In `src/components/ui/input.tsx` and `src/components/ui/enquiry-form.tsx`, ensure standard muted placeholder colors (`placeholder:text-muted-foreground/75`). Ensure all form inputs and textareas have min-height `48px` (`min-h-[48px] h-12`) on touch targets.
  4. Checkbox & Radio Button Spacing: In `src/components/ui/enquiry-form.tsx`, increase touch target padding and spacing for radio buttons and checkbox options (`flex items-center gap-3 p-3.5 rounded-xl border border-border/70 bg-card hover:bg-accent/10 transition-colors cursor-pointer min-h-[48px]`).
  5. Floating CTA Bar Adaptation on `/contact`: In `src/components/ui/mobile-cta-bar.tsx`, check `const isRedundant = pathname?.startsWith('/contact') || pathname?.startsWith('/enquiry');`. When `isRedundant` is true, hide the middle "Enquire Now" button on the floating CTA bar to avoid redundancy, allowing Call and WhatsApp buttons to form a clean 2-button layout.
