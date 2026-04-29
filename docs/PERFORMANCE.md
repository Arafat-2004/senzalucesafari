# Performance Baselines
# Senza Luce Safaris - Performance Standards

## Target Metrics

### Core Web Vitals

| Metric | Target | Acceptable | Needs Improvement |
|--------|--------|------------|---------------------|
| LCP (Largest Contentful Paint) | < 1.5s | < 2.5s | > 2.5s |
| FID (First Input Delay) | < 50ms | < 100ms | > 100ms |
| CLS (Cumulative Layout Shift) | < 0.05 | < 0.1 | > 0.1 |
| TTFB (Time to First Byte) | < 400ms | < 800ms | > 800ms |

### API Response Times

| Endpoint | Target (p95) | Acceptable (p95) | Critical |
|---------|--------------|-------------------|---------|
| GET /api/admin/session | < 100ms | < 500ms | > 1000ms |
| POST /api/admin/mfa-verify | < 500ms | < 1000ms | > 2000ms |
| POST /api/admin/login | < 800ms | < 1500ms | > 3000ms |
| GET /api/settings | < 200ms | < 500ms | > 1000ms |
| GET /api/tours | < 300ms | < 800ms | > 1500ms |

### Database Query Times

| Query Type | Target (p95) | Acceptable (p95) |
|------------|--------------|------------------|
| Simple SELECT | < 50ms | < 200ms |
| SELECT with JOIN | < 100ms | < 500ms |
| INSERT/UPDATE | < 100ms | < 500ms |
| Bulk operations | < 2000ms | < 5000ms |

### Authentication Flow

| Flow | Target | Acceptable |
|------|--------|-----------|
| Login page load | < 1s | < 2s |
| Login submission | < 1.5s | < 3s |
| MFA page load | < 500ms | < 1s |
| MFA verification | < 1s | < 2s |
| Full login + MFA | < 5s | < 10s |

## Load Testing Thresholds

| Metric | Warning | Critical |
|--------|---------|----------|
| Requests/sec | 50 | 100 |
| Concurrent sessions | 100 | 500 |
| Error rate | 1% | 5% |
| Memory usage | 70% | 85% |
| CPU usage | 60% | 80% |

## Monitoring Alerts

When any of these thresholds are exceeded, investigate immediately:

1. **LCP > 2.5s** - Check image optimization, CDN
2. **API p95 > 1s** - Check database queries, cache hit rate
3. **Error rate > 1%** - Check Sentry for errors
4. **MFA failures > 10%** - Check brute force protection
5. **DB connections > 80%** - Scale database or optimize queries

## Performance Optimization Checklist

- [ ] Images optimized (WebP/AVIF, lazy loading)
- [ ] Static pages cached at CDN level
- [ ] Database queries use indexes
- [ ] API responses cached where appropriate
- [ ] Compression enabled
- [ ] Rate limiting configured
- [ ] Error boundaries in place
- [ ] Performance monitoring active