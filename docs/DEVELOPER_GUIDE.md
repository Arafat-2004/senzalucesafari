# 👨‍💻 SENZA LUCE SAFARIS - DEVELOPER GUIDE

**Version:** 1.0.0  
**Last Updated:** April 3, 2026  
**For:** Developers working on Senza Luce Safaris

---

## 🚀 QUICK START FOR DEVELOPERS

### **First Day Setup (15 minutes)**

```bash
# 1. Clone and navigate
cd c:\Users\arafa\Desktop\safarisSenza\senzalucesafaris

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:3000
```

**Expected Result:** ✅ Website loads perfectly

---

## 💻 DEVELOPMENT WORKFLOW

### **Daily Development Process**

```
┌─────────────┐
│   Git Pull  │  (Get latest code)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  npm install │  (If new deps)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  npm run dev │  (Start dev server)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Code!     │  (With HMR auto-refresh)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Test       │  (Manual + automated)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Commit     │  (Git commit)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Push      │  (To remote repo)
└─────────────┘
```

---

## 📝 CODING STANDARDS

### **TypeScript Guidelines**

#### **✅ DO: Use TypeScript Interfaces**

```typescript
// Good ✅
interface TourPackage {
  id: string;
  name: string;
  priceFrom: number;
}

const tour: TourPackage = {
  id: "1",
  name: "Safari",
  priceFrom: 2000
};
```

```typescript
// Bad ❌
const tour = {
  id: "1",
  name: "Safari",
  price: 2000  // Wrong field name, no type safety
};
```

#### **✅ DO: Use Type Unions**

```typescript
// Good ✅
type ButtonVariant = "default" | "outline" | "ghost";

interface ButtonProps {
  variant: ButtonVariant;
}
```

#### **❌ DON'T: Use `any` Type**

```typescript
// Bad ❌
const data: any = getData();

// Good ✅
const data: TourPackage[] = getData();
```

### **React Best Practices**

#### **Component Structure**

```tsx
// 1. Imports
import { useState } from "react";
import { Button } from "@/components/ui/button";

// 2. Types
interface MyComponentProps {
  title: string;
  count?: number;
}

// 3. Component
export function MyComponent({ title, count = 0 }: MyComponentProps) {
  // 4. Hooks
  const [state, setState] = useState(0);
  
  // 5. Event handlers
  const handleClick = () => {
    setState(state + 1);
  };
  
  // 6. Render
  return (
    <div>
      <h2>{title}</h2>
      <p>Count: {count}</p>
      <Button onClick={handleClick}>Click</Button>
    </div>
  );
}
```

#### **Server vs Client Components**

```tsx
// Server Component (Default)
// app/page.tsx
export default async function HomePage() {
  const data = await fetchData(); // Direct async/await
  
  return <div>{data}</div>;
}

// Client Component (Needs directive)
// components/counter.tsx
"use client";

export function Counter() {
  const [count, setCount] = useState(0);
  
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### **Naming Conventions**

#### **Files & Folders**
```
✅ kebab-case.tsx
✅ PascalCase.tsx (components only)
❌ camelCase.tsx
❌ snake_case.tsx
```

#### **Variables & Functions**
```typescript
✅ const tourName = "Safari";
✅ function fetchTours() {}
✅ interface TourPackage {}
✅ type ButtonVariant = "default" | "outline";
❌ const tour_name = "Safari";
❌ function FetchTours() {}
```

#### **Components**
```tsx
✅ export function FeaturedToursSection() {}
✅ export const HeroSection = () => {};
❌ export function featuredToursSection() {}
```

---

## 🎨 STYLING GUIDE

### **Tailwind CSS Patterns**

#### **Responsive Design**

```tsx
// Mobile-first approach
<div className="
  grid 
  grid-cols-1      /* Mobile: 1 column */
  sm:grid-cols-2   /* Tablet: 2 columns */
  lg:grid-cols-4   /* Desktop: 4 columns */
  gap-4 sm:gap-6   /* Responsive gaps */
">
```

#### **Conditional Styling**

```tsx
<div className={cn(
  "px-6 py-3 rounded-lg",
  isActive ? "bg-primary text-white" : "bg-muted",
  size === "large" && "text-lg px-8"
)}>
```

#### **Custom CSS Classes**

```css
/* globals.css */
.safari-card {
  @apply bg-card rounded-lg overflow-hidden;
  border: 1px solid var(--color-border);
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.05);
  transition: all 0.3s ease;
}

.safari-card:hover {
  box-shadow: 0 4px 6px rgb(0 0 0 / 0.07);
  transform: translateY(-2px);
}
```

```tsx
// Usage
<Card className="safari-card">
```

### **Color System**

```tsx
// Use CSS variables for theming
<div className="
  bg-primary text-primary-foreground
  bg-secondary text-secondary-foreground
  bg-accent text-accent-foreground
">
```

**Never hardcode colors:**
```tsx
// Bad ❌
<div style={{ color: "#FF6B4A" }}>

