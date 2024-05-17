import { AbstractEntity } from "@app/database";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, ValidateNested } from "class-validator";
import { Column, Entity, OneToMany } from "typeorm";
import { Type } from "class-transformer";
import { Field, ObjectType } from "@nestjs/graphql";
import { ProductEntity } from "../../product";

@Entity({ name: 'promotion' })
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
    @Field()
    description?: string;

    @Column({ type: 'decimal', nullable: false })
    @IsNumber()
    @IsNotEmpty()
    @Field()
    discount_percent: number

    @OneToMany(() => ProductEntity, product => product.promotion)
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProductEntity)
    @Field(() => [ProductEntity])
    products?: ProductEntity[];
}