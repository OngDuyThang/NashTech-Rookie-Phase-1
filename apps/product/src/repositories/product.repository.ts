import { AbstractRepository } from "@app/database";
import { Injectable } from "@nestjs/common";
import { ProductEntity } from "../entities";
import { Repository } from "typeorm";

@Injectable()
export class ProductRepository extends AbstractRepository<ProductEntity> {
    constructor(
        private readonly productRepository: Repository<ProductEntity>
    ) {
        super(productRepository);
    }
}