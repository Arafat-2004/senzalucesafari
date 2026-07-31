## 2026-07-31T11:31:53Z
You are Implementer Worker 1 for Senza Luce Safaris UI/UX Improvements Project (Milestone 1).
Your working directory is: c:\WORKSPACE\ARAFAT\senzalucesafaris\.agents\implementer_1

Your task is to implement and verify requirements R1 and R4 in the codebase.

Requirements:
- R1. Vehicle Specs Modal Mobile Polish:
  1. Open `src/app/vehicles/page.tsx`.
  2. Modal Z-Index: Ensure `DialogContent` has high z-index overlay (`z-[100]`) so it sits above the fixed floating CTA bar (`MobileCTABar`).
  3. Header Image Overlay & Height: Adjust header image height to `h-48 sm:h-60 md:h-72`. Ensure a dark gradient scrim overlay on the image bottom (`bg-gradient-to-t from-black/90 via-black/40 to-transparent`).
  4. Dynamic Title Size: Set modal title text size to `text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-tight`.
  5. Top-Right Close Button: Add a circular floating top-right close (X) button inside header image overlay:
     `<DialogClose className="absolute top-3 right-3 z-50 rounded-full bg-black/60 hover:bg-black/80 text-white p-2 backdrop-blur-md transition-all"><X className="h-4 w-4" /><span className="sr-only">Close</span></DialogClose>`. Make sure `X` and `DialogClose` are imported.
  6. Key Metrics Mobile Layout: Convert key metrics row on mobile (< 640px) to horizontal snap scroll or compact 2-column grid:
     `flex overflow-x-auto snap-x gap-3 py-3 border-y border-border/50 pb-2 scrollbar-hide sm:grid sm:grid-cols-3 sm:gap-4` with items having `snap-center shrink-0 min-w-[110px] sm:min-w-0 flex-1`.
  7. Tech Specs Table 40%/60% Grid & Zebra Stripes: Set technical specifications table rows to explicit 42%/58% grid columns: `grid grid-cols-[42%_58%] items-center py-2 px-2.5 rounded-lg odd:bg-muted/40 even:bg-transparent text-xs sm:text-sm`.
  8. Sticky Book Button: Detach CTA buttons from inner scroll and make the action footer sticky to the bottom of the modal:
     `<div className="sticky bottom-0 bg-background/95 backdrop-blur-md border-t border-border/60 p-4 sm:p-6 flex gap-3 shadow-lg z-20">`.

- R4. Vehicles Listing Page Usability Refinements:
  1. Hero Gradient Mask: In `src/app/vehicles/components/hero-section.tsx`, darken hero background gradient mask to `bg-gradient-to-b from-black/75 via-black/65 to-black/90`.
  2. Star Rating Badge Logic: In `src/app/vehicles/page.tsx`, hide star rating badge or render a "New Addition" badge when `vehicle.reviews === 0` (or `reviews <= 0`).
  3. Main Page Bottom Offset: In `src/app/vehicles/page.tsx`, add bottom padding offset `pb-24 lg:pb-0` to the `<main>` wrapper so fixed bottom floating CTA bar does not obscure content.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

After editing the files:
- Run `npm run build` using your run_command tool to verify compilation.
- Document all changes and build results in `c:\WORKSPACE\ARAFAT\senzalucesafaris\.agents\implementer_1\handoff.md`.
- Send a completion message back to the parent orchestrator with your results.
