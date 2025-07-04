import { ApiProperty } from '@nestjs/swagger';

export class ResponseCompanyDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Empresa Alpha' })
  name: string;

  @ApiProperty({ example: '12345678000100' })
  cnpj: string;

  @ApiProperty({ example: 'Rua A, 123' })
  address: string;

  @ApiProperty({ example: 1, description: 'Página atual' })
  page: number;

  @ApiProperty({ example: 10, description: 'Quantidade de itens por página' })
  limit: number;

  @ApiProperty({ example: 100, description: 'Total de itens disponíveis' })
  total: number;

  @ApiProperty({ example: 10, description: 'Total de páginas' })
  totalPages: number;
}
