# Incident Response Playbook
# Senza Luce Safaris - Production Operations

## Quick Reference

| Severity | Response Time | Examples |
|----------|---------------|----------|
| Critical (P1) | 1 hour | Site down, total auth failure |
| High (P2) | 4 hours | MFA not working, payment issues |
| Medium (P3) | 24 hours | Slow performance, minor bugs |
| Low (P4) | 72 hours | UI issues, cosmetic bugs |

---

## Incident Categories & Response

### 1. Authentication Failures

**Symptoms:**
- Users cannot log in
- MFA verification failing
- Sessions not persisting

**Diagnosis:**
```bash
# Check recent auth failures
grep "LOGIN_FAILED" /var/log/app.log | tail -50

# Check rate limiting
redis-cli get ratelimit:auth:*

# Check database for locked accounts
psql -c "SELECT email, lockedUntil FROM admin_user WHERE lockedUntil > NOW()"
```

**Resolution:**
1. Check if rate limiting is blocking legitimate users
2. Unlock stuck accounts: `UPDATE admin_user SET lockedUntil = NULL WHERE email = 'user@example.com'`
3. Check Redis connectivity
4. Restart auth service if needed

**Rollback:**
- Disable MFA temporarily if causing widespread issues
- Reset rate limits: `redis-cli FLUSHDB`

---

### 2. MFA System Down

**Symptoms:**
- Cannot complete login (stuck at MFA step)
- MFA API returns 500 errors
- Backup codes not working

**Diagnosis:**
```bash
# Check MFA API health
curl https://senzalucesafaris.com/api/admin/mfa-status

# Check TOTP service logs
grep "MFA" /var/log/app.log | tail -50
```

**Resolution:**
1. Check MFA secret encryption key is set
2. Verify database connection for backup codes
3. Disable MFA enforcement as workaround:
   ```bash
   # Temporarily disable MFA requirement in settings
   ```
4. Contact users with backup codes

**Rollback:**
- Re-enable MFA after fix
- Notify affected users

---

### 3. Database Issues

**Symptoms:**
- Slow page loads
- API timeout errors
- Connection pool exhausted

**Diagnosis:**
```bash
# Check DB connection pool
psql -c "SELECT count(*) FROM pg_stat_activity"

# Check slow queries
psql -c "SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10"
```

**Resolution:**
1. Check Supabase dashboard for connection limits
2. Restart connection pool
3. Kill long-running queries if safe
4. Scale up database if needed

---

### 4. Rate Limiting Issues

**Symptoms:**
- "Too many attempts" errors
- Users blocked unexpectedly

**Diagnosis:**
```bash
# Check rate limit keys
redis-cli keys "ratelimit:*"

# Check current limit usage
redis-cli get ratelimit:auth:*
```

**Resolution:**
1. Clear rate limits: `redis-cli FLUSHDB`
2. Adjust rate limit configuration
3. Whitelist affected IPs if needed

---

### 5. Deployment Issues

**Symptoms:**
- New features not appearing
- 500 errors after deployment
- Build failures

**Diagnosis:**
```bash
# Check deployment status
vercel logs senzalucesafaris --status=error

# Check recent builds
npm run build
```

**Resolution:**
1. Rollback to previous version:
   ```bash
   vercel rollback senzalucesafaris
   ```
2. Check build logs for errors
3. Verify environment variables

---

## Emergency Contacts

| Role | Contact | Escalation |
|------|---------|------------|
| On-call Engineer | [Your On-call] | PagerDuty |
| DBA | [DBA Contact] | Phone |
| Supabase Support | support@supabase.com | Email |
| Vercel Support | vercel.com/support | Dashboard |

---

## Post-Incident Checklist

- [ ] Document incident timeline
- [ ] Identify root cause
- [ ] Implement fix
- [ ] Update monitoring/alerting
- [ ] Notify affected users
- [ ] Schedule post-mortem review
- [ ] Update this playbook

---

## Monitoring Dashboards

- **Production**: https://vercel.com/senzalucesafaris/dashboard
- **Sentry**: https://senzalucesafaris.sentry.io
- **Supabase**: https://supabase.com/dashboard
- **Analytics**: https://vercel.com/senzalucesafaris/analytics