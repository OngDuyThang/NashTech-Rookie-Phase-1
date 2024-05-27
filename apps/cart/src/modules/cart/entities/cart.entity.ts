import { AbstractEntity } from "@app/database";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsUUID, ValidateNested } from "class-validator";
import { Column, Entity, OneToMany } from "typeorm";
import { Type } from "class-transformer";
import { Field, ObjectType } from "@nestjs/graphql";
import { ItemEntity } from "../../item/entities/item.entity";

@Entity({ name: 'cart' })
@ObjectType()
export class CartEntity extends AbstractEntity {
    @Column({ type: 'uuid', nullable: false })
    @IsUUID(4)
    @IsNotEmpty()
    @Field()
    user_id: string

    @OneToMany(() => ItemEntity, item => item.cart)
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ItemEntity)
    @Field(() => [ItemEntity], { nullable: true })
    items?: ItemEntity[]

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsOptional()
    total?: number
}