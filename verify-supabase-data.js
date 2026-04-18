#!/usr/bin/env node
/**
 * Supabase Data Verification Script
 * Verifies migrated data counts and integrity in Supabase
 */

const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Expected counts from migration
const EXPECTED_COUNTS = {
    tour: 33,
    destination: 5,
    accommodation: 9,
    blogPost: 6,
    tourDestination: 80,
    review: 6,
    vehicle: 3,
};

async function verifySupabaseData() {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║     SENZA LUCE SAFARIS - Supabase Data Verification     ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    let prisma;
    const results = {
        passed: [],
        failed: [],
        warnings: [],
    };

    try {
        // Import Prisma Client
        const { PrismaClient } = require('@prisma/client');
        prisma = new PrismaClient();

        console.log('✅ Prisma Client initialized\n');

        // Test connection
        console.log('🔍 Testing database connection...');
        const connectionTest = await prisma.$queryRaw`SELECT NOW() as now`;
        console.log(`✅ Database connected! Server time: ${connectionTest[0].now}\n`);

        // Verify each table
        console.log('📊 Verifying table counts...\n');
        console.log('─'.repeat(60));

        for (const [tableName, expectedCount] of Object.entries(EXPECTED_COUNTS)) {
            try {
                const actualCount = await prisma[tableName].count();
                const status = actualCount === expectedCount ? '✅ PASS' : '❌ FAIL';

                console.log(`${status} | ${tableName.padEnd(25)} | Expected: ${String(expectedCount).padStart(4)} | Actual: ${String(actualCount).padStart(4)}`);

                if (actualCount === expectedCount) {
                    results.passed.push(tableName);
                } else {
                    results.failed.push({
                        table: tableName,
                        expected: expectedCount,
                        actual: actualCount,
                        difference: actualCount - expectedCount,
                    });
                }

                // Get sample data for verification
                if (actualCount > 0) {
                    const samples = await prisma[tableName].findMany({
                        take: 2,
                        select: getNameField(tableName),
                    });

                    if (samples.length > 0) {
                        console.log(`   └─ Sample: ${samples[0].name || samples[0].title || 'Record ID: ' + (samples[0].id || 'N/A')}`);
                    }
                }

                console.log('─'.repeat(60));
            } catch (error) {
                console.log(`⚠️  WARN | ${tableName.padEnd(25)} | Error: ${error.message}`);
                results.warnings.push({
                    table: tableName,
                    error: error.message,
                });
            }
        }

        // Additional integrity checks
        console.log('\n🔍 Running integrity checks...\n');
        console.log('─'.repeat(60));

        // Check for orphaned tour_destinations
        try {
            const orphanedTourDests = await prisma.$queryRaw`
                SELECT COUNT(*) as count
                FROM tour_destinations td
                LEFT JOIN tours t ON td.tour_id = t.id
                WHERE t.id IS NULL
            `;

            const orphanCount = Number(orphanedTourDests[0].count);
            if (orphanCount === 0) {
                console.log('✅ PASS | No orphaned tour_destinations records');
            } else {
                console.log(`❌ FAIL | Found ${orphanCount} orphaned tour_destinations records`);
                results.failed.push({
                    table: 'tour_destinations (orphaned)',
                    expected: 0,
                    actual: orphanCount,
                });
            }
        } catch (error) {
            console.log(`⚠️  WARN | Orphaned tour_destinations check failed: ${error.message}`);
        }

        // Check for orphaned reviews
        try {
            const orphanedReviews = await prisma.$queryRaw`
                SELECT COUNT(*) as count
                FROM reviews r
                LEFT JOIN tours t ON r.tour_id = t.id
                WHERE t.id IS NULL
            `;

            const orphanCount = Number(orphanedReviews[0].count);
            if (orphanCount === 0) {
                console.log('✅ PASS | No orphaned review records');
            } else {
                console.log(`❌ FAIL | Found ${orphanCount} orphaned review records`);
                results.failed.push({
                    table: 'reviews (orphaned)',
                    expected: 0,
                    actual: orphanCount,
                });
            }
        } catch (error) {
            console.log(`⚠️  WARN | Orphaned reviews check failed: ${error.message}`);
        }

        console.log('─'.repeat(60));

        // Summary
        console.log('\n' + '═'.repeat(60));
        console.log('📋 VERIFICATION SUMMARY');
        console.log('═'.repeat(60));
        console.log(`✅ Passed: ${results.passed.length}/${Object.keys(EXPECTED_COUNTS).length}`);
        console.log(`❌ Failed: ${results.failed.length}`);
        console.log(`⚠️  Warnings: ${results.warnings.length}`);

        if (results.failed.length > 0) {
            console.log('\n❌ Failed Tables:');
            results.failed.forEach((fail) => {
                console.log(`   • ${fail.table}: Expected ${fail.expected}, Got ${fail.actual} (${fail.difference > 0 ? '+' : ''}${fail.difference})`);
            });
        }

        if (results.warnings.length > 0) {
            console.log('\n⚠️  Warnings:');
            results.warnings.forEach((warn) => {
                console.log(`   • ${warn.table}: ${warn.error}`);
            });
        }

        // Overall status
        console.log('\n' + '═'.repeat(60));
        if (results.failed.length === 0 && results.warnings.length === 0) {
            console.log('🎉 SUCCESS! All data verified successfully!');
            console.log('✅ All table counts match expected values');
            console.log('✅ No integrity issues found');
        } else if (results.failed.length === 0) {
            console.log('⚠️  PARTIAL SUCCESS! Some warnings found');
            console.log('✅ All table counts match, but check warnings above');
        } else {
            console.log('❌ VERIFICATION FAILED!');
            console.log('⚠️  Some tables have mismatched counts');
            console.log('📝 Review the failed tables above');
        }
        console.log('═'.repeat(60) + '\n');

        // Save results to log file
        const logContent = generateLogContent(results);
        const logPath = path.join(__dirname, 'verification-results.log');
        fs.writeFileSync(logPath, logContent);
        console.log(`📄 Results saved to: ${logPath}\n`);

    } catch (error) {
        console.error('\n❌ Verification failed:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        if (prisma) {
            await prisma.$disconnect();
            console.log('👋 Database connection closed\n');
        }
    }
}

