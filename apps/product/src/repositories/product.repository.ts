import { AbstractRepository } from "@app/database";
import { Injectable } from "@nestjs/common";
import { ProductEntity } from "../entities";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ProductRepository extends AbstractRepository<ProductEntity> {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>
    ) {
        super(productRepository);
    }
}