import { PrismaClient } from '@prisma/client';

export async function seedCompany(prisma: PrismaClient) {
  await prisma.company.createMany({
    data: [
      {
        name: 'Empresa Alpha',
        cnpj: '12345678000100',
        address: 'Rua A, 123',
      },
      {
        name: 'Empresa Beta',
        cnpj: '98765432000199',
        address: 'Avenida B, 456',
      },
    ],
    skipDuplicates: true,
  });

  console.log('Companies seed added successfully 🌱.');
}
