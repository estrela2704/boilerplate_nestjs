import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Empresa XYZ' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '12345678000100' })
  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @ApiProperty({ example: 'Rua A, 123' })
  @IsString()
  @IsOptional()
  address?: string;
}
