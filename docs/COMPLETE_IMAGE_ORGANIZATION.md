# 📁 COMPLETE Image Organization - All Pages & Sections

## ✅ ALL Folders Created (Complete List)

### 🏠 Homepage Section
```
/images/home/
├── hero/              # Homepage hero background
├── features/          # Homepage feature section
└── testimonials/      # Homepage testimonials (ready for use)
```

### 🌍 Destinations (7 destinations - each has OWN folder)
```
/images/destinations/
├── serengeti/         # 5 images - Serengeti ONLY
├── ngorongoro/        # 6 images - Ngorongoro ONLY
├── tarangire/         # 6 images - Tarangire ONLY
├── lake-manyara/      # 6 images - Lake Manyara ONLY
├── zanzibar/          # 6 images - Zanzibar ONLY
├── nyerere/           # 6 images - Nyerere ONLY
└── ruaha/             # 6 images - Ruaha ONLY
```

### 🦁 Safari Tours (12 tours - each has OWN folder)
```
/images/tours/
├── 5-days-wildlife/                  # 1 image
├── 9-days-safari-zanzibar/           # 1 image
├── kilimanjaro-trekking/             # 1 image
├── bush-beach-combo/                 # 1 image
├── grand-tanzania/                   # 1 image
├── honeymoon-safari/                 # 1 image
├── northern-circuit/                 # 1 image
├── photography-safari/               # 1 image
├── quick-safari/                     # 1 image
├── serengeti-migration/              # 1 image
├── wildlife-photography-workshop/    # 1 image
├── zanzibar-beach-holiday/           # 1 image
└── default.jpg                       # Fallback image
```

### 🏨 Accommodations (3 tiers)
```
/images/accommodations/
├── luxury/            # Luxury lodge images
├── midrange/          # Mid-range lodge images
└── budget/            # Budget camp images
```

### 📝 Blog Posts
```
/images/blog/
├── categories/        # Category-specific images
├── great-migration.jpg
├── big-five.jpg
├── kilimanjaro-climb.jpg
├── luxury-lodges.jpg
├── seasons-guide.jpg
└── stone-town.jpg
```

### 📄 Static Pages (NEW - Just Created!)
```
/images/about/         # About page hero image
/images/contact/       # Contact page hero image
/images/enquiry/       # Enquiry page hero image
/images/faq/           # FAQ page hero image
```

### 🚐 Other Sections
```
/images/vehicles/      # Vehicle images (38 files)
/images/footer/        # Footer background
/images/safaris-categories/  # Safari category cards (NEW)
```

---

## 📋 COMPLETE List of ALL Pages Using Images

### 1. **Homepage** (`/`)
**Components:**
- `hero-section.tsx` - Hero video/image background
- `experience-section.tsx` - Experience showcase
- `safari-categories-section.tsx` - 4 category cards
- `accommodations-section.tsx` - 3 accommodation tiers
- `featured-tours-section.tsx` - Featured tour cards

**Images Used:**
- `/images/home/hero/experience-hero.jpg`
- `/images/home/features/planning-safari.jpg`
- `/images/destinations/serengeti/serengeti.jpg` (category card)
- `/images/tours/kilimanjaro-trekking/kilimanjaro.jpg` (category card)
- `/images/destinations/zanzibar/zanzibar.jpg` (category card)
- `/images/blog/stone-town.jpg` (category card)
- `/images/accommodations/luxury/luxury-lodge.jpg`
- `/images/accommodations/midrange/midrange-lodge.jpg`
- `/images/accommodations/budget/budget-lodge.jpg`

---

### 2. **Destinations Index Page** (`/destinations`)
**File:** `src/app/destinations/page.tsx`

**Images Used:**
- `/images/destinations/ngorongoro/ngorongoro.jpg` (hero fallback)
- Plus all destination card images from data file

---

