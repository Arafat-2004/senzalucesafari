# CRITICAL FIXES FOR SENZA LUCE SAFARIS
# Generated: 2026-04-17

## 🔴 CRITICAL ISSUES (Must Fix Before Production)

### 1. Missing API Routes
The following API routes are missing but required for core functionality:

```
src/app/api/bookings/route.ts
src/app/api/enquiries/route.ts  
src/app/api/reviews/route.ts
```

**Impact:** User submissions are lost - no bookings or enquiries reach the database.

### 2. MCP Configuration Errors
- **Fixed in:** `mcp-fixed.json`
- **Issues:**
  - Invalid JSON syntax (embedded metadata object)
  - GitHub token exposed in plaintext
  - Figma API key placeholder not replaced
  - PostgreSQL connection pointing to wrong database

**Action Required:**
1. Copy contents of `mcp-fixed.json` to `C:\Users\arafa\AppData\Roaming\Qoder\SharedClientCache\mcp.json`
2. Set environment variables:
   ```powershell
   $env:GITHUB_TOKEN = "your_github_token"
   $env:FIGMA_API_KEY = "your_figma_api_key"
   ```

### 3. Security Headers Missing
Add to `next.config.ts`:

```typescript
headers: [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https://images.unsplash.com data: blob:; connect-src 'self' https://lmpvkxnudhyxjigugnzj.supabase.co;"
  }
]
```

## 🟡 HIGH PRIORITY

### 4. Console Statements in Production
Found 16 console.log/error/warn statements. Replace with proper logging:

```typescript
// Instead of:
console.error('Error:', error);

// Use:
if (process.env.NODE_ENV === 'development') {
  console.error('Error:', error);
}
// OR use Sentry/structured logging
```

### 5. Rate Limiting (Newsletter API)
Current implementation uses in-memory Map which won't work in serverless/clustered environments.

**Recommendation:** Use Redis or Upstash for distributed rate limiting.

### 6. Database Connection Optimization
Add to `.env`:
```env
DATABASE_POOL_TIMEOUT=10
DATABASE_CONNECTION_LIMIT=5
```

## 🟢 MEDIUM PRIORITY

### 7. Missing Environment Variables
Add to `.env`:
```env
# Email Service (for booking confirmations)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Error Monitoring
SENTRY_DSN=your_sentry_dsn

# Site URL
NEXT_PUBLIC_SITE_URL=https://senzalucesafaris.com
```

### 8. PWA Improvements
- manifest.json `start_url` is `/en` but should handle i18n routing
- Service worker needs update mechanism for cache busting

### 9. ESLint Errors
Run: `npx eslint src --fix` to auto-fix some issues.

Manual fixes needed for:
- 14 `@typescript-eslint/no-explicit-any` errors
- 30 `react/no-unescaped-entities` errors (use `&apos;` instead of `'`)

### 10. Performance Optimizations
- Add query result caching for tours/destinations
- Implement ISR (Incremental Static Regeneration) for dynamic pages
- Add loading skeletons for all dynamic imports

## 📋 PRODUCTION CHECKLIST

Before deploying to production:

- [ ] Create missing API routes (bookings, enquiries, reviews)
- [ ] Fix MCP configuration (use mcp-fixed.json)
- [ ] Add security headers to next.config.ts
- [ ] Remove/replace console.log statements
- [ ] Set up email service (SMTP or SendGrid)
- [ ] Configure Sentry for error monitoring
- [ ] Add reCAPTCHA to forms
- [ ] Implement server-side validation for all forms
- [ ] Set up database backups
- [ ] Configure CDN for static assets
- [ ] Run `npm audit fix` for security vulnerabilities
- [ ] Test all form submissions end-to-end
- [ ] Verify PWA works on mobile devices
- [ ] Set up monitoring and alerts

## 🔧 QUICK FIX COMMANDS

Run these PowerShell commands to address issues:

```powershell
# Navigate to project
cd c:\Users\arafa\Desktop\safarisSenzaz\senzalucesafaris

# Fix npm vulnerabilities
npm audit fix

# Run ESLint auto-fix
npx eslint src --fix

# Check TypeScript errors
npx tsc --noEmit

# Build and test
npm run build

# Start development server
npm run dev
```
