// Simple script to create placeholder images
const fs = require('fs');
const path = require('path');

// Create placeholders directory
const dir = path.join(__dirname, 'public', 'images', 'placeholders');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

// List of images to create
const images = [
    { name: 'hero-safari.jpg', width: 1920, height: 1080, color: '#8B7355', text: 'Hero Safari Landscape' },
    { name: 'serengeti.jpg', width: 800, height: 600, color: '#D4A574', text: 'Serengeti Wildlife' },
    { name: 'kilimanjaro.jpg', width: 800, height: 600, color: '#5B8C5A', text: 'Mount Kilimanjaro' },
    { name: 'zanzibar-beach.jpg', width: 800, height: 600, color: '#4A90E2', text: 'Zanzibar Beach' },
    { name: 'stone-town.jpg', width: 800, height: 600, color: '#B5A088', text: 'Stone Town Culture' },
    { name: 'experience-hero.jpg', width: 800, height: 600, color: '#7B9E6B', text: 'Safari Experience' },
    { name: 'luxury-lodge.jpg', width: 800, height: 600, color: '#C9A96E', text: 'Luxury Safari Lodge' },
    { name: 'midrange-lodge.jpg', width: 800, height: 600, color: '#8B9A6B', text: 'Mid-Range Lodge' },
    { name: 'budget-lodge.jpg', width: 800, height: 600, color: '#A0826D', text: 'Budget Safari Camp' },
    { name: '5-days-wildlife.jpg', width: 800, height: 600, color: '#C4A35A', text: '5 Days Wildlife Safari' },
    { name: '9-days-safari-zanzibar.jpg', width: 800, height: 600, color: '#5A9DBF', text: '9 Days Safari + Zanzibar' },
    { name: 'northern-circuit.jpg', width: 800, height: 600, color: '#9B8B6B', text: 'Northern Circuit Safari' },
    { name: 'zanzibar-beach-holiday.jpg', width: 800, height: 600, color: '#3BA5D9', text: 'Zanzibar Beach Holiday' },
    { name: 'serengeti-migration.jpg', width: 800, height: 600, color: '#B8956A', text: 'Great Migration' },
    { name: 'bush-beach-combo.jpg', width: 800, height: 600, color: '#6BA58D', text: 'Bush & Beach Combo' },
    { name: 'luxury-lodges.jpg', width: 800, height: 600, color: '#D4AF37', text: 'Luxury Lodges' },
    { name: 'big-five.jpg', width: 800, height: 600, color: '#8B7D6B', text: 'Big Five Wildlife' }
];

console.log('Creating placeholder images...');
console.log('Images will be saved to:', dir);
console.log('');

images.forEach(img => {
    console.log(`✓ ${img.name} (${img.width}x${img.height})`);
});

console.log('');
console.log('Next: Open generate-placeholders.html to download actual image files');
