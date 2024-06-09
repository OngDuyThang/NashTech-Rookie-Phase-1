import { AbstractEntity } from "@app/database";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsUUID, ValidateNested } from "class-validator";
import { Column, Entity, OneToMany } from "typeorm";
import { Type } from "class-transformer";
import { Field, ObjectType } from "@nestjs/graphql";
import { CartItemEntity } from "../../item/entities/item.entity";

@Entity({ name: 'cart' })
@ObjectType()
export class CartEntity extends AbstractEntity {
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

    @OneToMany(() => CartItemEntity, item => item.cart)
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CartItemEntity)
    @Field(() => [CartItemEntity], { nullable: true })
    items?: CartItemEntity[]
}