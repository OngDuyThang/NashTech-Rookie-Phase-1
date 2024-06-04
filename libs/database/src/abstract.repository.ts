import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, QueryRunner, Repository } from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import { NotFoundException } from "@nestjs/common";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { Require } from "@app/common";

export abstract class AbstractRepository<Entity extends AbstractEntity> {
    public rawQueryRunner: QueryRunner;
    constructor(
        private readonly repository: Repository<Entity>
    ) {
        this.rawQueryRunner = this.repository.manager.connection.createQueryRunner()
    }

    createQueryRunner() {
        return this.repository.manager.connection.createQueryRunner()
    }

    async queryTransaction<T>(query: () => Promise<T>) {
        if (this.rawQueryRunner.isReleased) {
            this.rawQueryRunner = this.repository.manager.connection.createQueryRunner()
        }
        try {
            await this.rawQueryRunner.connect()
            await this.rawQueryRunner.startTransaction()

            const result = await query()
            await this.rawQueryRunner.commitTransaction()

            return result
        } catch (e) {
            await this.rawQueryRunner.rollbackTransaction()
            throw e
        } finally {
            await this.rawQueryRunner.release()
        }
    }

    async create(
        entity: DeepPartial<Entity>
    ): Promise<Entity> {
        try {
            const newEntity = this.repository.create(entity)
            await this.repository.save(newEntity)
            return newEntity
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    async rawCreate() {
        await this.queryTransaction<void>(async () => {
            await this.rawQueryRunner.query(`
                INSERT INTO
            `)
            // handle Error riêng cho DB ngoài HttpException
        })
    }

    async find(
        options?: FindManyOptions<Entity>
    ): Promise<Entity[]> {
        try {
            return await this.repository.find(options)
        } catch (e) {
            throw e
        }
    }

    async rawFind() {
        return await this.queryTransaction<Entity[]>(async () => {
            const entities: Entity[] = await this.rawQueryRunner.query(`
                SELECT * FROM public.user
            `)
            return entities
        })
    }

    async findList(
        options?: Require<FindManyOptions<Entity>, 'skip' | 'take'>
    ): Promise<[Entity[], number]> {
        try {
            if (options.skip < 0) {
                options.skip = 0
            }

            return await this.repository.findAndCount(options)
        } catch (e) {
            throw e
        }
    }

    async findOne(
        options?: FindOneOptions<Entity>
    ): Promise<Entity> {
        try {
            const entity = await this.repository.findOne(options)
            if (!entity) {
                throw new NotFoundException()
            }
            return entity
        } catch (e) {
            throw e
        }
    }

    async rawFindOne(id: string): Promise<Entity> {
        return await this.queryTransaction<Entity>(async () => {
            const entity: Entity = await this.rawQueryRunner.query(`
                SELECT * FROM WHERE id=${id}
            `)
            if (!entity) {
                throw new NotFoundException('message here')
            }
            return entity
        })
    }

    async update(
        options: FindOptionsWhere<Entity>,
        entity: QueryDeepPartialEntity<Entity>
    ): Promise<void> {
        try {
            const res = await this.repository.update(options, entity)
            if (!res.affected) {
                throw new NotFoundException()
            }
        } catch (e) {
            throw e
        }
    }

    async rawUpdate() {}

    async delete(
        options: FindOptionsWhere<Entity>
    ): Promise<void> {
        try {
            const res = await this.repository.delete(options)
            if (!res.affected) {
                throw new NotFoundException()
            }
        } catch (e) {
            throw e
        }
    }

    async rawDelete() {}

    async rawIndexes() {}
}