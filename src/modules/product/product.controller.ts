import {
  Controller,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Product, User } from '@prisma/client';
import { UpdateProductDto } from './dto/UpdateProductDto';
import { CreateProductDto } from './dto/CreateProductDto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Produtos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({
    summary: 'Rota para criar um novo produto.',
    security: [{ bearerAuth: [] }],
  })
  @ApiCreatedResponse({ description: 'Produto criado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Requisição inválida.' })
  @ApiUnauthorizedResponse({ description: 'Token inválido.' })
  @ApiForbiddenResponse({ description: 'Acesso não autorizado.' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
  @ApiBody({ type: CreateProductDto })
  async create(@Body() data: CreateProductDto, @CurrentUser() user: User): Promise<Product> {
    return this.productService.create(data, user.id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar um produto por ID.',
    security: [{ bearerAuth: [] }],
  })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProductDto,
    @CurrentUser() user: User,
  ): Promise<Product> {
    return this.productService.update(id, data, user.id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover um produto por ID.',
    security: [{ bearerAuth: [] }],
  })
  @ApiResponse({ status: 200, description: 'Produto deletado com sucesso.' })
  async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User): Promise<Product> {
    return this.productService.remove(id, user.id);
  }
}
