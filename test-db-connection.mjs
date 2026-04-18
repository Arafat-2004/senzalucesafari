// Test database connection with dotenv
import 'dotenv/config';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

console.log('DATABASE_URL found:', !!connectionString);
console.log('Testing connection to:', connectionString?.split('@')[1]);

if (!connectionString) {
    console.error('❌ DATABASE_URL not found in .env file!');
    process.exit(1);
}

const sql = postgres(connectionString, {
    ssl: 'require'
});

async function test() {
    try {
        console.log('\nAttempting to connect...');
        const result = await sql`SELECT NOW()`;
        console.log('✅ SUCCESS! Database connected!');
        console.log('Server time:', result[0].now);

        // Test creating a simple table
        await sql`
      CREATE TABLE IF NOT EXISTS connection_test (
        id SERIAL PRIMARY KEY,
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
        console.log('✅ Table created successfully!');

        // Clean up
        await sql`DROP TABLE connection_test`;
        console.log('\n🎉 Test complete! Database is working perfectly!');
        console.log('You can now use Prisma with your Supabase database!');

    } catch (error) {
        console.error('\n❌ Connection failed:', error.message);
        console.log('\nTroubleshooting tips:');
        console.log('1. Check if your Supabase project is active at: https://supabase.com/dashboard/project/lmpvkxnudhyxjigugnzj');
        console.log('2. Verify the password "senzalucesafaris" is correct');
        console.log('3. Go to Supabase Dashboard → Settings → Database → Check connection string');
        console.log('4. Try resetting your database password in Supabase');
    } finally {
        await sql.end();
        process.exit(0);
    }
}

test();
