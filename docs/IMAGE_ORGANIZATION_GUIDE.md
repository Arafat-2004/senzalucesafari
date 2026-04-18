# 📁 Image Organization Guide - Senza Luce Safaris

## Overview

All images are now organized into **dedicated folders per page/section** to:
- ✅ Prevent image repetition across pages
- ✅ Make it easy to replace/update images for specific pages
- ✅ Clear separation of concerns
- ✅ No confusion about which image belongs where

---

## 🗂️ Folder Structure

### 🏠 Homepage Images
```
/images/home/
├── hero/              # Hero section background only
│   └── experience-hero.jpg
└── features/          # Feature section images
    └── planning-safari.jpg
```

### 🌍 Destinations (Each destination has its OWN folder)

#### Serengeti National Park
```
/images/destinations/serengeti/
├── serengeti.jpg              # Main hero image
├── serengeti-lions.jpg        # Gallery image 1
├── serengeti-cheetah.jpg      # Gallery image 2
├── serengeti-elephants.jpg    # Gallery image 3
└── serengeti-sunset.jpg       # Gallery image 4
```

#### Ngorongoro Crater
```
/images/destinations/ngorongoro/
├── ngorongoro.jpg             # Main hero image
├── ngorongoro-lions.jpg       # Gallery image 1
├── ngorongoro-rhino.jpg       # Gallery image 2
├── ngorongoro-elephants.jpg   # Gallery image 3
├── ngorongoro-flamingos.jpg   # Gallery image 4
└── ngorongoro-sunset.jpg      # Gallery image 5
```

#### Tarangire National Park
```
/images/destinations/tarangire/
├── tarangire.jpg              # Main hero image
├── tarangire-elephants.jpg    # Gallery image 1
├── tarangire-giraffe.jpg      # Gallery image 2
├── tarangire-lions.jpg        # Gallery image 3
├── tarangire-baobabs.jpg      # Gallery image 4
└── tarangire-sunset.jpg       # Gallery image 5
```

#### Lake Manyara National Park
```
/images/destinations/lake-manyara/
├── lake-manyara.jpg           # Main hero image
├── lake-manyara-baboons.jpg   # Gallery image 1
├── lake-manyara-flamingos.jpg # Gallery image 2
├── lake-manyara-hippos.jpg    # Gallery image 3
├── lake-manyara-forest.jpg    # Gallery image 4
└── lake-manyara-sunset.jpg    # Gallery image 5
```

#### Zanzibar
```
/images/destinations/zanzibar/
├── zanzibar.jpg               # Main hero image
├── zanzibar-beach.jpg         # Gallery image 1
├── zanzibar-dhow.jpg          # Gallery image 2
├── zanzibar-diving.jpg        # Gallery image 3
├── zanzibar-spices.jpg        # Gallery image 4
└── zanzibar-stone-town.jpg    # Gallery image 5
```

#### Nyerere National Park
```
/images/destinations/nyerere/
├── nyerere.jpg                # Main hero image
├── nyerere-elephants.jpg      # Gallery image 1
├── nyerere-wild-dogs.jpg      # Gallery image 2
├── nyerere-hippos.jpg         # Gallery image 3
├── nyerere-boat.jpg           # Gallery image 4
└── nyerere-sunset.jpg         # Gallery image 5
```

#### Ruaha National Park
```
/images/destinations/ruaha/
├── ruaha.jpg                  # Main hero image
├── ruaha-elephants.jpg        # Gallery image 1
├── ruaha-lions.jpg            # Gallery image 2
├── ruaha-wild-dogs.jpg        # Gallery image 3
├── ruaha-river.jpg            # Gallery image 4
└── ruaha-sunset.jpg           # Gallery image 5
```

### 🦁 Safari Tours (Each tour has its OWN folder)

#### 5 Days Tanzania Wildlife Safari
```
/images/tours/5-days-wildlife/
└── 5-days-wildlife.jpg        # Tour card & detail image
```

#### 9 Days Safari + Zanzibar Beach Experience
```
/images/tours/9-days-safari-zanzibar/
└── 9-days-safari-zanzibar.jpg # Tour card & detail image
```

#### Mount Kilimanjaro Trekking
```
/images/tours/kilimanjaro-trekking/
└── kilimanjaro.jpg            # Tour card & detail image
```