### 3. **Destination Detail Pages** (`/destinations/[slug]`)
**Pages:**
- `/destinations/serengeti`
- `/destinations/ngorongoro`
- `/destinations/tarangire`
- `/destinations/lake-manyara`
- `/destinations/zanzibar`
- `/destinations/ruaha`
- `/destinations/nyerere`

**Components:**
- `DestinationHero.tsx` - Hero section
- `PhotoGallery.tsx` - Image gallery
- `RelatedTours.tsx` - Related tour cards
- `RelatedDestinations.tsx` - Related destination cards

**Images Used (per destination):**
- Hero: `/images/destinations/[name]/[name].jpg`
- Gallery: 5-6 images from `/images/destinations/[name]/`
- Related content uses their respective folders

---

### 4. **Safaris & Tours Index** (`/safaris-tours`)
**File:** `src/app/safaris-tours/page.tsx` + `tours-content.tsx`

**Images Used:**
- All tour card images from `/images/tours/[tour-name]/`
- Planning image: `/images/home/features/planning-safari.jpg`

---

### 5. **Tour Detail Pages** (`/safaris-tours/[slug]`)
**Pages (12 tours):**
- `/safaris-tours/5-days-wildlife`
- `/safaris-tours/9-days-safari-zanzibar`
- `/safaris-tours/kilimanjaro-trekking`
- `/safaris-tours/bush-beach-combo`
- `/safaris-tours/grand-tanzania`
- `/safaris-tours/honeymoon-safari`
- `/safaris-tours/northern-circuit`
- `/safaris-tours/photography-safari`
- `/safaris-tours/quick-safari`
- `/safaris-tours/serengeti-migration`
- `/safaris-tours/wildlife-photography-workshop`
- `/safaris-tours/zanzibar-beach-holiday`

**Images Used:**
- Each tour: `/images/tours/[tour-name]/[image].jpg`

---

### 6. **Blog Index Page** (`/blog`)
**File:** `src/app/blog/page.tsx`

**Images Used:**
- Hero: `/images/blog/great-migration.jpg`
- Blog post cards: 6 images from `/images/blog/`

---

### 7. **Blog Category Pages** (`/blog/category/[category]`)
**Categories:**
- Wildlife
- Travel Tips
- Accommodation
- Adventure
- Culture

**Images Used:**
- Category backgrounds from `/images/blog/categories/`
- Fallback: `/images/blog/great-migration.jpg`

---

### 8. **Blog Detail Pages** (`/blog/[slug]`)
**Pages (6 blog posts):**
- Great Migration Guide
- Best Time to Visit Tanzania
- Big Five Animals
- Luxury Lodges Guide
- Kilimanjaro Climbing
- Stone Town Culture

**Images Used:**
- Each post: `/images/blog/[post-image].jpg`

---

### 9. **About Page** (`/about`) ⚠️ NEEDS UPDATE
**File:** `src/app/about/page.tsx`

**Current Image:**
- `/images/safaris/kilimanjaro.jpg` ❌ WRONG PATH

**Should Be:**
- `/images/about/kilimanjaro.jpg` ✅ Move to about folder

---

### 10. **Contact Page** (`/contact`) ⚠️ NEEDS UPDATE
**File:** `src/app/contact/page.tsx`

**Current Image:**
- `/images/destinations/zanzibar.jpg` ❌ WRONG PATH

**Should Be:**
- `/images/contact/zanzibar.jpg` ✅ Move to contact folder

---

### 11. **Enquiry Page** (`/enquiry`) ⚠️ NEEDS UPDATE
**File:** `src/app/enquiry/page.tsx`

**Current Image:**
- `/images/destinations/zanzibar.jpg` ❌ WRONG PATH

**Should Be:**
- `/images/enquiry/zanzibar.jpg` ✅ Move to enquiry folder

---

### 12. **FAQ Page** (`/faq`) ⚠️ NEEDS UPDATE
**File:** `src/app/faq/page.tsx`

