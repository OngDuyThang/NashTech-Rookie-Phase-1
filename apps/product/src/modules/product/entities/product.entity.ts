import { AbstractEntity } from "@app/database";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, ValidateNested } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Type } from "class-transformer";
import { Field, ObjectType } from "@nestjs/graphql";
import { CategoryEntity } from "../../category/entities/category.entity";
import { AuthorEntity } from "../../author/entities/author.entity";
import { PromotionEntity } from "../../promotion/entities/promotion.entity";
import { ReviewEntity } from "../../review/entities/review.entity";

@Entity({ name: 'product' })
@ObjectType()
export class ProductEntity extends AbstractEntity {
    @Column({ type: 'varchar', length: 255, nullable: false })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @Field()
    title: string;

    @Column({ type: 'text', nullable: true })
    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    description?: string;

    @Column({ type: 'int', nullable: false })
    @IsNumber()
    @IsNotEmpty()
    @Field()
    price: number;

    @ManyToOne(() => AuthorEntity, (author) => author.products, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'author_id' })
    @IsOptional()
    @Type(() => AuthorEntity)
    author?: AuthorEntity;

    @Column({ type: 'uuid', nullable: true })
    @IsUUID(4)
    @IsOptional()
    @Field({ nullable: true })
    author_id?: string;

    // category id
    @ManyToOne(() => CategoryEntity, (category) => category.products, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'category_id' })
    @IsOptional()
    @Type(() => CategoryEntity)
    category?: CategoryEntity

    @Column({ type: 'uuid', nullable: true })
    @IsUUID(4)
    @IsOptional()
    @Field({ nullable: true })
    category_id?: string;

    @ManyToOne(() => PromotionEntity, promotion => promotion.products, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'promotion_id' })
    @IsOptional()
    @Type(() => PromotionEntity)
    promotion?: PromotionEntity;

    @Column({ type: 'uuid', nullable: true })
    @IsUUID(4)
    @IsOptional()
    @Field({ nullable: true })
    promotion_id?: string;

    @OneToMany(() => ReviewEntity, review => review.product)
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ReviewEntity)
    @Field(() => [ReviewEntity])
    reviews: ReviewEntity[]

    @Column({ type: 'boolean', default: true })
    @IsOptional()
    @IsBoolean()
    active?: boolean
    // inventory id
}