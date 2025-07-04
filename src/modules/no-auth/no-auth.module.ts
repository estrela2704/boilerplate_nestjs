import { Module } from '@nestjs/common';
import { NoAuthService } from './no-auth.service';
import { NoAuthController } from './no-auth.controller';
import { PrismaService } from '@database/PrismaService';
import { MailService } from '../mail/mail.service';
import { ProductService } from '../product/product.service';
import { CompanyService } from '../company/company.service';

@Module({
  controllers: [NoAuthController],
  providers: [NoAuthService, PrismaService, MailService, ProductService, CompanyService],
})
export class NoAuthModule {}
