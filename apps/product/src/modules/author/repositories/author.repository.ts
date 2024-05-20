import { AbstractRepository } from "@app/database";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthorEntity } from "../entities/author.entity";

@Injectable()
export class AuthorRepository extends AbstractRepository<AuthorEntity> {
    constructor(
        @InjectRepository(AuthorEntity)
        private readonly authorRepository: Repository<AuthorEntity>
    ) {
        super(authorRepository);
    }
}