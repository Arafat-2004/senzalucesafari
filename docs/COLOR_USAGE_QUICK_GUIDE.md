# Quick Color Usage Guide - Green & Orange Brand

## 🎨 Your Brand Colors at a Glance

```
PRIMARY (Green)          ADVENTURE (Orange)       ACCENT (Gold)
#5B995A                  #D4650E                  #F3A800
████████                 ████                     ████
Your Brand              Your Energy              Your Luxury
```

## 📋 Quick Copy-Paste Examples

### Buttons

**Green Primary Button (Main CTAs)**
```html
<button class="btn-safari">Book Your Safari</button>
```

**Orange Adventure Button (Action/Excitement)**
```html
<button class="btn-adventure">Explore Wildlife</button>
```

**Outline Button (Secondary Actions)**
```html
<button class="btn-outline">Learn More</button>
```

### Backgrounds

**Main Safari Gradient (Green → Orange → Gold)**
```html
<section class="bg-gradient-safari">
  Hero Section Content
</section>
```

**Adventure Gradient (Green → Orange)**
```html
<section class="bg-gradient-adventure">
  Adventure Tours Section
</section>
```

**Sunset Gradient (Orange → Gold)**
```html
<section class="bg-gradient-sunset">
  Evening Safari Content
</section>
```

**Premium Green Gradient**
```html
<section class="bg-gradient-premium">
  Luxury Safari Packages
</section>
```

### Text

**Main Headline (Green → Orange → Gold)**
```html
<h1 class="text-gradient-safari">Experience Tanzania's Magic</h1>
```

**Adventure Headline (Orange → Gold)**
```html
<h2 class="text-gradient-adventure">Serengeti Migration Safari</h2>
```

### Cards & Sections

**Adventure Tour Card (with Orange Shadow)**
```html
<div class="safari-card shadow-adventure">
  <h3 class="text-gradient-adventure">Wildlife Safari</h3>
  <button class="btn-adventure">View Details</button>
</div>
```

**Premium Package (with Green Shadow)**
```html
<div class="safari-card shadow-safari">
  <h3 class="text-gradient-safari">Luxury Lodge Safari</h3>
  <button class="btn-safari">Book Premium</button>
</div>
```

### Dividers

**Standard Divider (Green → Orange)**
```html
<div class="section-divider"></div>
```

**Adventure Divider (Orange Focus)**
```html
<div class="section-divider-adventure"></div>
```

## 🎯 When to Use Which Color

### Use GREEN for:
- ✅ Main "Book Now" buttons
- ✅ Navigation menu
- ✅ Trust badges
- ✅ "About Us" sections
- ✅ Contact forms
- ✅ Primary brand elements
- ✅ Professional content

### Use ORANGE for:
- ✅ "Adventure Tours" CTAs
- ✅ Wildlife highlights
- ✅ Special offers
- ✅ Limited-time deals
- ✅ Action buttons ("Explore", "Discover")
- ✅ Exciting content
- ✅ Migration tours

### Use GOLD for:
- ✅ "Luxury" labels
- ✅ Premium package badges
- ✅ VIP experiences
- ✅ Achievement indicators
- ✅ Exclusive offers

## 🌅 Complete Page Examples

### Homepage Hero
```html
<section class="relative bg-gradient-safari min-h-screen">
  <div class="container py-20">
    <h1 class="text-gradient-safari text-6xl font-bold">
      Experience the Wild Beauty of Tanzania
    </h1>
    <div class="flex gap-4 mt-8">
      <button class="btn-safari btn-glow-primary">
        Start Your Journey
      </button>
      <button class="btn-adventure btn-glow-adventure">
        Explore Adventures
      </button>
    </div>
  </div>
</section>
```

### Safari Tours Page
```html
<section class="container py-16">
  <h2 class="text-gradient-safari text-4xl mb-4">
    Our Safari Packages
  </h2>
  <div class="section-divider mb-8"></div>
  
  <div class="grid grid-cols-3 gap-8">
    <!-- Adventure Tour -->
    <div class="safari-card shadow-adventure layered-adventure">
      <div class="p-6">
        <h3 class="text-gradient-adventure text-2xl">
          Serengeti Migration
        </h3>
        <button class="btn-adventure mt-4">
          View Adventure
        </button>
      </div>
    </div>
    
    <!-- Premium Tour -->
    <div class="safari-card shadow-safari">
      <div class="p-6">
        <h3 class="text-gradient-safari text-2xl">
          Luxury Safari Experience
        </h3>
        <button class="btn-safari mt-4">
          Book Premium
        </button>
      </div>
    </div>
  </div>
</section>
```

## 🎨 Color Combination Rules

### ✅ Good Combinations
- Green button on white background
- Orange button on green gradient
- Gold text on dark background
- Green headline with orange subheadline
- Orange badge on green card

### ❌ Avoid
- Orange text on orange background
- Green text on green background
- Gold text on white background (low contrast)
- Too many colors in one section

## 💡 Pro Tips

1. **Start with Green** - Use as your base brand color
2. **Add Orange for Excitement** - Highlight adventure elements
3. **Use Gold Sparingly** - Only for premium/luxury indicators
4. **Gradients are Your Friend** - They blend colors beautifully
5. **Dark Mode Works Automatically** - All utilities support it!

## 🔧 Custom Colors in Tailwind

If you need to use the colors directly in Tailwind classes:

```html
<!-- Using CSS variables -->
<div class="bg-[var(--primary)]">Green Background</div>
<div class="text-[var(--adventure)]">Orange Text</div>
<div class="border-[var(--accent)]">Gold Border</div>

<!-- Or use the utility classes (recommended) -->
<div class="bg-gradient-safari">Gradient Background</div>
<div class="text-gradient-safari">Gradient Text</div>
```

## 📱 Mobile Considerations

All colors and utilities are fully responsive:
- Buttons maintain proper size on mobile
- Gradients scale beautifully
- Text remains readable
- Shadows adapt to screen size

## 🎯 Quick Decision Tree

**Choosing Button Color:**
- Is it the main action? → Green (`btn-safari`)
- Is it adventure-related? → Orange (`btn-adventure`)
- Is it secondary? → Outline (`btn-outline`)

**Choosing Background:**
- Hero section? → `bg-gradient-safari`
- Adventure content? → `bg-gradient-adventure`
- Luxury content? → `bg-gradient-premium`
- Evening/romantic? → `bg-gradient-sunset`

**Choosing Text Style:**
- Main headline? → `text-gradient-safari`
- Adventure title? → `text-gradient-adventure`
- Regular text? → Use standard classes

---

**Remember:** Green = Trust & Brand | Orange = Energy & Adventure | Gold = Luxury & Premium

Mix them thoughtfully for the best results! 🌅
