import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { Company } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCompanyDto } from './dto/CreateCompanyDto';
import { UpdateCompanyDto } from './dto/UpdateCompanyDto';

@ApiTags('Empresas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiOperation({
    summary: 'Rota para criar uma nova empresa.',
    security: [{ bearerAuth: [] }],
  })
  @ApiCreatedResponse({ description: 'Empresa criada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Requisição inválida.' })
  @ApiUnauthorizedResponse({ description: 'Token inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso não autorizado.' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
  @ApiBody({ type: CreateCompanyDto })
  async create(@Body() data: CreateCompanyDto): Promise<Company> {
    return await this.companyService.create(data);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Rota para atualizar uma empresa por ID.',
    security: [{ bearerAuth: [] }],
  })
  @ApiResponse({ status: 200, description: 'Empresa atualizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Requisição inválida.' })
  @ApiUnauthorizedResponse({ description: 'Token inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso não autorizado.' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
  @ApiBody({ type: UpdateCompanyDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateCompanyDto) {
    return this.companyService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Rota para deletar uma empresa por ID.',
    security: [{ bearerAuth: [] }],
  })
  @ApiResponse({ status: 200, description: 'Empresa deletada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Requisição inválida.' })
  @ApiUnauthorizedResponse({ description: 'Token inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso não autorizado.' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.remove(id);
  }
}
