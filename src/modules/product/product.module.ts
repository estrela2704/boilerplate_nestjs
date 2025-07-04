import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { PrismaService } from '@database/PrismaService';

@Module({
  providers: [ProductService, PrismaService],
})
export class ProductModule {}
