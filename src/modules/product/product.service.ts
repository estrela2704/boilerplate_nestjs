import { PrismaService } from '@database/PrismaService';
import { Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({ data });
  }

  async search(
    filter: string,
    orderByField: 'name' | 'price' = 'name',
    orderDirection: 'asc' | 'desc' = 'asc',
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where: {
          OR: [{ name: { contains: filter } }, { description: { contains: filter } }],
        },
        orderBy: { [orderByField]: orderDirection },
        skip,
        take: limit,
        include: { company: true },
      }),
      this.prisma.product.count({
        where: {
          OR: [{ name: { contains: filter } }, { description: { contains: filter } }],
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

  async findAll(
    orderByField: 'name' | 'price' = 'name',
    orderDirection: 'asc' | 'desc' = 'asc',
    page = 1,
    limit = 10,
  ): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        orderBy: { [orderByField]: orderDirection },
        skip,
        take: limit,
        include: { company: true },
      }),
      this.prisma.product.count(),
    ]);

    return { data, total, page, limit };
  }

  findOne(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: { company: true },
    });
  }

  update(id: number, data: Prisma.ProductUpdateInput): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  remove(id: number): Promise<Product> {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