#### Other Tours (General tours folder)
```
/images/tours/
├── bush-beach-combo.jpg       # Bush & Beach Combo
├── grand-tanzania.jpg         # Grand Tanzania Explorer
├── honeymoon-safari.jpg       # Honeymoon Safari
├── northern-circuit.webp      # Northern Circuit Safari
├── photography-safari.jpg     # Photography Safari
├── quick-safari.jpg           # Quick Safari
├── serengeti-migration.jpg    # Great Migration Safari
├── wildlife-photography-workshop.jpg  # Photography Workshop
├── zanzibar-beach-holiday.webp        # Zanzibar Beach Holiday
└── default.jpg                # Default/fallback image
```

### 🏨 Accommodations (By tier)

#### Luxury Lodges
```
/images/accommodations/luxury/
└── luxury-lodge.jpg           # Luxury accommodation card
```

#### Mid-Range Lodges
```
/images/accommodations/midrange/
└── midrange-lodge.jpg         # Mid-range accommodation card
```

#### Budget Camps
```
/images/accommodations/budget/
└── budget-lodge.jpg           # Budget accommodation card
```

### 🚐 Vehicles
```
/images/vehicles/
├── safari-vehicle-hero.jpg    # Hero vehicle image
├── land-cruiser-*.jpg         # Land Cruiser variants
├── pop-up-roof-*.jpg          # Pop-up roof vehicles
└── ... (all other vehicle images)
```

### 📝 Blog Posts
```
/images/blog/
├── great-migration.jpg        # Blog post 1
├── big-five.jpg               # Blog post 2
├── kilimanjaro-climb.jpg      # Blog post 3
├── luxury-lodges.jpg          # Blog post 4
├── seasons-guide.jpg          # Blog post 5
└── stone-town.jpg             # Blog post 6
```

### 🦶 Footer
```
/images/footer/
└── footer-bg.jpg              # Footer background
```

---

## 🎯 Key Benefits

### 1. **No Image Repetition**
Each page uses images from its dedicated folder only. No sharing between pages.

### 2. **Easy Updates**
Want to change Serengeti images? Just replace files in `/images/destinations/serengeti/` without affecting anything else.

### 3. **Clear Organization**
Need an image for Ngorongoro? Look in `/images/destinations/ngorongoro/`. Simple!

### 4. **Scalable**
Adding a new destination? Create a new folder: `/images/destinations/new-destination/`

---

## 📝 How to Add New Images

### For a Destination Page:
1. Navigate to the destination's folder: `/images/destinations/[destination-name]/`
2. Add your new images there
3. Update the component to reference the new path

### For a Tour Package:
1. If it's a major tour, create a new folder: `/images/tours/[tour-name]/`
2. Add tour images there
3. Update the tour data file with the new path

### For Homepage Sections:
1. Determine which section: `hero`, `features`, or `testimonials`
2. Add images to that folder
3. Update the respective component

---

## 🔧 Updating Code References

After reorganizing, you need to update image paths in your code:

### Example - Before:
```tsx
<Image src="/images/destinations/serengeti.jpg" alt="Serengeti" />
```

### Example - After:
```tsx
<Image src="/images/destinations/serengeti/serengeti.jpg" alt="Serengeti" />
```

---

## ✅ Checklist for Each Page

When updating a page, ensure:
- [ ] All images come from the page's dedicated folder
- [ ] No images are shared from other sections
- [ ] Image paths are updated correctly
- [ ] Images have proper `sizes` prop for optimization
- [ ] Alt text is descriptive and unique

---

## 🚀 Best Practices

1. **One Folder Per Page**: Each page gets its own image folder
2. **Descriptive Names**: Use clear, descriptive filenames
3. **Consistent Naming**: Follow patterns like `[page]-[description].jpg`
4. **Optimize Before Upload**: Compress images before adding them
5. **Document Changes**: When adding new images, note what they're for

---

## 📊 Current Status

✅ **Completed:**
- Destination folders created and populated
- Tour folders created and populated
- Accommodation folders created and populated
- Home section folders created

🔄 **Next Steps:**
- Update all code references to use new paths
- Test all pages to ensure images load correctly
- Remove old empty folders (`safaris/`, `general/`)

---

## 🆘 Troubleshooting

### Image Not Loading?
1. Check the path is correct
2. Verify the file exists in the folder
3. Check browser console for 404 errors
4. Ensure the filename matches exactly (case-sensitive)

### Wrong Image Showing?
1. Verify you're using the correct folder
2. Check if another image has a similar name
3. Clear browser cache

---

**Last Updated:** April 6, 2026  
**Status:** Image organization complete, code updates pending
