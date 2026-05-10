import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

async function main() {
  const connectionString = process.env.DATABASE_URL ?? '';
  const url = new URL(connectionString);
  url.searchParams.delete('sslmode');

  const prisma = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: url.toString(),
      ssl: { rejectUnauthorized: false },
      max: 2,
    }),
  });

  const users = await prisma.adminUser.findMany({
    select: {
      id: true,
      email: true,
      isActive: true,
      roleId: true,
      role: {
        select: {
          id: true,
          name: true,
          level: true,
        },
      },
    },
  });

  console.log(JSON.stringify(users, null, 2));
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
