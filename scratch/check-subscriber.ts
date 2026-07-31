import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function main() {
    try {
        const subscriber = await prisma.newsletter.findUnique({
            where: {
                email: 'arafatmmbaga99@gmail.com'
            }
        });
        console.log("Subscriber from production database:", subscriber);
    } catch (e) {
        console.error("Error querying subscriber:", e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