// Good ✅
<div className="text-primary">
```

---

## 🔧 COMMON TASKS

### **Adding a New Tour**

**Step 1: Update Data File**

```typescript
// src/data/tours.ts
export const tourPackages: TourPackage[] = [
  // ... existing tours
  {
    id: "new-tour-id",
    name: "New Safari Adventure",
    slug: "new-safari-adventure",  // Must be unique
    category: "Wildlife Safari",
    shortDescription: "Amazing experience...",
    overview: "Full description...",
    bestFor: ["Adventure", "Photography"],
    duration: "7 days / 6 nights",
    startEnd: "Arusha",
    highlights: ["Highlight 1", "Highlight 2"],
    itinerary: [
      {
        day: 1,
        title: "Arrival",
        description: "Welcome and transfer..."
      }
      // ... more days
    ],
    included: ["Hotel", "Meals", "Guide"],
    excluded: ["Flights", "Tips"],
    priceFrom: 3500,
    rating: 9.5,
    reviewCount: 42,
    imageUrl: "/images/safaris/new-tour.jpg"
  }
];
```

**Step 2: Add Images**

```bash
# Place image in public folder
public/images/safaris/new-tour.jpg
```

**Step 3: Verify**

```bash
# Restart dev server if needed
npm run dev
```

**Step 4: Test**

Navigate to: `http://localhost:3000/safaris-tours/new-safari-adventure`

---

### **Updating Prices**

```typescript
// src/data/tours.ts
{
  id: "5-days-wildlife",
  name: "5 Days Tanzania Wildlife Safari",
  // ... other fields
  priceFrom: 2650,  // ← Change this value
  // Was: 2450
}
```

**That's it!** The change will reflect immediately due to HMR.

---

### **Adding New Section to Homepage**

**Step 1: Create Component**

```tsx
// src/components/home/new-section.tsx
"use client";

import { motion } from "framer-motion";

export function NewSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container px-4 md:px-6">
        <h2>New Section Title</h2>
        <p>Content here...</p>
      </div>
    </section>
  );
}
```

**Step 2: Import in page.tsx**

```tsx
// src/app/page.tsx
import { NewSection } from "@/components/home/new-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <NewSection />  {/* ← Add here */}
      {/* ... other sections */}
    </>
  );
}
```

---

### **Modifying Navigation Menu**

```tsx
// src/components/layout/header.tsx

const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About Us",
    href: "/about",
  },
  // Add new item here ✅
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];
```

---

## 🐛 DEBUGGING TECHNIQUES

### **React DevTools**

**Install Extension:**
- Chrome: React Developer Tools
- Firefox: React Developer Tools

**Usage:**
1. Open DevTools (F12)
2. Go to "Components" tab
3. Inspect component tree
4. View props and state

### **Console Debugging**

```tsx
export function MyComponent({ data }) {
  console.log("Component rendered with:", data);
  
  useEffect(() => {
    console.log("Effect ran with:", data);
    
    return () => {
      console.log("Cleanup");
    };
  }, [data]);
  
  return <div>{/* ... */}</div>;
}
```

### **TypeScript Errors**

**Common Error: Property does not exist**

```typescript
// Error ❌
Property 'priceFrom' does not exist on type 'TourPackage'

// Solution: Check interface definition
interface TourPackage {
  priceFrom: number;  // Make sure this exists
}
```

**Run Type Check:**
```bash
npx tsc --noEmit
```

### **Runtime Errors**

**Check Terminal:**
```
Error: Cannot find module '@/components/ui/button'

Solution:
1. Check import path
2. Run: npm install (if missing)
3. Restart dev server
```

---

## 🧪 TESTING GUIDE

### **Manual Testing Checklist**

Before committing code:

- [ ] Page loads without errors
- [ ] All images display correctly
- [ ] Links work (internal & external)
- [ ] Forms validate properly
- [ ] Mobile responsive (check at different widths)
- [ ] Buttons are clickable
- [ ] Text is readable
- [ ] No console errors

### **Browser Testing**

Test in multiple browsers:
- Chrome/Edge (Chromium)
- Firefox
- Safari (if available)

### **Device Testing**

Use DevTools Device Mode:
```
F12 → Toggle Device Toolbar → Select device
```

**Test Sizes:**
- iPhone SE (375px)
- iPad (768px)
- Desktop (1920px)

---

## 📦 DEPLOYMENT

### **Deploy to Vercel**

**Step 1: Install Vercel CLI**

```bash
npm i -g vercel
```

**Step 2: Login**

```bash
vercel login
```

**Step 3: Deploy**

```bash
vercel
```

**Step 4: Production**

```bash
vercel --prod
```

### **Environment Variables**

Create `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME="Senza Luce Safaris"
```

**Add to Vercel:**
1. Go to project settings
2. Environment Variables
3. Add variables
4. Redeploy

---

## 🔒 SECURITY BEST PRACTICES

### **Input Validation**

