import { prisma } from './src/lib/prisma';
prisma.adminRole.findMany().then(r => console.log(JSON.stringify(r, null, 2))).catch(e => console.error(e)).finally(() => process.exit(0));