import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductEntity } from './common/entities';
import { CreateProductDto, UpdateProductDto } from './common/dtos';
import { PermissionRequestGuard, ROLE, Roles, RolesGuard, UUIDPipe } from '@app/common';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService
  ) {}

  @Post()
  @Roles([ROLE.ADMIN])
  @UseGuards(
    PermissionRequestGuard,
    RolesGuard
  )
  createProduct(
    @Body() createProductDto: CreateProductDto
  ): Promise<ProductEntity> {
    return this.productService.create(createProductDto);
  }

  @Get()
  async findAll(): Promise<ProductEntity[]> {
    return await this.productService.findAll();
  }

  @Get('/:id')
  async findOneById(
    @Param('id', UUIDPipe) id: string
  ): Promise<ProductEntity> {
    return await this.productService.findOneById(id);
  }

  @Patch('/:id')
  @Roles([ROLE.ADMIN])
  @UseGuards(
    PermissionRequestGuard,
    RolesGuard
  )
  async update(
    @Param('id', UUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<void> {
    await this.productService.update(id, updateProductDto);
  }

  @Delete('/:id')
  @Roles([ROLE.ADMIN])
  @UseGuards(
    PermissionRequestGuard,
    RolesGuard
  )
  async delete(
    @Param('id', UUIDPipe) id: string
  ): Promise<void> {
    await this.productService.delete(id)
  }
}
