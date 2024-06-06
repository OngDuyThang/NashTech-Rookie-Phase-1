import { AbstractEntity } from "@app/database";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsUUID } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Type } from "class-transformer";
import { Field, ObjectType } from "@nestjs/graphql";
import { CartEntity } from "../../cart/entities/cart.entity";
import { ProductSchema } from "@app/common";

@Entity({ name: 'cart_item' })
@ObjectType()
export class CartItemEntity extends AbstractEntity {
    @Column({ type: 'uuid', nullable: false })
    @IsUUID(4)
    @IsNotEmpty()
    product_id: string

    @Type(() => ProductSchema)
    @IsOptional()
    @Field(() => ProductSchema, { nullable: true })
    product?: ProductSchema

    @Column({ type: 'int', nullable: false, default: 1 })
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    @Field()
    quantity: number

    @ManyToOne(() => CartEntity, cart => cart.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'cart_id' })
    @IsOptional()
    @Type(() => CartEntity)
    cart?: CartEntity

    @Column({ type: 'uuid', nullable: false })
    @IsUUID(4)
    @IsNotEmpty()
    @Field()
    cart_id: string

    // @Column({ type: 'decimal', nullable: false, default: 0 })
    // @IsNumber()
    // @IsPositive()
    // @IsNotEmpty()
    // @Field({ nullable: true })
    // amount?: number
}