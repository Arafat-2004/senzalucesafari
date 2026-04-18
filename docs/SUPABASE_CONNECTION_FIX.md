# 🔧 Supabase Connection Troubleshooting Guide

## ❌ Current Issue
Your computer cannot resolve: `db.lmpvkxnudhyxjigugnzj.supabase.co`

---

## ✅ SOLUTION 1: Use Supabase CLI (Recommended)

### Step 1: Install Supabase CLI
```bash
npm install -g supabase
```

### Step 2: Login to Supabase
```bash
supabase login
```
This will open a browser for you to authenticate.

### Step 3: Link Your Project
```bash
supabase link --project-ref lmpvkxnudhyxjigugnzj
```

### Step 4: Get Connection String
```bash
supabase connection-string --db-url
```

---

## ✅ SOLUTION 2: Check Your Network/DNS

### Try Flushing DNS Cache
```bash
ipconfig /flushdns
```

### Try Different DNS Server
1. Open Network Settings
2. Change DNS to Google DNS: `8.8.8.8` and `8.8.4.4`
3. Try again

### Check Firewall/Antivirus
- Some firewalls block `.supabase.co` domains
- Add exception for `*.supabase.co`

---

## ✅ SOLUTION 3: Use Direct Database Connection from Supabase Dashboard

### Step 1: Go to Dashboard
https://supabase.com/dashboard/project/lmpvkxnudhyxjigugnzj

### Step 2: Navigate to Settings
1. Click **Settings** (⚙️) on the left sidebar
2. Click **Database**
3. Scroll to **Connection string**

### Step 3: Choose Connection Mode
You'll see TWO options:
- **Transaction mode** (Connection Pooler) - Port 6543
- **Session mode** (Direct Connection) - Port 5432

Try the **Transaction mode** (port 6543) instead!

### Step 4: Copy Connection String
Select **URI** → **Node.js** → Copy the entire string

It should look like:
```
postgresql://postgres.lmpvkxnudhyxjigugnzj:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

---

## ✅ SOLUTION 4: Test with PSQL (Command Line)

### Install PostgreSQL Client
Download from: https://www.postgresql.org/download/windows/

### Test Connection
```bash
psql -h db.lmpvkxnudhyxjigugnzj.supabase.co -p 5432 -U postgres -d postgres
```

If this works, then Prisma should work too.

---

## ✅ SOLUTION 5: Use SQLite for Local Development (Temporary)

If you can't connect to Supabase right now, use SQLite locally:

### Step 1: Update .env
```env
DATABASE_URL="file:./dev.db"
```

### Step 2: Update prisma.config.ts
It will automatically use the new URL from .env

### Step 3: Push Schema
```bash
npm exec -- prisma db push
```

### Step 4: Develop Locally
Work on your features, then switch to Supabase when the connection issue is resolved.

---

## 🎯 Quick Test Commands

After trying any solution above, test with:

```bash
# Test Prisma connection
npm exec -- prisma db pull

# Or test with Node
node test-db-connection.mjs
```

---

## 📞 Still Not Working?

### Check Supabase Status
https://status.supabase.com

### Verify Project is Active
1. Go to: https://supabase.com/dashboard
2. Check if project `lmpvkxnudhyxjigugnzj` shows as **Active**
3. If it shows **Paused**, click **Activate**

### Reset Database Password
1. Settings → Database
2. Click **Reset database password**
3. Create a new password
4. Update your `.env` file

---

## 🚀 Once Connected

After successfully connecting, run:

```bash
# 1. Generate Prisma Client
npm exec -- prisma generate

# 2. Push your schema to create tables
npm exec -- prisma db push

# 3. Open Prisma Studio to view your database
npm exec -- prisma studio
```

---

## 💡 My Recommendation

**Try SOLUTION 3 first** (use the connection pooler on port 6543). This often works better than direct connections and bypasses DNS issues.

Go to your Supabase dashboard and look for the **Connection Pooler** URL - it will have a different host like `aws-0-us-east-1.pooler.supabase.com`.

Copy that URL and share it with me, and I'll update your `.env` file! 🎯
