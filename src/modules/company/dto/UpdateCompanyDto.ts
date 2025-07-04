import { PartialType } from '@nestjs/swagger';
import { CreateCompanyDto } from './CreateCompanyDto';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}
