import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Produto A1' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Descrição do Produto A1' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 29.99 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  companyId: number;
}