**Current Image:**
- `/images/destinations/tarangire.jpg` ❌ WRONG PATH

**Should Be:**
- `/images/faq/tarangire.jpg` ✅ Move to faq folder

---

### 13. **Accommodations Page** (`/accommodations`)
**File:** `src/app/accommodations/page.tsx`

**Images Used:**
- Luxury: `/images/accommodations/luxury/luxury-lodge.jpg`
- Mid-range: `/images/accommodations/midrange/midrange-lodge.jpg`
- Budget: `/images/accommodations/budget/budget-lodge.jpg`
- Plus accommodation cards from data file

---

### 14. **Vehicles Page** (`/vehicles`)
**File:** `src/app/vehicles/page.tsx`

**Images Used:**
- Hero: `/images/vehicles/land-cruiser-vx.jpg`
- All vehicle images from `/images/vehicles/`

---

### 15. **Footer** (Site-wide)
**Component:** `src/components/layout/footer.tsx`

**Images Used:**
- Background: `/images/footer/footer-bg.jpg`
- Trust badges (if any)

---

## 🎯 Summary by Folder

| Folder | Purpose | Pages Using It | Status |
|--------|---------|----------------|--------|
| `/images/home/` | Homepage sections | Homepage only | ✅ Organized |
| `/images/destinations/[name]/` | Each destination | Destination pages | ✅ Organized |
| `/images/tours/[name]/` | Each tour | Tour pages | ✅ Organized |
| `/images/accommodations/` | Accommodation tiers | Accommodations page, Homepage | ✅ Organized |
| `/images/blog/` | Blog posts | Blog pages | ✅ Organized |
| `/images/about/` | About page | About page | ⚠️ Needs image move |
| `/images/contact/` | Contact page | Contact page | ⚠️ Needs image move |
| `/images/enquiry/` | Enquiry page | Enquiry page | ⚠️ Needs image move |
| `/images/faq/` | FAQ page | FAQ page | ⚠️ Needs image move |
| `/images/vehicles/` | Vehicles | Vehicles page | ✅ Already organized |
| `/images/footer/` | Footer | Site-wide | ✅ Already organized |

---

## ⚠️ IMPORTANT: Images That Need Moving

### Currently in wrong locations:

1. **About Page Image**
   - Current: `/images/safaris/kilimanjaro.jpg`
   - Should be: `/images/about/kilimanjaro.jpg`

2. **Contact Page Image**
   - Current: `/images/destinations/zanzibar/zanzibar.jpg`
   - Should be: `/images/contact/zanzibar.jpg`

3. **Enquiry Page Image**
   - Current: `/images/destinations/zanzibar/zanzibar.jpg`
   - Should be: `/images/enquiry/zanzibar.jpg`

4. **FAQ Page Image**
   - Current: `/images/destinations/tarangire/tarangire.jpg`
   - Should be: `/images/faq/tarangire.jpg`

5. **Safari Categories** (homepage component)
   - Some images reference old paths like `/images/safaris/kilimanjaro.jpg`
   - Should use new dedicated folders

---

## 📊 Total Count

- **Total Folders Created:** 30+
- **Total Pages Using Images:** 15+
- **Total Components Using Images:** 20+
- **Total Data Files with Image Paths:** 4
- **Images Reorganized:** 70+

---

## ✅ What's Complete

✅ All destination folders created and populated  
✅ All tour folders created and populated  
✅ Accommodation folders created  
✅ Blog structure organized  
✅ Home section folders created  
✅ Static page folders created (about, contact, enquiry, faq)  
✅ Vehicle folder already organized  
✅ Footer folder already organized  

---

## 🔄 Next Steps

1. **Move static page images** to their dedicated folders
2. **Update code references** in all pages/components
3. **Update data files** with new paths
4. **Test all pages** to ensure images load correctly
5. **Remove old empty folders** after verification

---

**Created:** April 6, 2026  
**Status:** All folders created, images mostly organized, code updates pending
