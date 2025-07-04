import { PrismaClient } from '@prisma/client';

export async function seedProduct(prisma: PrismaClient) {
  await prisma.product.createMany({
    data: [
      {
        name: 'Produto A1',
        description: 'Descrição do Produto A1',
        price: 15.32,
        companyId: 1,
      },
      {
        name: 'Produto A2',
        description: 'Descrição do Produto A2',
        price: 25.5,
        companyId: 1,
      },
      {
        name: 'Produto B1',
        description: 'Descrição do Produto B1',
        price: 30.0,
        companyId: 2,
      },
      {
        name: 'Produto B2',
        description: 'Descrição do Produto B2',
        price: 45.99,
        companyId: 2,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Products seed added successfully 🌱.');
}
