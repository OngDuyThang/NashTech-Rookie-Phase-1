import { AbstractEntity } from "@app/database";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsUUID } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Type } from "class-transformer";
import { Field, ObjectType } from "@nestjs/graphql";
import { ProductSchema } from "@app/common";
import { OrderEntity } from "../../order/entities/order.entity";

@Entity({ name: 'order_item' })
@ObjectType()
export class ItemEntity extends AbstractEntity {
    @Column({ type: 'uuid', nullable: false })
    @IsUUID(4)
    @IsNotEmpty()
    product_id: string

    @Type(() => ProductSchema)
    @IsOptional()
    @Field(() => ProductSchema, { nullable: true })
    product?: ProductSchema

    @Column({ type: 'int', nullable: false, default: 1 })
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    @Field()
    quantity: number

    @ManyToOne(() => OrderEntity, order => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    @IsOptional()
    @Type(() => OrderEntity)
    order?: OrderEntity

    @Column({ type: 'uuid', nullable: false })
    @IsUUID(4)
    @IsNotEmpty()
    @Field()
    order_id: string
}