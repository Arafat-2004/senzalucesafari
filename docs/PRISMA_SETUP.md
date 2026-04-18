# Prisma Setup Complete! ✅

Prisma has been successfully installed and configured in your Senza Luce Safaris project.

## What's Been Installed

### Packages
- **prisma** (v7.7.0) - Dev dependency for database management
- **@prisma/client** - Type-safe database client for your application

### Files Created/Configured
- **prisma/schema.prisma** - Your Prisma schema file (already existed)
- **.env** - Environment variables with database URL
- **.env.example** - Example environment file for reference
- **src/lib/prisma.ts** - Prisma Client singleton instance for Next.js

## Next Steps

### 1. Configure Your Database

Update the `DATABASE_URL` in your `.env` file with your actual database credentials:

```env
# For PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"

# For MySQL
DATABASE_URL="mysql://user:password@localhost:3306/mydb"

# For SQLite (local development)
DATABASE_URL="file:./dev.db"
```

### 2. Define Your Database Schema

Edit `prisma/schema.prisma` to define your models. Example:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Example models for your Safari business
model Tour {
  id          String   @id @default(uuid())
  name        String
  description String
  price       Float
  duration    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Booking {
  id          String   @id @default(uuid())
  tourId      String
  customerName String
  email       String
  date        DateTime
  status      String   @default("pending")
  createdAt   DateTime @default(now())
  
  tour        Tour     @relation(fields: [tourId], references: [id])
}
```

### 3. Generate Prisma Client

After defining your schema, run:

```bash
npm exec -- prisma generate
```

This will generate the type-safe client in `src/generated/prisma`.

### 4. Create Database Tables

If you're starting fresh, create your database schema:

```bash
npm exec -- prisma db push
```

Or use migrations for production:

```bash
npm exec -- prisma migrate dev --name init
```

### 5. Use Prisma in Your Code

Import and use Prisma in your Next.js API routes or server components:

```typescript
import { prisma } from '@/lib/prisma'

// Get all tours
const tours = await prisma.tour.findMany()

// Create a booking
const booking = await prisma.booking.create({
  data: {
    tourId: 'tour-id',
    customerName: 'John Doe',
    email: 'john@example.com',
    date: new Date('2026-05-01'),
  }
})
```

## Useful Commands

```bash
# Generate Prisma Client
npm exec -- prisma generate

# Push schema to database
npm exec -- prisma db push

# Create a migration
npm exec -- prisma migrate dev --name <migration-name>

# Apply migrations in production
npm exec -- prisma migrate deploy

# Open Prisma Studio (Database GUI)
npm exec -- prisma studio

# Reset database
npm exec -- prisma migrate reset

# Format schema file
npm exec -- prisma format
```

## Database Options

### Quick Start with SQLite (No Setup Required)
```env
DATABASE_URL="file:./dev.db"
```

### PostgreSQL (Recommended for Production)
- Use a local PostgreSQL instance
- Use Supabase: https://supabase.com (Free tier available)
- Use Neon: https://neon.tech (Free tier available)
- Use Railway: https://railway.app

### MySQL
```env
DATABASE_URL="mysql://user:password@localhost:3306/mydb"
```

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Database URL Formats](https://pris.ly/d/connection-strings)

## Troubleshooting

### Module Not Found Error
If you see `Cannot find module '../generated/prisma'`, run:
```bash
npm exec -- prisma generate
```

### Database Connection Error
- Verify your `DATABASE_URL` in `.env` is correct
- Ensure your database server is running
- Check firewall settings

### Schema Changes Not Applied
```bash
npm exec -- prisma db push
# or for migrations
npm exec -- prisma migrate dev
```

---

**Need help?** Check the Prisma documentation or ask for assistance!
