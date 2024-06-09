import { AbstractEntity } from "@app/database";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, ValidateNested } from "class-validator";
import { Check, Column, Entity, OneToMany } from "typeorm";
import { Type } from "class-transformer";
import { Field, ObjectType } from "@nestjs/graphql";
import { ProductEntity } from "../../product/entities/product.entity";
import { ProductList } from "../../product/entities/product-list.schema";
import { PROMOTION_CONDITION, PROMOTION_LEVEL } from "@app/common";

@Entity({ name: 'promotion' })
@Check(`"discount_percent" >= 0 AND "discount_percent" <= 100`)
@ObjectType()
export class PromotionEntity extends AbstractEntity {
    @Column({ type: 'varchar', length: 255, nullable: false })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @Field()
    name: string;

    @Column({ type: 'text', nullable: true })
    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    description?: string;

    @Column({ type: 'varchar', nullable: false, default: PROMOTION_LEVEL.PRODUCT })
    @IsEnum(PROMOTION_LEVEL)
    @IsNotEmpty()
    @Field(() => String, { nullable: true, defaultValue: PROMOTION_LEVEL.PRODUCT })
    level: PROMOTION_LEVEL

    @Column({ type: 'varchar', nullable: false, default: PROMOTION_CONDITION.EVENT })
    @IsEnum(PROMOTION_CONDITION)
    @IsNotEmpty()
    @Field(() => String, { nullable: true, defaultValue: PROMOTION_CONDITION.EVENT })
    condition: PROMOTION_CONDITION

    @Column({ type: 'decimal', nullable: false, default: 0 })
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    @Field()
    min_value?: number

    @Column({ type: 'decimal', nullable: false })
    @IsNumber()
    @IsNotEmpty()
    @Field()
    discount_percent: number

    @Column({ type: 'text', nullable: true })
    @IsString()
    @IsOptional()
    @Field({ nullable: true })
    image?: string;

    @OneToMany(() => ProductEntity, product => product.promotion)
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProductEntity)
    @Field(() => ProductList, { nullable: true })
    products?: ProductEntity[];
}