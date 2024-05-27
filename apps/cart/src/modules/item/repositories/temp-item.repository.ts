import { AbstractRepository } from "@app/database";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { TempItemEntity } from "../entities/temp-item.entity";

@Injectable()
export class TempItemRepository extends AbstractRepository<TempItemEntity> {
    constructor(
        @InjectRepository(TempItemEntity)
        private readonly tempItemRepository: Repository<TempItemEntity>
    ) {
        super(tempItemRepository);
    }
}