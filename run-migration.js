#!/usr/bin/env node
/**
 * Tour Migration Script
 * Executes MIGRATE_ALL_TOURS.sql to insert all 33 tours into Supabase
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Database configuration from .env
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL not found in .env file');
    process.exit(1);
}

// Create connection pool
const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Supabase pooler uses self-signed CA; scoped to this connection only
});

async function migrateTours() {
    const client = await pool.connect();

    try {
        console.log('🚀 Starting tour migration...');
        console.log('📂 Reading MIGRATE_ALL_TOURS.sql...');

        // Read the SQL file
        const sqlPath = path.join(__dirname, 'MIGRATE_ALL_TOURS.sql');
        let sqlContent = fs.readFileSync(sqlPath, 'utf8');

        console.log('📝 SQL file loaded successfully');
        console.log('🔄 Converting JSONB arrays to PostgreSQL text arrays...');

        // Convert JSONB arrays to PostgreSQL text arrays
        // Match patterns like '["value1", "value2"]'::jsonb and convert to ARRAY['value1', 'value2']
        sqlContent = sqlContent.replace(/\[([^\]]*)\]'::jsonb/g, (match, content) => {
            // Parse the JSON array content
            try {
                const parsed = JSON.parse(`[${content}]`);
                if (Array.isArray(parsed)) {
                    // Convert to PostgreSQL array format
                    const pgArray = 'ARRAY[' + parsed.map(item => `'${item.replace(/'/g, "''")}'`).join(', ') + ']';
                    return pgArray;
                }
            } catch (e) {
                console.error('⚠️  Warning: Could not parse JSON array:', content);
            }
            return match; // Return original if parsing fails
        });

        console.log('✅ Conversion complete');

        // Split the SQL into individual INSERT statements
        // Match each INSERT statement from start to semicolon
        const insertRegex = /INSERT INTO tours\s+\([^;]+;/gi;
        const statements = [];
        let match;

        while ((match = insertRegex.exec(sqlContent)) !== null) {
            statements.push(match[0]);
        }

        console.log(`📊 Found ${statements.length} INSERT statements to execute`);

        if (statements.length === 0) {
            console.error('❌ No INSERT statements found in SQL file');
            console.log('💡 Checking if tours already exist...');

            const { rowCount } = await client.query('SELECT COUNT(*) FROM tours');
            console.log(`📊 Current tour count in database: ${rowCount}`);
            return;
        }

        // Start transaction
        await client.query('BEGIN');
        console.log('✅ Transaction started');

        let successCount = 0;
        let errorCount = 0;

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i] + ';';

            try {
                await client.query(statement);
                successCount++;

                // Extract tour name from the statement for better logging
                const nameMatch = statement.match(/\('([^']+)'/);
                if (nameMatch && nameMatch[1]) {
                    console.log(`  ✅ Tour ${successCount}: ${nameMatch[1]}`);
                }
            } catch (error) {
                errorCount++;
                console.error(`  ❌ Error executing statement ${i + 1}:`, error.message);

                // Rollback on error
                await client.query('ROLLBACK');
                console.log('🔄 Transaction rolled back due to error');
                throw error;
            }
        }

        // Commit transaction
        await client.query('COMMIT');
        console.log('\n✅ Transaction committed successfully');

        console.log('\n🎉 Migration completed successfully!');
        console.log(`📊 Total tours migrated: ${successCount}`);
        console.log(`❌ Errors: ${errorCount}`);

    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
        console.log('\n🔌 Database connection closed');
    }
}

// Run migration
migrateTours().catch(console.error);
