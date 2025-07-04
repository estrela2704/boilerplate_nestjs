import { ApiProperty } from '@nestjs/swagger';
import { ResponseCompanyDto } from './response-company.dto';

export class ResponseProductDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Produto A1' })
  name: string;

  @ApiProperty({ example: 'Descrição do Produto A1' })
  description: string;

  @ApiProperty({ example: 15.32 })
  price: number;

  @ApiProperty({ example: 1 })
  companyId: number;

  @ApiProperty({ type: ResponseCompanyDto })
  company: ResponseCompanyDto;

  @ApiProperty({ example: 1, description: 'Página atual' })
  page: number;

  @ApiProperty({ example: 10, description: 'Quantidade de itens por página' })
  limit: number;

  @ApiProperty({ example: 100, description: 'Total de itens disponíveis' })
  total: number;

  @ApiProperty({ example: 10, description: 'Total de páginas' })
  totalPages: number;
}
