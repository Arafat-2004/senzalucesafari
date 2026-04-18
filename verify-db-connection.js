// Quick database connection verification
require('dotenv').config();
const { Client } = require('pg');

async function testConnection() {
    console.log('🔍 Testing Supabase Database Connection...\n');
    console.log('Project ID: lmpvkxnudhyxjigugnzj');
    console.log('Database URL configured:', !!process.env.DATABASE_URL);
    console.log('Direct URL configured:', !!process.env.DIRECT_URL);
    console.log('');

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // Supabase pooler uses self-signed CA; scoped to this connection only
    });

    try {
        console.log('⏳ Connecting to database...');
        await client.connect();
        console.log('✅ Successfully connected to Supabase!\n');

        const result = await client.query('SELECT NOW()');
        console.log('🕐 Database server time:', result.rows[0].now);

        // Check existing tables
        const tables = await client.query(`
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public'
            ORDER BY tablename
        `);

        console.log('\n📊 Existing tables in database:');
        tables.rows.forEach((row, index) => {
            console.log(`   ${index + 1}. ${row.tablename}`);
        });

        console.log(`\n🎉 Total tables: ${tables.rows.length}`);
        console.log('\n✨ Database connection is working perfectly!');

    } catch (error) {
        console.error('\n❌ Connection failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Verify password in .env file');
        console.log('2. Check Supabase project is active');
        console.log('3. Visit: https://supabase.com/dashboard/project/lmpvkxnudhyxjigugnzj');
    } finally {
        await client.end();
        process.exit(0);
    }
}

testConnection();
