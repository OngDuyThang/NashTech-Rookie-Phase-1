import { Entity, QueryRunner, Repository } from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import { NotFoundException } from "@nestjs/common";

export abstract class AbstractRepository<Entity extends AbstractEntity> {
    private queryRunner: QueryRunner;
    constructor(
        private readonly repository: Repository<Entity>
    ) {
        this.queryRunner = this.repository.queryRunner
    }

    protected async queryTransaction<T>(query: () => Promise<T>) {
        try {
            await this.queryRunner.connect()
            await this.queryRunner.startTransaction()

            const result = await query()
            await this.queryRunner.commitTransaction()

            return result
        } catch (e) {
            await this.queryRunner.rollbackTransaction()
            throw e
        } finally {
            await this.queryRunner.release()
        }
    }

    async create() {
        await this.queryTransaction<void>(async () => {
            await this.queryRunner.query(`
                INSERT INTO
            `)
            // handle Error riêng cho DB ngoài HttpException
        })
    }

    async findOneById(id: string): Promise<Entity> {
        return await this.queryTransaction<Entity>(async () => {
            const entity: Entity = await this.queryRunner.query(`
                SELECT * FROM WHERE id=${id}
            `)
            if (!entity) {
                throw new NotFoundException('message here')
            }
            return entity
        })
    }

    async find() {}

    async update() {}

    async delete() {}

    async indexes() {}
}