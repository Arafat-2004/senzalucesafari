require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://postgres.lmpvkxnudhyxjigugnzj:senzalucesafaris@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require';

const pool = new Pool({
  connectionString: DATABASE_URL
});

async function main() {
  console.log('Running customer_notes migration...');
  const client = await pool.connect();
  
  try {
    // Check if table exists
    const result = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'customer_notes'
    `);
    
    if (result.rows.length === 0) {
      // Create customer_notes table (adminId as TEXT to match admin_users.id)
      await client.query(`
        CREATE TABLE "customer_notes" (
          "id" UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
          "customerEmail" VARCHAR(255) NOT NULL,
          "content" TEXT NOT NULL,
          "adminId" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "customer_notes_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
        )
      `);
      console.log('Created customer_notes table');
      
      // Create indexes
      await client.query(`
        CREATE INDEX "customer_notes_customerEmail_idx" ON "customer_notes"("customerEmail")
      `);
      console.log('Created customerEmail index');
      
      await client.query(`
        CREATE INDEX "customer_notes_adminId_idx" ON "customer_notes"("adminId")
      `);
      console.log('Created adminId index');
    } else {
      console.log('customer_notes table already exists');
    }
    
    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main();