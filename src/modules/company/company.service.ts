import { PrismaService } from '@database/PrismaService';
import { Injectable } from '@nestjs/common';
import { Company, Prisma } from '@prisma/client';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.CompanyCreateInput): Promise<Company> {
    return this.prisma.company.create({ data });
  }

  async search(filter: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.company.findMany({
        where: {
          OR: [{ name: { contains: filter } }, { cnpj: { contains: filter } }],
        },
        orderBy: { ['name']: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.company.count({
        where: {
          OR: [{ name: { contains: filter } }, { cnpj: { contains: filter } }],
        },
      }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.company.findMany({
        orderBy: { ['name']: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.company.count(),
    ]);

    return { data, total, page, limit };
  }

  findOne(id: number): Promise<Company | null> {
    return this.prisma.company.findUnique({
      where: { id },
      include: { products: true },
    });
  }

  update(id: number, data: Prisma.CompanyUpdateInput): Promise<Company> {
    return this.prisma.company.update({
      where: { id },
      data,
    });
  }

  remove(id: number): Promise<Company> {
    return this.prisma.company.delete({
      where: { id },
    });
  }
}
