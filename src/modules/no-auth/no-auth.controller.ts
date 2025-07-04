import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { ImessageEntity } from '@interfaces/entities/Imessage.entity';
import { User } from '@prisma/client';
import { ResponseAllUserDto } from '../admin/admin-settings/dto/response-all-user.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { NewContactDto } from '../mail/dto/new-contact.dto';
import { ForgotDto } from './dto/forgot.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResponseTextDto } from './dto/response-text.dto';
import { TextQueriesDto } from './dto/text-queries.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { NoAuthService } from './no-auth.service';
import { ResponseProductDto } from './dto/response-product.dto';
import { ResponseCompanyDto } from './dto/response-company.dto';

@ApiTags('Sem autenticação')
@Controller('no-auth')
export class NoAuthController {
  constructor(private readonly noAuthService: NoAuthService) {}

  @IsPublic()
  @Post('forgot')
  @ApiOperation({ summary: 'Rota para envio de código ao email.' })
  @ApiOkResponse({ type: ImessageEntity })
  @ApiBadRequestResponse({ description: 'Requisição inválida' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
  async forgot(@Body() body: ForgotDto): Promise<ImessageEntity> {
    const { email } = body;
    await this.noAuthService.forgot(email);
    return { message: 'Email enviado com sucesso!' };
  }

  @IsPublic()
  @Post('verify-code')
  @ApiOperation({
    summary:
      'Rota para verificação do código (somente para mobile, web não precisa consumir essa rota!).',
  })
  @ApiOkResponse({ type: ImessageEntity })
  @ApiBadRequestResponse({ description: 'Requisição inválida' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
  async verifyCode(@Body() body: VerifyCodeDto): Promise<ImessageEntity> {
    const { code } = body;
    await this.noAuthService.verifyCode(code);
    return { message: 'Código verificado com sucesso!' };
  }

  @IsPublic()
  @Post('reset')
  @ApiOperation({ summary: 'Rota para redefinir senha.' })
  @ApiOkResponse({ type: ImessageEntity })
  @ApiBadRequestResponse({ description: 'Requisição inválida' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
  async reset(@Body() body: ResetPasswordDto): Promise<ImessageEntity> {
    await this.noAuthService.reset(body);
    return { message: 'Senha resetada com sucesso.' };
  }

  @IsPublic()
  @Post('contact-us')
  @ApiOperation({ summary: 'Rota para fale conosco.' })
  @ApiOkResponse({ type: ImessageEntity })
  @ApiBadRequestResponse({ description: 'Requisição inválida' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
  async contactUs(@Body() body: NewContactDto): Promise<ImessageEntity> {
    await this.noAuthService.contactUs(body);
    return { message: 'Contato enviado com sucesso, em breve retornaremos.' };
  }

  @IsPublic()
  @Get('texts')
  @ApiOperation({ summary: 'Rota para recuperar textos.' })
  @ApiOkResponse({ type: ResponseTextDto })
  @ApiBadRequestResponse({ description: 'Requisição inválida' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
  texts(@Query() query: TextQueriesDto): Promise<ResponseTextDto> {
    return this.noAuthService.texts(query);
  }

  @IsPublic()
  @ApiOperation({ summary: 'Rota para listar todos os usuários (durante desenvolvimento).' })
  @ApiOkResponse({ type: [ResponseAllUserDto] })
  @Get('users')
  users() {
    return this.noAuthService.users();
  }

  @IsPublic()
  @Get('health-check')
  @ApiOperation({ summary: 'Rota para verificar status do servidor.' })
  @ApiOkResponse({ description: 'Servidor UP' })
  healthCheck() {
    return { message: 'Servidor UP' };
  }

  @Get('my-self')
  @ApiTags('My Self')
  @ApiOperation({
    summary: 'Rota para recuperar informações do usuário.',
    security: [{ bearerAuth: [] }],
  })
  @ApiOkResponse({ type: ResponseAllUserDto })
  @ApiBadRequestResponse({ description: 'Requisição inválida' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno no servidor.' })
  mySelf(@CurrentUser() user: User) {
    return this.noAuthService.mySelf(user.id);
  }

  @IsPublic()
  @Get('companies/:id')
  @ApiOperation({ summary: 'Rota para retornar empresa por ID.' })
  @ApiOkResponse({ type: ResponseCompanyDto })
  searchCompanyById(@Param('id') id: string) {
    return this.noAuthService.searchCompanyById(parseInt(id));
  }

  @IsPublic()
  @Get('companies/search')
  @ApiOperation({ summary: 'Rota para filtrar empresas.' })
  @ApiOkResponse({ type: [ResponseCompanyDto] })
  @ApiQuery({ name: 'page', required: true, example: 1 })
  @ApiQuery({ name: 'limit', required: true, example: 10 })
  searchCompany(
    @Query('filter') filter: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.noAuthService.searchCompany(filter, Number(page), Number(limit));
  }

  @IsPublic()
  @Get('companies')
  @ApiOperation({ summary: 'Rota para retornar empresas.' })
  @ApiOkResponse({ type: [ResponseCompanyDto] })
  @ApiQuery({ name: 'page', required: true, example: 1 })
  @ApiQuery({ name: 'limit', required: true, example: 10 })
  listAllCompanies(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.noAuthService.listAllCompanies(Number(page), Number(limit));
  }

  @IsPublic()
  @Get('products/:id')
  @ApiOperation({ summary: 'Rota para retornar produto por ID.' })
  @ApiOkResponse({ type: ResponseCompanyDto })
  searchProductById(@Param('id') id: string) {
    return this.noAuthService.searchProductById(parseInt(id));
  }

  @IsPublic()
  @Get('products/search')
  @ApiOperation({ summary: 'Rota para filtrar produtos.' })
  @ApiOkResponse({ type: [ResponseProductDto] })
  @ApiQuery({ name: 'page', required: true, example: 1 })
  @ApiQuery({ name: 'limit', required: true, example: 10 })
  @ApiQuery({
    name: 'orderByField',
    enum: ['name', 'price'],
    required: false,
    description: 'Campo para ordenar: name ou price',
  })
  @ApiQuery({
    name: 'orderDirection',
    enum: ['asc', 'desc'],
    required: false,
    description: 'Direção da ordenação: asc ou desc',
  })
  searchProduct(
    @Query('filter') filter: string,
    @Query('orderByField') orderByField?: 'name' | 'price',
    @Query('orderDirection') orderDirection?: 'asc' | 'desc',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.noAuthService.searchProduct(
      filter,
      orderByField,
      orderDirection,
      Number(page),
      Number(limit),
    );
  }

  @IsPublic()
  @Get('products')
  @ApiOperation({ summary: 'Rota para retornar produtos.' })
  @ApiOkResponse({ type: [ResponseProductDto] })
  @ApiQuery({ name: 'page', required: true, example: 1 })
  @ApiQuery({ name: 'limit', required: true, example: 10 })
  @ApiQuery({
    name: 'orderByField',
    enum: ['name', 'price'],
    required: false,
    description: 'Campo para ordenar: name ou price',
  })
  @ApiQuery({
    name: 'orderDirection',
    enum: ['asc', 'desc'],
    required: false,
    description: 'Direção da ordenação: asc ou desc',
  })
  listAllProducts(
    @Query('orderByField') orderByField?: 'name' | 'price',
    @Query('orderDirection') orderDirection?: 'asc' | 'desc',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.noAuthService.listAllProducts(
      orderByField,
      orderDirection,
      Number(page),
      Number(limit),
    );
  }
}
