import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

describe('ProductController', () => {
  let productController: ProductController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService],
    }).compile();

    productController = app.get<ProductController>(ProductController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(productController.getHello()).toBe('Hello World!');
    });
  });
});
