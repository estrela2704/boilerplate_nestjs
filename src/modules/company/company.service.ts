import { PrismaService } from '@database/PrismaService';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Company, Prisma } from '@prisma/client';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CompanyCreateInput): Promise<Company> {
    await this.verifyCompanyByCpf(String(data.cnpj));

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

  async findOne(id: number): Promise<Company> {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada.`);
    }

    return company;
  }

  async update(id: number, data: Prisma.CompanyUpdateInput, userId: number): Promise<Company> {
    await this.verifyCompanyPermission(id, userId, 'alterar');

    await this.verifyCompanyByCpf(String(data.cnpj));

    return this.prisma.company.update({
      where: { id },
      data,
    });
  }

  async remove(id: number, userId: number): Promise<Company> {
    await this.verifyCompanyPermission(id, userId, 'excluir');

    return this.prisma.company.delete({
      where: { id },
    });
  }

  private async verifyCompanyPermission(companyId: number, userId: number, method: string) {
    const company = await this.findOne(companyId);

    if (company.userId !== userId) {
      throw new ForbiddenException(`Você não tem permissão para ${method} esta empresa.`);
    }
  }

  private async verifyCompanyByCpf(cnpj: string) {
    const cnpjValue = typeof cnpj === 'string' ? cnpj : (cnpj as any)?.set ?? undefined;

    const existingCompany = await this.prisma.company.findUnique({
      where: { cnpj: cnpjValue },
    });

    if (existingCompany) {
      throw new ConflictException('Já existe uma empresa com esse CNPJ.');
    }
  }
}
