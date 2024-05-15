import { Controller, Get, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductEntity } from './entities';
import { CreateProductDto } from './dtos';
import { PermissionRequestGuard, ROLE, Roles } from '@app/common';
import { RolesGuard } from '@app/common/auth/roles.guard';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService
  ) {}

  @Get()
  async findAll() {
    return await this.productService.findAll();
  }

  @Get('/:id')
  async findOneById(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    id: string
  ): Promise<ProductEntity> {
    return await this.productService.findOneById(id);
  }

  // Search

  @Post()
  @Roles([ROLE.ADMIN])
  @UseGuards(
    PermissionRequestGuard,
    RolesGuard
  )
  createProduct(
    createProductDto: CreateProductDto
  ): Promise<ProductEntity> {
    return this.productService.create(createProductDto);
  }
}
