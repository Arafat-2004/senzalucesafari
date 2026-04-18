/**
 * Seed script to populate database with sample data
 * Run with: npx tsx scripts/seed-database.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seeding...\n')

    // ============================================
    // 1. SEED FAQs
    // ============================================
    console.log('📝 Seeding FAQs...')

    const faqs = [
        {
            question: 'What is the best time to visit Tanzania for a safari?',
            answer: 'The best time for wildlife viewing is during the dry season from June to October. The Great Migration river crossings typically occur from July to September. For bird watching, November to April is ideal when migratory birds arrive.',
            category: 'Safari',
            displayOrder: 1,
            isActive: true,
        },
        {
            question: 'Do I need a visa to visit Tanzania?',
            answer: 'Most visitors require a visa. You can obtain an e-Visa online before travel or a visa on arrival at major airports. The tourist visa costs $50 USD for most nationalities and is valid for 90 days. We recommend applying online in advance to avoid delays.',
            category: 'Visa',
            displayOrder: 2,
            isActive: true,
        },
        {
            question: 'What vaccinations are required for Tanzania?',
            answer: 'Yellow fever vaccination is required if arriving from an infected area. We highly recommend Hepatitis A & B, Typhoid, and Tetanus. Malaria prophylaxis is strongly advised. Consult your travel doctor 6-8 weeks before departure.',
            category: 'Health',
            displayOrder: 3,
            isActive: true,
        },
        {
            question: 'What should I pack for a safari?',
            answer: 'Pack light, neutral-colored clothing (khaki, beige, olive). Bring layers for cool mornings, a warm jacket, comfortable walking shoes, hat, sunglasses, sunscreen, insect repellent, binoculars, and camera equipment. Avoid bright colors and camouflage patterns.',
            category: 'Packing',
            displayOrder: 4,
            isActive: true,
        },
        {
            question: 'How much does a Tanzania safari cost?',
            answer: 'Safari costs vary based on duration, accommodation level, and group size. Budget safaris start from $150-250 per person per day, mid-range from $300-500, and luxury from $600-1000+. Our packages range from $1,500 to $5,000+ per person depending on the itinerary.',
            category: 'Pricing',
            displayOrder: 5,
            isActive: true,
        },
        {
            question: 'Is Tanzania safe for tourists?',
            answer: 'Tanzania is one of Africa\'s safest safari destinations. Crime against tourists is rare, especially on organized safaris. We recommend standard precautions: don\'t display valuables, use hotel safes, and follow your guide\'s advice. Wildlife safety is ensured by professional guides.',
            category: 'Safety',
            displayOrder: 6,
            isActive: true,
        },
        {
            question: 'What is included in your safari packages?',
            answer: 'Our packages include: professional English-speaking guide, 4x4 safari vehicle with pop-up roof, park entrance fees, accommodation, meals as specified, airport transfers, and bottled water. International flights, visas, travel insurance, and personal items are excluded.',
            category: 'Booking',
            displayOrder: 7,
            isActive: true,
        },
        {
            question: 'Can I customize my safari itinerary?',
            answer: 'Absolutely! We specialize in custom safaris tailored to your preferences, budget, and schedule. Contact us with your ideas, and we\'ll create a personalized itinerary. Customization may affect pricing based on your specific requirements.',
            category: 'Booking',
            displayOrder: 8,
            isActive: true,
        },
        {
            question: 'What is the Great Migration and when does it happen?',
            answer: 'The Great Migration is the annual movement of over 1.5 million wildebeest, zebras, and gazelles between Tanzania\'s Serengeti and Kenya\'s Masai Mara. River crossings (July-September) are the most dramatic. The migration is year-round, with different highlights each season.',
            category: 'Safari',
            displayOrder: 9,
            isActive: true,
        },
        {
            question: 'How do I book a safari with Senza Luce?',
            answer: 'You can book directly through our website by selecting your preferred tour and clicking "Book Now". You can also email us at info@senzalucesafaris.com or call us. We require a 30% deposit to confirm your booking, with the balance due 60 days before departure.',
            category: 'Booking',
            displayOrder: 10,
            isActive: true,
        },
    ]

    for (const faq of faqs) {
        await prisma.fAQ.create({ data: faq })
    }
    console.log(`✅ Created ${faqs.length} FAQs\n`)

    // ============================================
    // 2. SEED GUIDES
    // ============================================
    console.log('👥 Seeding Guides...')

    const guides = [
        {
            firstName: 'Joseph',
            lastName: 'Mwakasege',
            email: 'joseph.m@senzalucesafaris.com',
            phone: '+255 768 123 456',
            languages: ['English', 'Swahili', 'German'],
            specialties: ['Wildlife Expert', 'Big Five Specialist', 'Bird Watching'],
            experience: 15,
            bio: 'Joseph is one of Tanzania\'s most experienced safari guides with 15 years in the field. Born and raised near Serengeti, he has an extraordinary ability to spot wildlife and shares fascinating insights about animal behavior and local ecosystems.',
            certifications: ['Tanzania Professional Guide License', 'First Aid Certified', 'Wildlife Conservation Certificate'],
            licenseNumber: 'GUIDE-TZ-2009-1234',
            rating: 4.9,
            reviewCount: 87,
            isActive: true,
        },
        {
            firstName: 'Amina',
            lastName: 'Hassan',
            email: 'amina.h@senzalucesafaris.com',
            phone: '+255 754 234 567',
            languages: ['English', 'Swahili', 'French', 'Italian'],
            specialties: ['Bird Specialist', 'Cultural Tours', 'Photography'],
            experience: 10,
            bio: 'Amina is a passionate naturalist specializing in bird watching and cultural experiences. With expertise in over 500 Tanzanian bird species, she leads exceptional birding safaris and cultural village tours that provide authentic local experiences.',
            certifications: ['Certified Bird Guide', 'Cultural Tourism License', 'Photography Workshop Certified'],
            licenseNumber: 'GUIDE-TZ-2014-2345',
            rating: 4.8,
            reviewCount: 62,
            isActive: true,
        },
        {
            firstName: 'David',
            lastName: 'Mwanga',
            email: 'david.m@senzalucesafaris.com',
            phone: '+255 776 345 678',
            languages: ['English', 'Swahili', 'Spanish'],
            specialties: ['Kilimanjaro Trekking', 'Mountain Guide', 'First Aid'],
            experience: 12,
            bio: 'David is a certified mountain guide who has successfully led over 500 Kilimanjaro treks. His knowledge of mountain ecology, combined with his encouraging personality, makes him the perfect companion for your summit adventure.',
            certifications: ['Kilimanjaro Senior Guide License', 'Wilderness First Responder', 'Mountain Rescue Certified'],
            licenseNumber: 'GUIDE-TZ-2012-3456',
            rating: 4.9,
            reviewCount: 124,
            isActive: true,
        },
        {
            firstName: 'Grace',
            lastName: 'Lyimo',
            email: 'grace.l@senzalucesafaris.com',
            phone: '+255 784 456 789',
            languages: ['English', 'Swahili', 'Mandarin'],
            specialties: ['Family Safaris', 'Conservation', 'Education'],
            experience: 8,
            bio: 'Grace specializes in family safaris and educational tours. She has a gift for engaging children and adults alike, making learning about wildlife conservation fun and memorable. Her warm personality ensures every guest feels welcomed.',
            certifications: ['Professional Guide License', 'Child Safety Certified', 'Conservation Education Certificate'],
            licenseNumber: 'GUIDE-TZ-2016-4567',
            rating: 4.7,
            reviewCount: 45,
            isActive: true,
        },
        {
            firstName: 'Emmanuel',
            lastName: 'Nkya',
            email: 'emmanuel.n@senzalucesafaris.com',
            phone: '+255 765 567 890',
            languages: ['English', 'Swahili', 'Japanese'],
            specialties: ['Photography Safari', 'Night Drives', 'Luxury Travel'],
            experience: 9,
            bio: 'Emmanuel is a photography enthusiast who understands light, angles, and animal behavior. He specializes in photography safaris, helping guests capture stunning wildlife shots. His knowledge of luxury travel ensures a comfortable and memorable experience.',
            certifications: ['Professional Photography License', 'Night Safari Certified', 'Luxury Travel Specialist'],
            licenseNumber: 'GUIDE-TZ-2015-5678',
            rating: 4.8,
            reviewCount: 73,
            isActive: true,
        },
    ]

    for (const guide of guides) {
        await prisma.guide.create({ data: guide })
    }
    console.log(`✅ Created ${guides.length} Guides\n`)

    // ============================================
    // 3. SEED SITE SETTINGS
    // ============================================
    console.log('⚙️  Seeding Site Settings...')

    const settings = [
        { key: 'siteName', value: 'Senza Luce Safaris', category: 'General' },
        { key: 'siteTagline', value: 'Authentic Tanzanian Safari Experiences', category: 'General' },
        { key: 'contactEmail', value: 'info@senzalucesafaris.com', category: 'Contact' },
        { key: 'contactPhone', value: '+255 XXX XXX XXX', category: 'Contact' },
        { key: 'contactAddress', value: 'Arusha, Tanzania', category: 'Contact' },
        { key: 'whatsappNumber', value: '+255 XXX XXX XXX', category: 'Contact' },
        { key: 'bookingDepositPercent', value: '30', category: 'Booking' },
        { key: 'bookingBalanceDays', value: '60', category: 'Booking' },
        { key: 'cancellationPolicy', value: 'Free cancellation up to 60 days before departure. 50% refund 30-60 days. No refund within 30 days.', category: 'Booking' },
        { key: 'currency', value: 'USD', category: 'General' },
        { key: 'facebookUrl', value: 'https://facebook.com/senzalucesafaris', category: 'Social' },
        { key: 'instagramUrl', value: 'https://instagram.com/senzalucesafaris', category: 'Social' },
        { key: 'twitterUrl', value: 'https://twitter.com/senzalucesafaris', category: 'Social' },
        { key: 'youtubeUrl', value: '', category: 'Social' },
        { key: 'enableAnalytics', value: 'true', category: 'Settings' },
    ]

    for (const setting of settings) {
        await prisma.siteSetting.create({ data: setting })
    }
    console.log(`✅ Created ${settings.length} Site Settings\n`)

    // ============================================
    // SUMMARY
    // ============================================
    console.log('🎉 Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   - FAQs: ${faqs.length}`)
    console.log(`   - Guides: ${guides.length}`)
    console.log(`   - Site Settings: ${settings.length}`)
    console.log('\n✨ All data is ready to use in the admin dashboard!\n')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
