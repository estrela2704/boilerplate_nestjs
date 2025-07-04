import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateProductDto } from './CreateProductDto';

export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, ['companyId'] as const),
) {}
