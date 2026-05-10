/**
 * Seed FAQs only
 * Run with: npx tsx prisma/seed-faqs.ts
 */

import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || '';

const url = new URL(connectionString);
url.searchParams.delete('pgbouncer');
url.searchParams.delete('sslmode');

const adapter = new PrismaPg({
    connectionString: url.toString(),
    ssl: { rejectUnauthorized: false },
});

const prisma = new PrismaClient({ adapter });

async function seedFAQs() {
    console.log('Seeding FAQs...\n');
    
    const faqs = [
        {
            question: 'What is the best time to go on a safari in Tanzania?',
            answer: 'The best time for safaris in Tanzania is during the dry season from June to October. This is when wildlife viewing is at its peak, especially for witnessing the Great Migration in the Serengeti. However, Tanzania offers year-round safari experiences with each season having its unique advantages.',
            category: 'Safari Planning',
            displayOrder: 0,
        },
        {
            question: 'How many days do I need for a safari?',
            answer: 'We recommend a minimum of 3-4 days for a basic safari experience, but 7-10 days allows you to explore multiple parks and fully immerse yourself in the Tanzanian wilderness. Longer safaris provide better wildlife viewing opportunities and a more comprehensive experience.',
            category: 'Safari Planning',
            displayOrder: 1,
        },
        {
            question: 'Is Tanzania safe for tourists?',
            answer: 'Yes, Tanzania is one of the safest safari destinations in Africa. Our experienced guides ensure your safety throughout the journey. We maintain high safety standards, provide comprehensive briefings, and have emergency protocols in place for all our safari tours.',
            category: 'Safety',
            displayOrder: 2,
        },
        {
            question: 'What should I pack for a safari?',
            answer: 'Essential items include neutral-colored clothing, comfortable walking shoes, sunscreen, hat, sunglasses, binoculars, camera with extra batteries, and any personal medications. We provide a detailed packing list upon booking to ensure you\'re well-prepared.',
            category: 'Preparation',
            displayOrder: 3,
        },
        {
            question: 'Can I customize my safari package?',
            answer: 'Absolutely! All our safari packages can be customized to fit your preferences, budget, and schedule. Whether you want to add specific parks, upgrade accommodations, or extend your stay, we\'ll work with you to create your perfect safari experience.',
            category: 'Booking',
            displayOrder: 4,
        },
        {
            question: 'Do I need a visa to visit Tanzania?',
            answer: 'Most visitors require a visa to enter Tanzania. You can obtain a visa online through the official Tanzania Immigration website or upon arrival at major entry points. We recommend applying online in advance to avoid delays. Visa requirements vary by nationality, so check with your local embassy.',
            category: 'Visa & Travel',
            displayOrder: 5,
        },
        {
            question: 'What vaccinations do I need?',
            answer: 'Yellow fever vaccination is required if traveling from an endemic country. We also recommend Hepatitis A & B, Typhoid, and Tetanus. Malaria prophylaxis is highly recommended. Consult your travel doctor 4-6 weeks before departure for personalized advice.',
            category: 'Health',
            displayOrder: 6,
        },
        {
            question: 'What type of accommodation is available on safari?',
            answer: 'We offer a range of accommodations from luxury lodges and tented camps to mid-range lodges and budget camping options. Each provides a unique experience, from waking up to wildlife sounds in luxury tents to comfortable lodge amenities. All options are carefully selected for safety, comfort, and location.',
            category: 'Accommodation',
            displayOrder: 7,
        }
    ];
    
    let created = 0;
    let updated = 0;
    
    for (const faq of faqs) {
        const faqId = `seed-faq-${faq.category.toLowerCase().replace(/\s+/g, '-')}-${faq.displayOrder}`;
        
        try {
            const existing = await prisma.fAQ.findUnique({ where: { id: faqId } });
            
            if (existing) {
                await prisma.fAQ.update({
                    where: { id: faqId },
                    data: {
                        question: faq.question,
                        answer: faq.answer,
                        category: faq.category,
                        displayOrder: faq.displayOrder,
                        isActive: true,
                    },
                });
                updated++;
                console.log(`  Updated: ${faq.question.substring(0, 50)}...`);
            } else {
                await prisma.fAQ.create({
                    data: {
                        id: faqId,
                        question: faq.question,
                        answer: faq.answer,
                        category: faq.category,
                        displayOrder: faq.displayOrder,
                        isActive: true,
                    },
                });
                created++;
                console.log(`  Created: ${faq.question.substring(0, 50)}...`);
            }
        } catch (error: any) {
            console.error(`  Error seeding FAQ: ${faq.question.substring(0, 50)}...`, error.message);
        }
    }
    
    console.log(`\n  ✅ Created: ${created}`);
    console.log(`  ✅ Updated: ${updated}`);
    console.log(`  📊 Total: ${faqs.length} FAQs`);
}

async function main() {
    try {
        await seedFAQs();
        console.log('\nFAQ seed completed successfully!');
    } catch (error) {
        console.error('Seed error:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main();
