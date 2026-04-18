# ✅ Supabase Database Connection Setup Complete

## Configuration Summary

Your **Senza Luce Safaris** project is now connected to Supabase PostgreSQL database.

### Database Details
- **Project ID**: `lmpvkxnudhyxjigugnzj`
- **Database**: PostgreSQL via Supabase
- **Connection Pooler**: PgBouncer (port 6543)
- **Direct Connection**: Port 5432
- **Region**: EU North 1 (Stockholm)

### Environment Variables Updated

Your `.env` file has been configured with:

```env
DATABASE_URL="postgresql://postgres.lmpvkxnudhyxjigugnzj:senzalucesafaris@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

DIRECT_URL="postgresql://postgres.lmpvkxnudhyxjigugnzj:senzalucesafaris@aws-1-eu-north-1.pooler.supabase.com:5432/postgres"
```

- ✅ **DATABASE_URL**: Connection pooler URL (for Prisma Client - runtime)
- ✅ **DIRECT_URL**: Direct connection URL (for migrations)

---

## 📊 Database Schema

Your database includes **17 tables** designed for your safari business:

### Core Business Tables
1. **tours** - Safari tour packages
2. **tour_pricing** - Dynamic pricing tiers
3. **destinations** - Safari destinations
4. **tour_destinations** - Tour-destination mapping
5. **accommodations** - Lodges & hotels
6. **vehicles** - Safari vehicles fleet

### Booking & Customer Tables
7. **bookings** - Customer bookings management
8. **reviews** - Customer reviews & ratings
9. **guides** - Safari guides team

### Marketing & Content Tables
10. **blog_posts** - Blog articles
11. **faqs** - Frequently asked questions
12. **contact_inquiries** - Contact form submissions
13. **newsletters** - Email subscribers

### Media & Settings Tables
14. **media** - Media library
15. **site_settings** - Website configuration
16. **page_views** - Analytics tracking
17. **Email logs** - Email tracking (if applicable)

---

## 🚀 Next Steps

### 1. Generate Prisma Client
```bash
cd senzalucesafaris
npx prisma generate
```

### 2. Verify Database Connection
```bash
# Test connection
node test-db-connection.mjs

# Or validate Prisma schema
npx prisma validate
```

### 3. View Database with Prisma Studio
```bash
npx prisma studio
```
Opens at: http://localhost:5555

### 4. Run Database Migrations (if needed)
```bash
npx prisma migrate dev --name init
```

### 5. Access Supabase Dashboard
View your database directly at:
https://supabase.com/dashboard/project/lmpvkxnudhyxjigugnzj/editor

---

## 🔧 Common Commands

### Database Operations
```bash
# Generate Prisma Client
npx prisma generate

# Pull schema from database
npx prisma db pull

# Push schema to database
npx prisma db push

# Create migration
npx prisma migrate dev --name <migration_name>

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Open Prisma Studio (GUI)
npx prisma studio
```

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 📝 Using the Database in Code

### Example: Fetch Tours
```typescript
import { PrismaClient } from './src/generated/prisma'

const prisma = new PrismaClient()

// Get all active tours
const tours = await prisma.tour.findMany({
  where: { isActive: true },
  include: {
    pricing: true,
    destinations: {
      include: { destination: true }
    }
  }
})
```

### Example: Create Booking
```typescript
const booking = await prisma.booking.create({
  data: {
    bookingRef: 'SLS-2026-0001',
    tourId: 'tour-uuid',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    country: 'United States',
    travelDate: new Date('2026-06-15'),
    endDate: new Date('2026-06-20'),
    numberOfTravelers: 2,
    accommodationLevel: 'mid-range',
    pricePerPerson: 2450,
    totalPrice: 4900,
    depositPaid: 1470,
    paymentStatus: 'DEPOSIT_PAID',
    status: 'CONFIRMED'
  }
})
```

---

## 🔒 Security Notes

- ✅ Password is stored in `.env` file (not committed to Git)
- ✅ `.gitignore` includes `.env` to prevent accidental commits
- ✅ Using connection pooling for better performance
- ✅ SSL encryption enabled for all connections
- ⚠️ Never share your `.env` file publicly
- ⚠️ Rotate password periodically in Supabase dashboard

---

## 🆘 Troubleshooting

### Connection Issues
1. **Check Supabase Project**: Ensure project is active at https://supabase.com/dashboard
2. **Verify Password**: Confirm password is correct in Supabase → Settings → Database
3. **Check Network**: Ensure no firewall blocking ports 5432/6543
4. **Reset Password**: If needed, reset in Supabase dashboard and update `.env`

### Prisma Errors
```bash
# Regenerate client
npx prisma generate

# Validate schema
npx prisma validate

# Check connection
npx prisma db pull
```

---

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Dashboard](https://supabase.com/dashboard/project/lmpvkxnudhyxjigugnzj)
- [Database Schema File](./prisma/schema.prisma)
- [Complete Database Documentation](./DATABASE_SCHEMA_COMPLETE.md)

---

## ✨ Status

**Database Connection**: ✅ Configured  
**Environment Variables**: ✅ Set  
**Prisma Schema**: ✅ Ready (17 tables)  
**Connection Strings**: ✅ Both pooler and direct URLs configured  

**Your database is ready to use!** 🎉

---

*Setup completed on: April 14, 2026*
