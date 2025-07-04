import { PrismaClient } from '@prisma/client';
import { seedAdmin } from './admin.seeds';
import { seedUser } from './user.seeds';
import { seedText } from './text.seeds';
import { seedCompany } from './company.seeds';
import { seedProduct } from './product.seeds';

const prisma = new PrismaClient();

async function main() {
  await seedAdmin(prisma);
  await seedUser(prisma);
  await seedText(prisma);
  await seedCompany(prisma);
  await seedProduct(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
