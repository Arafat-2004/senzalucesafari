// Simple test to check if Prisma is set up correctly
require('dotenv').config();

console.log('🔍 Testing Setup...\n');

// Check environment variables
console.log('1. Environment Variables:');
console.log('   DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('   DATABASE_URL preview:', process.env.DATABASE_URL?.substring(0, 50) + '...');
console.log('');

// Try to import Prisma
console.log('2. Testing Prisma Client import...');
try {
    const { PrismaClient } = require('@prisma/client');
    console.log('   ✅ Prisma Client imported successfully\n');

    // Try to connect
    console.log('3. Testing database connection...');
    const prisma = new PrismaClient();

    prisma.$connect()
        .then(() => {
            console.log('   ✅ Database connected successfully!\n');
            console.log('✨ Setup is working! You can now run: node migrate-all-data.js');
            return prisma.$disconnect();
        })
        .catch(err => {
            console.error('   ❌ Connection failed:', err.message);
            console.error('\n🔧 Troubleshooting:');
            console.error('1. Run: npx prisma generate');
            console.error('2. Check your password in .env file');
            console.error('3. Verify Supabase project is active');
            process.exit(1);
        });

} catch (error) {
    console.error('   ❌ Prisma Client import failed:', error.message);
    console.error('\n🔧 Solution: Run "npx prisma generate" first');
    process.exit(1);
}
