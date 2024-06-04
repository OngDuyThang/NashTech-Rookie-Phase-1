import { Body, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { PaginationPipe, PermissionRequestGuard, ROLE, Roles, RolesGuard, SERVICE_MESSAGE, UUIDPipe, ProductSchema, ApiController } from '@app/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { RatingQueryDto } from './dtos/query.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@ApiController('products')
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
  async create(
    @Body() createProductDto: CreateProductDto
  ): Promise<ProductEntity> {
    return await this.productService.create(createProductDto);
  }

  // Testing purpose without pagination
  @Get('/all')
  async findAll() {
    return await this.productService.findAll();
  }

  // With pagination
  @Get()
  async findList(
    @Query(PaginationPipe) queryDto: RatingQueryDto,
  ): Promise<[ProductEntity[], number]> {
    if (queryDto.rating) {
      return await this.productService.findProductsByRating(queryDto);
    }
    return await this.productService.findList(queryDto);
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
    @Body() updateProductDto: CreateProductDto
  ): Promise<void> {
    await this.productService.update(id, updateProductDto);
  }

  @Delete('/:id')
  @Roles([ROLE.ADMIN])
  @UseGuards(
    PermissionRequestGuard,
    RolesGuard
  )
  async remove(
    @Param('id', UUIDPipe) id: string
  ): Promise<void> {
    await this.productService.remove(id)
  }

  @Delete('/delete/:id')
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

  @MessagePattern({ cmd: SERVICE_MESSAGE.GET_PRODUCT_BY_ID })
  async findProductOnCart(
    @Payload() id: string
  ): Promise<ProductSchema> {
    return await this.productService.findProductOnCart(id);
  }
}
