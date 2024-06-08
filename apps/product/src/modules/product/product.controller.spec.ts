import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductEntity } from './entities/product.entity';
import { isEmpty } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { SERVICE_NAME } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProductQueryDto } from './dtos/query.dto';
import { PRODUCT_SORT } from './common';

describe('ProductController', () => {
  let productController: ProductController;
  const productId: string = uuidv4()

  const productQueryDto: ProductQueryDto = {
    categoryIds: [],
    authorIds: [],
    ratings: [],
    page: 0,
    limit: 10,
    sort: PRODUCT_SORT.ON_SALE
  }

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useFactory: (): Partial<ProductService> => ({
            findAll: jest.fn().mockImplementation(
              () => Promise.resolve([new ProductEntity()])
            ),
            findOneById: jest.fn().mockImplementation(
              () => Promise.resolve(new ProductEntity())
            ),
            findList: jest.fn().mockImplementation(
              () => Promise.resolve([[new ProductEntity()], 1])
            ),
          }),
        },
        {
          provide: SERVICE_NAME.AUTH_SERVICE,
          useValue: ClientProxy
        },
      ],
    }).compile();

    productController = app.get<ProductController>(ProductController);
  });

  describe('findAll', () => {
    it('should return product array', async () => {
      const result = await productController.findAll();
      expect(result).toBeInstanceOf(Array);

      if (!isEmpty(result)) {
        expect(result[0]).toBeInstanceOf(ProductEntity)
      }
    });
  });

  describe('findOne', () => {
    it('should return product array', async () => {
      const result = await productController.findOneById(productId);
      expect(result).toBeInstanceOf(ProductEntity);
    });
  });

  describe('findList', () => {
    it('should return product array', async () => {
      const [products, total] = await productController.findList(productQueryDto);
      expect(products).toBeInstanceOf(Array)
      expect(total).toBeGreaterThanOrEqual(0)

      if (!isEmpty(products)) {
        expect(products[0]).toBeInstanceOf(ProductEntity)
      }
    });
  });
});
