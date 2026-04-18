import { PrismaClient } from './src/generated/prisma/client.js';

async function verifySchema() {
    const prisma = new PrismaClient();

    try {
        console.log('🔍 Verifying Prisma Schema vs Supabase Database...\n');

        // Get all models from Prisma schema
        const prismaModels = [
            'Tour', 'TourPricing', 'Destination', 'TourDestination',
            'Accommodation', 'Vehicle', 'Booking', 'Review', 'Guide',
            'ContactInquiry', 'Newsletter', 'BlogPost', 'FAQ', 'Media',
            'SiteSettings', 'PageView'
        ];

        console.log('📊 Checking database tables:\n');

        let matchCount = 0;
        let mismatchCount = 0;

        for (const model of prismaModels) {
            try {
                // Try to query each model
                const count = await prisma[model.toLowerCase()].count();
                console.log(`✅ ${model.padEnd(20)} - Table exists (${count} records)`);
                matchCount++;
            } catch (error) {
                console.log(`❌ ${model.padEnd(20)} - Table NOT found or error`);
                mismatchCount++;
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log(`📈 Summary:`);
        console.log(`   ✅ Matching tables: ${matchCount}`);
        console.log(`   ❌ Missing tables: ${mismatchCount}`);
        console.log(`   📊 Total checked: ${prismaModels.length}`);
        console.log('='.repeat(60));

        if (mismatchCount === 0) {
            console.log('\n🎉 Perfect match! All Prisma models exist in Supabase database.');
        } else {
            console.log('\n⚠️  Schema mismatch detected. Some tables are missing.');
            console.log('💡 Run: npx prisma db push  (to sync schema)');
        }

    } catch (error) {
        console.error('❌ Error connecting to database:', error.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

verifySchema();
