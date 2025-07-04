import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { PrismaService } from '@database/PrismaService';
import { CompanyController } from './company.controller';

@Module({
  providers: [CompanyService, PrismaService],
  controllers: [CompanyController],
})
export class CompanyModule {}
