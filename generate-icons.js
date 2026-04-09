const fs = require('fs');
const path = require('path');

// Simple PNG generator for placeholder icons
function createPNG(width, height, color, outputPath) {
    // Minimal valid PNG file (1x1 pixel, will be scaled by browser)
    // This is a simple colored square PNG
    const pngHeader = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A
    ]);

    // Create a simple solid color PNG
    // For simplicity, we'll create a minimal valid PNG
    const pngData = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
        'base64'
    );

    fs.writeFileSync(outputPath, pngData);
    console.log(`Created placeholder icon: ${outputPath} (${width}x${height})`);
}

const iconsDir = path.join(__dirname, 'public', 'icons');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate icons
sizes.forEach(size => {
    const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
    createPNG(size, size, '#16a34a', outputPath);
});

console.log('\n✓ All PWA icons created successfully!');
console.log('Note: These are placeholder icons. Replace with actual logo icons for production.');
