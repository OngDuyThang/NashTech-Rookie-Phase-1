import { AbstractEntity } from "@app/database";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsUUID, ValidateNested } from "class-validator";
import { Column, Entity, OneToMany } from "typeorm";
import { Type } from "class-transformer";
import { Field, ObjectType } from "@nestjs/graphql";
import { OrderItemEntity } from "../../item/entities/item.entity";
import { STATUS } from "@app/common";

@Entity({ name: 'order' })
@ObjectType()
export class OrderEntity extends AbstractEntity {
    // Many to One
    @Column({ type: 'uuid', nullable: false })
    @IsUUID(4)
    @IsNotEmpty()
    @Field()
    user_id: string

    @Column({ type: 'decimal', nullable: false, default: 0 })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Field()
    total?: number

    @OneToMany(() => OrderItemEntity, item => item.order)
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => OrderItemEntity)
    @Field(() => [OrderItemEntity], { nullable: true })
    items?: OrderItemEntity[]

    @Column({ type: 'varchar', length: 20, nullable: false, default: STATUS.PENDING })
    @IsEnum(STATUS)
    @IsOptional()
    @Field(() => String, { nullable: true, defaultValue: STATUS.PENDING })
    status?: STATUS
}