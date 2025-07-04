import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { PrismaService } from '@database/PrismaService';

@Module({
  providers: [CompanyService, PrismaService],
})
export class CompanyModule {}
