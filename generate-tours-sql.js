// Generate SQL for all tours with proper escaping
const fs = require('fs');
const path = require('path');

// Read the tours file
const toursFile = fs.readFileSync(path.join(__dirname, 'src', 'data', 'tours.ts'), 'utf-8');

// Function to escape SQL strings (double single quotes)
function escapeSQL(str) {
    if (!str) return '';
    return str
        .replace(/'/g, "''")  // Escape single quotes
        .replace(/"/g, '"')    // Replace smart quotes
        .replace(/"/g, '"')    // Replace smart quotes
        .replace(/'/g, "'")    // Replace smart single quotes
        .replace(/'/g, "'");   // Replace smart single quotes
}

// Function to convert JS array to JSON string
function toJSON(arr) {
    return JSON.stringify(arr).replace(/'/g, "''");
}

// Extract tour data using regex - find all tour objects
const tourMatches = toursFile.match(/\{\s*id: "[^"]+",[\s\S]*?imageUrl: "[^"]+",[\s\S]*?\n\s+\}/g);

if (!tourMatches) {
    console.error('No tours found!');
    process.exit(1);
}

console.log(`Found ${tourMatches.length} tours`);

// Parse each tour and generate SQL
const sqlStatements = [];

tourMatches.forEach((match, index) => {
    try {
        // Extract fields
        const getField = (field) => {
            const regex = new RegExp(`${field}:\\s*["\\[]([^"\\]]*)["\\]]`);
            const m = match.match(regex);
            return m ? m[1] : '';
        };

        const getNumber = (field) => {
            const regex = new RegExp(`${field}:\\s*([\\d.]+)`);
            const m = match.match(regex);
            return m ? parseFloat(m[1]) : 0;
        };

        const getBoolean = (field) => {
            const regex = new RegExp(`${field}:\\s*(true|false)`);
            const m = match.match(regex);
            return m ? m[1] : 'true';
        };

        // Get complex fields (arrays and objects)
        const getComplexField = (fieldName) => {
            const startRegex = new RegExp(`${fieldName}:\\s*`);
            const startMatch = match.match(startRegex);
            if (!startMatch) return '[]';

            const startPos = startMatch.index + startMatch[0].length;
            const rest = match.substring(startPos);

            // Find matching bracket
            let depth = 0;
            let endPos = -1;

            for (let i = 0; i < rest.length; i++) {
                if (rest[i] === '[' || rest[i] === '{') depth++;
                if (rest[i] === ']' || rest[i] === '}') {
                    depth--;
                    if (depth === 0) {
                        endPos = i + 1;
                        break;
                    }
                }
            }

            if (endPos === -1) return '[]';

            const jsonStr = rest.substring(0, endPos);
            try {
                // Validate it's valid JSON
                JSON.parse(jsonStr);
                return jsonStr.replace(/'/g, "''");
            } catch (e) {
                return '[]';
            }
        };

        const name = getField('name');
        const slug = getField('slug');
        const category = getField('category');
        const shortDesc = getField('shortDescription');
        const overview = getField('overview');
        const bestFor = getComplexField('bestFor');
        const duration = getField('duration');
        const startEnd = getField('startEnd');
        const highlights = getComplexField('highlights');
        const itinerary = getComplexField('itinerary');
        const included = getComplexField('included');
        const excluded = getComplexField('excluded');
        const imageUrl = getField('imageUrl');
        const priceFrom = getNumber('priceFrom');
        const rating = getNumber('rating');
        const reviewCount = getNumber('reviewCount');
        const difficulty = getField('difficulty') || 'Moderate';
        const isActive = 'true';
        const isFeatured = index < 10 ? 'true' : 'false'; // First 10 are featured
        const displayOrder = index + 1;

        const sql = `-- Tour ${index + 1}: ${name}
INSERT INTO tours (name, slug, category, "shortDescription", overview, "bestFor", duration, "startEnd", highlights, itinerary, included, excluded, "imageUrl", "priceFrom", rating, "reviewCount", difficulty, "isActive", "isFeatured", "displayOrder") VALUES
('${escapeSQL(name)}', '${slug}', '${escapeSQL(category)}', '${escapeSQL(shortDesc)}', '${escapeSQL(overview)}', '${bestFor}'::jsonb, '${escapeSQL(duration)}', '${escapeSQL(startEnd)}', '${highlights}'::jsonb, '${itinerary}'::jsonb, '${included}'::jsonb, '${excluded}'::jsonb, '${imageUrl}', ${priceFrom}, ${rating}, ${reviewCount}, '${difficulty}', ${isActive}, ${isFeatured}, ${displayOrder});`;

        sqlStatements.push(sql);
    } catch (error) {
        console.error(`Error parsing tour ${index + 1}:`, error.message);
    }
});

// Write SQL file
const sqlContent = `-- ========================================
-- COMPLETE TOURS MIGRATION - ALL ${tourMatches.length} TOURS
-- ========================================
-- Generated automatically from src/data/tours.ts
-- Copy ALL of this SQL and paste in:
-- https://supabase.com/dashboard/project/lmpvkxnudhyxjigugnzj/sql/new
-- Then click "Run"
-- ========================================

` + sqlStatements.join('\n\n');

fs.writeFileSync(path.join(__dirname, 'MIGRATE_ALL_TOURS.sql'), sqlContent, 'utf-8');

console.log(`✅ Successfully generated MIGRATE_ALL_TOURS.sql with ${sqlStatements.length} tours!`);
console.log('📁 File saved to: MIGRATE_ALL_TOURS.sql');
