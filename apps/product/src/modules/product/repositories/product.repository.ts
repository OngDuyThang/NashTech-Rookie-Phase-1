import { AbstractRepository } from "@app/database";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "../entities/product.entity";

@Injectable()
export class ProductRepository extends AbstractRepository<ProductEntity> {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>
    ) {
        super(productRepository);
    }
}