import { Injectable } from "@nestjs/common";
import { AuthorRepository } from "./repositories/author.repository";
import { CreateAuthorDto } from "./dtos/create-author.dto";
import { AuthorEntity } from "./entities/author.entity";

@Injectable()
export class AuthorService {
    constructor(
        private readonly authorRepository: AuthorRepository
    ) {}

    async create(
        createAuthorDto: CreateAuthorDto
    ): Promise<AuthorEntity> {
        return await this.authorRepository.create(createAuthorDto);
    }

    async findAll(): Promise<AuthorEntity[]> {
        return await this.authorRepository.find();
    }

    async findOneById(
        id: string
    ): Promise<AuthorEntity> {
        return await this.authorRepository.findOne({
            where: { id },
            relations: { products: true }
        });
    }

    async update(
        id: string,
        updateAuthorDto: CreateAuthorDto
    ): Promise<void> {
        await this.authorRepository.update({ id }, {
            ...updateAuthorDto
        });
    }

    async delete(
        id: string
    ): Promise<void> {
        await this.authorRepository.delete({ id });
    }
}