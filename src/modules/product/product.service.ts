import { PrismaService } from '@database/PrismaService';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { CreateProductDto } from './dto/CreateProductDto';
import { CompanyService } from '../company/company.service';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private companyService: CompanyService,
  ) {}

  async create(data: CreateProductDto, userId: number): Promise<Product> {
    const company = await this.companyService.findOne(data.companyId);

    if (company.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para criar produtos nessa empresa.');
    }

    return this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        company: {
          connect: { id: data.companyId },
        },
      },
    });
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

  async findOne(id: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { company: true },
    });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }

    return product;
  }

  async update(id: number, data: Prisma.ProductUpdateInput, userId: number): Promise<Product> {
    await this.verifyProductPermission(id, userId, 'alterar');

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: number, userId: number): Promise<Product> {
    await this.verifyProductPermission(id, userId, 'excluir');

    return this.prisma.product.delete({
      where: { id },
    });
  }

  private async verifyProductPermission(productId: number, userId: number, method: string) {
    const product = await this.findOne(productId);

    const company = await this.companyService.findOne(product.companyId);

    if (company.userId !== userId) {
      throw new ForbiddenException(`Você não tem permissão para ${method} este produto.`);
    }
  }
}