```typescript
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(1000),
});

export async function submitForm(formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };
  
  try {
    const validated = contactSchema.parse(rawData);
    // Process validated data
  } catch (error) {
    // Handle validation error
  }
}
```

### **XSS Prevention**

React automatically escapes content:

```tsx
// Safe ✅
<div>{userInput}</div>

// Dangerous ❌ (Don't use)
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### **Environment Variables**

```typescript
// Access env variable
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

// Never expose secrets
const apiKey = process.env.SECRET_API_KEY;  // Only on server
```

---

## 📚 LEARNING RESOURCES

### **Required Reading**

1. [Next.js App Router](https://nextjs.org/docs/app)
2. [React Server Components](https://react.dev/reference/react/use-server)
3. [Tailwind CSS Docs](https://tailwindcss.com/docs)
4. [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### **Recommended**

1. [shadcn/ui Documentation](https://ui.shadcn.com)
2. [Framer Motion Guide](https://www.framer.com/motion/)
3. [Zod Schema Validation](https://zod.dev/)

### **Video Tutorials**

- Next.js 16 Crash Course (YouTube)
- TypeScript for React Developers
- Tailwind CSS Full Course

---

## 🆘 GETTING HELP

### **Internal Resources**

1. **README.md** - Project overview
2. **ARCHITECTURE.md** - System design
3. **QUICK_REFERENCE.md** - Quick lookup
4. **Code Comments** - Inline documentation

### **External Resources**

1. **Stack Overflow** - Search errors
2. **GitHub Issues** - Library issues
3. **Discord/Slack** - Developer communities
4. **Official Docs** - Always check first

### **Common Error Solutions**

**Error: Module not found**
```bash
# Solution: Install missing dependency
npm install package-name
```

**Error: Port in use**
```bash
# Windows
taskkill /PID 3000 /F

# Or use different port
npx next dev -p 3001
```

**Error: TypeScript compilation fails**
```bash
# Check types
npx tsc --noEmit

# Fix reported errors
```

---

## 🎯 CODE REVIEW CHECKLIST

Before submitting PR:

### **Code Quality**
- [ ] TypeScript types defined
- [ ] No `any` types used
- [ ] Components are small and focused
- [ ] Functions have single responsibility
- [ ] Code is DRY (Don't Repeat Yourself)

### **Functionality**
- [ ] Feature works as expected
- [ ] All edge cases handled
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Forms validate properly

### **Styling**
- [ ] Responsive on all devices
- [ ] Consistent with design system
- [ ] No hardcoded colors/values
- [ ] Accessibility considered

### **Performance**
- [ ] Images optimized
- [ ] No unnecessary re-renders
- [ ] Lazy loading where appropriate
- [ ] Bundle size reasonable

### **Documentation**
- [ ] Code comments added where needed
- [ ] README updated if applicable
- [ ] TypeScript interfaces documented
- [ ] Changes logged

---

## 🚀 ADVANCED TECHNIQUES

### **Optimizing Performance**

#### **1. Memoization**

```tsx
import { memo, useMemo } from "react";

const ExpensiveComponent = memo(({ data }) => {
  const processed = useMemo(() => {
    // Expensive operation
    return data.map(item => heavyComputation(item));
  }, [data]);
  
  return <div>{processed}</div>;
});
```

#### **2. Lazy Loading**

```tsx
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <p>Loading...</p>,
  ssr: false,  // Disable server-side rendering
});
```

#### **3. Image Optimization**

```tsx
import Image from "next/image";

<Image
  src="/photo.jpg"
  alt="Description"
  width={800}
  height={600}
  priority  // Load above fold images first
  quality={75}  // Reduce quality for smaller size
/>
```

### **Advanced Patterns**

#### **Compound Components**

```tsx
// Card.tsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

Card.Header = function Header({ children }) {
  return <div className="card-header">{children}</div>;
};

Card.Content = function Content({ children }) {
  return <div className="card-content">{children}</div>;
};

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Content>Body</Card.Content>
</Card>
```

#### **Render Props**

```tsx
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);
  
  return render(position);
}

// Usage
<MouseTracker render={({ x, y }) => (
  <div>Mouse at: {x}, {y}</div>
)} />
```

---

## 📈 CAREER GROWTH

### **Skills You'll Develop**

1. **Next.js 16** - Modern React framework
2. **TypeScript** - Type-safe JavaScript
3. **Tailwind CSS** - Utility-first CSS
4. **React Patterns** - Best practices
5. **Performance Optimization** - Speed matters
6. **Accessibility** - Inclusive design
7. **SEO** - Search engine optimization

### **Next Steps**

1. Learn backend (Node.js + Express)
2. Study databases (PostgreSQL/MongoDB)
3. Explore GraphQL
4. Master testing (Jest, React Testing Library)
5. Learn DevOps basics (Docker, CI/CD)

---

**Document Created:** April 3, 2026  
**For:** Development Team  
**Version:** 1.0.0  
**Happy Coding!** 💻✨