/**
 * Get the appropriate name field for each table
 */
function getNameField(modelName) {
    const nameFields = {
        tour: { id: true, name: true, slug: true, priceFrom: true },
        destination: { id: true, name: true, slug: true, region: true },
        accommodation: { id: true, name: true, slug: true, type: true },
        blogPost: { id: true, title: true, slug: true, category: true },
        tourDestination: { id: true, tourId: true, destinationId: true },
        review: { id: true, tourId: true, rating: true, authorName: true },
        vehicle: { id: true, name: true, type: true, capacity: true },
    };
    return nameFields[modelName] || { id: true };
}

/**
 * Generate log file content
 */
function generateLogContent(results) {
    const timestamp = new Date().toISOString();
    let log = `Supabase Data Verification Results\n`;
    log += `Timestamp: ${timestamp}\n`;
    log += `${'='.repeat(60)}\n\n`;

    log += `Passed Tables (${results.passed.length}):\n`;
    results.passed.forEach((table) => {
        log += `  ✅ ${table}\n`;
    });

    if (results.failed.length > 0) {
        log += `\nFailed Tables (${results.failed.length}):\n`;
        results.failed.forEach((fail) => {
            log += `  ❌ ${fail.table}: Expected ${fail.expected}, Got ${fail.actual}\n`;
        });
    }

    if (results.warnings.length > 0) {
        log += `\nWarnings (${results.warnings.length}):\n`;
        results.warnings.forEach((warn) => {
            log += `  ⚠️  ${warn.table}: ${warn.error}\n`;
        });
    }

    log += `\n${'='.repeat(60)}\n`;
    if (results.failed.length === 0) {
        log += `Overall Status: ✅ SUCCESS\n`;
    } else {
        log += `Overall Status: ❌ FAILED\n`;
    }

    return log;
}

// Run verification
verifySupabaseData().catch(console.error);
