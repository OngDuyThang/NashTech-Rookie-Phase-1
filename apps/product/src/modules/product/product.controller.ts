import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { PaginationDto, PaginationPipe, PermissionRequestGuard, ROLE, Roles, RolesGuard, UUIDPipe } from '@app/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductEntity } from './entities/product.entity';

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
    @Query(PaginationPipe) paginationDto: PaginationDto,
  ): Promise<[ProductEntity[], number] | ProductEntity[]> {
    if (paginationDto?.rating) {
      return await this.productService.findListByRating(paginationDto);
    }
    return await this.productService.findList(paginationDto);
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
}
