import { AbstractEntity } from "@app/database";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsUUID } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Type } from "class-transformer";
import { Field, ObjectType } from "@nestjs/graphql";
import { TempCartEntity } from "../../cart/entities/temp-cart.entity";
import { ProductEntity } from "@app/common";

@Entity({ name: 'temp_cart_item' })
@ObjectType()
export class TempItemEntity extends AbstractEntity {
    @Column({ type: 'uuid', nullable: false })
    @IsUUID(4)
    @IsNotEmpty()
    @Field()
    product_id: string

    @Field(() => ProductEntity, { nullable: true })
    product?: ProductEntity

    @Column({ type: 'int', nullable: false, default: 1 })
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    @Field()
    quantity: number

    @ManyToOne(() => TempCartEntity, cart => cart.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'temp_cart_id' })
    @IsOptional()
    @Type(() => TempCartEntity)
    temp_cart?: TempCartEntity

    @Column({ type: 'uuid', nullable: false })
    @IsUUID(4)
    @IsNotEmpty()
    @Field()
    temp_cart_id: string
}