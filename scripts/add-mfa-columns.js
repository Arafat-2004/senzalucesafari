require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://postgres.lmpvkxnudhyxjigugnzj:senzalucesafaris@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require';

const pool = new Pool({ connectionString: DATABASE_URL });

async function main() {
  console.log('Adding MFA columns to admin_users...');
  const client = await pool.connect();
  
  try {
    // Check if columns exist
    const result = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'admin_users' AND column_name IN ('totpsecret', 'mfaenabled', 'backupcodes')
    `);
    
    if (result.rows.length === 0) {
      await client.query(`ALTER TABLE "admin_users" ADD COLUMN "totpsecret" TEXT`);
      console.log('Added totpsecret column');
      
      await client.query(`ALTER TABLE "admin_users" ADD COLUMN "mfaenabled" BOOLEAN DEFAULT false`);
      console.log('Added mfaenabled column');
      
      await client.query(`ALTER TABLE "admin_users" ADD COLUMN "backupcodes" TEXT`);
      console.log('Added backupcodes column');
    } else {
      console.log('MFA columns already exist');
    }
    
    console.log('\n✅ MFA columns added successfully!');
  } catch (error) {
    console.error('Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main();