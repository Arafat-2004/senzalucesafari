# Deployment Runbook
# Senza Luce Safaris - Production Deployment

## Pre-Deployment Checklist

- [ ] All tests passing (unit + E2E)
- [ ] Build succeeds without errors
- [ ] Database migrations tested locally
- [ ] Environment variables configured in production
- [ ] Release notes prepared
- [ ] On-call engineer notified

## Deployment Steps

### 1. Run Pre-deployment Tests
```bash
npm run test          # Unit tests
npm run test:e2e     # E2E tests  
npm run lint         # Lint check
npm run build        # Production build
```

### 2. Database Migrations (if needed)
```bash
# Create migration
npx prisma migrate deploy

# Seed RBAC roles (if new roles added)
npm run db:seed:rbac
```

### 3. Deploy to Staging
```bash
vercel --preprod
# Verify staging works
npm run test:smoke -- TEST_URL=https://staging.senzalucesafaris.com
```

### 4. Deploy to Production
```bash
vercel --prod
```

### 5. Post-Deployment Verification
```bash
# Run smoke tests
npm run test:smoke

# Run health checks
npm run health

# Check Sentry for errors
# Visit: https://senzalucesafaris.sentry.io

# Verify admin login works
# Visit: https://senzalucesafaris.com/admin/login
```

## Rollback Procedure

If issues are detected:

### Quick Rollback (Vercel)
```bash
vercel rollback senzalucesafaris
```

### Database Rollback
```bash
npx prisma migrate rollback
```

## Post-Deployment Tasks

- [ ] Monitor error rates in Sentry
- [ ] Check analytics dashboard
- [ ] Verify search functionality
- [ ] Test checkout flow
- [ ] Notify team of successful deployment

## Environment Variables Required

```bash
# Production Environment
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
MFA_ENCRYPTION_KEY=...
NEXT_PUBLIC_SENTRY_DSN=https://...
```

## Common Issues

### Build Fails
- Check TypeScript errors: `npx tsc --noEmit`
- Check missing dependencies

### Database Connection Error
- Verify DATABASE_URL is set
- Check Supabase project status

### 500 Errors After Deploy
- Check Sentry for error details
- Verify environment variables match staging

### Images Not Loading
- Check image optimization settings
- Verify CDN configuration