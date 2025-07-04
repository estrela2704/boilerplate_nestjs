import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { PrismaService } from '@database/PrismaService';
import { ProductController } from './product.controller';
import { CompanyService } from '../company/company.service';

@Module({
  providers: [ProductService, PrismaService, CompanyService],
  controllers: [ProductController],
})
export class ProductModule {}
