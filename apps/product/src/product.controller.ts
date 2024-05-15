import { Controller, Get, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductEntity } from './entities';
import { CreateProductDto } from './dtos';
import { PermissionRequestGuard, ROLES, Roles } from '@app/common';

@Controller('product')
@Roles([ROLES.ADMIN])
export class ProductController {
  constructor(
    private readonly productService: ProductService
  ) {}

  @Get('/hello')
  @UseGuards(PermissionRequestGuard)
  hello(
    @Req() req: any
  ) {
    console.log(req.user);
  }

  @Get()
  @Roles([ROLES.USER])
  async findAll() {
    return await this.productService.findAll();
  }

  @Get('/:id')
  @Roles([ROLES.USER])
  async findOneById(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    id: string
  ): Promise<ProductEntity> {
    return await this.productService.findOneById(id);
  }

  // Search

  @Post()
  @UseGuards()
  createProduct(
    createProductDto: CreateProductDto
  ): Promise<ProductEntity> {
    return this.productService.create(createProductDto);
  }
}
