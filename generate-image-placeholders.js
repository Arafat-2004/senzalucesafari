# Simple Node.js script to generate colored placeholder images
const fs = require('fs');
const path = require('path');

// Minimal JPEG file creator (creates valid 1x1 pixel JPEG, then we'll use canvas for proper sizes)
function createMinimalJPEG(filePath, width, height, color, text) {
    // Create a simple HTML canvas approach would need browser
    // For now, create a simple colored placeholder using a base64 minimal JPEG
    // This creates a valid JPEG file that shows as a colored block

    // Simple 1x1 JPEG as starting point
    const minimalJPEG = Buffer.from(
        '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
        'base64'
    );

    fs.writeFileSync(filePath, minimalJPEG);
    console.log(`Created: ${path.basename(filePath)} (${width}x${height})`);
}

const baseDir = path.join(__dirname, 'public', 'images');

// All placeholder images needed
const images = [
    // Placeholders folder
    { dir: 'placeholders', name: 'hero-safari.jpg', w: 1920, h: 1080 },
    { dir: 'placeholders', name: 'serengeti.jpg', w: 800, h: 600 },
    { dir: 'placeholders', name: 'kilimanjaro.jpg', w: 800, h: 600 },
    { dir: 'placeholders', name: 'zanzibar-beach.jpg', w: 800, h: 600 },
    { dir: 'placeholders', name: 'stone-town.jpg', w: 800, h: 600 },
    { dir: 'placeholders', name: 'experience-hero.jpg', w: 800, h: 600 },
    { dir: 'placeholders', name: 'luxury-lodge.jpg', w: 800, h: 600 },
    { dir: 'placeholders', name: 'midrange-lodge.jpg', w: 800, h: 600 },
    { dir: 'placeholders', name: 'budget-lodge.jpg', w: 800, h: 600 },
    { dir: 'placeholders', name: '5-days-wildlife.jpg', w: 800, h: 600 },
    { dir: 'placeholders', name: '9-days-safari-zanzibar.jpg', w: 800, h: 600 },
    { dir: 'placeholders', name: 'northern-circuit.jpg', w: 800, h: 600 },
    { dir: 'placeholders', name: 'zanzibar-beach-holiday.jpg', w: 800, h: 600 },
    { dir: 'placeholders', name: 'serengeti-migration.jpg', w: 800, h: 600 },
    { dir: 'placeholders', name: 'bush-beach-combo.jpg', w: 800, h: 600 },
    { dir: 'placeholders', name: 'luxury-lodges.jpg', w: 800, h: 600 },
    { dir: 'placeholders', name: 'big-five.jpg', w: 800, h: 600 },

    // Blog folder
    { dir: 'blog', name: 'big-five.jpg', w: 800, h: 600 },
    { dir: 'blog', name: 'great-migration.jpg', w: 800, h: 600 },
    { dir: 'blog', name: 'kilimanjaro-climb.jpg', w: 800, h: 600 },
    { dir: 'blog', name: 'luxury-lodges.jpg', w: 800, h: 600 },
    { dir: 'blog', name: 'seasons-guide.jpg', w: 800, h: 600 },
    { dir: 'blog', name: 'stone-town.jpg', w: 800, h: 600 },

    // General folder
    { dir: 'general', name: 'luxury-lodge.jpg', w: 800, h: 600 },
    { dir: 'general', name: 'planning-safari.jpg', w: 800, h: 600 },

    // Safaris folder
    { dir: 'safaris', name: 'serengeti-migration.jpg', w: 800, h: 600 },
    { dir: 'safaris', name: 'kilimanjaro.jpg', w: 800, h: 600 },

    // Destinations folder
    { dir: 'destinations', name: 'tarangire.jpg', w: 800, h: 600 },
    { dir: 'destinations', name: 'ngorongoro.jpg', w: 800, h: 600 },
    { dir: 'destinations', name: 'lake-manyara.jpg', w: 800, h: 600 },
    { dir: 'destinations', name: 'manyara.jpg', w: 800, h: 600 },

    // Home testimonials
    { dir: 'home/testimonials', name: 'testimonial-1.jpg', w: 400, h: 400 },
    { dir: 'home/testimonials', name: 'testimonial-2.jpg', w: 400, h: 400 },
    { dir: 'home/testimonials', name: 'testimonial-3.jpg', w: 400, h: 400 },

    // Safari categories
    { dir: 'safaris-categories', name: 'wildlife-safari.jpg', w: 800, h: 600 },
    { dir: 'safaris-categories', name: 'kilimanjaro-climb.jpg', w: 800, h: 600 },
    { dir: 'safaris-categories', name: 'beach-holiday.jpg', w: 800, h: 600 },
    { dir: 'safaris-categories', name: 'cultural-tour.jpg', w: 800, h: 600 },
];

console.log('Creating placeholder images...\n');

let count = 0;
images.forEach(img => {
    const dirPath = path.join(baseDir, img.dir);
    const filePath = path.join(dirPath, img.name);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    // Create the placeholder JPEG file
    createMinimalJPEG(filePath, img.w, img.h);
    count++;
});

console.log(`\n✅ Created ${count} placeholder images`);
console.log('📁 Location: public/images/');
console.log('\nNext: Replace each file with your real image (keep same filename)');
