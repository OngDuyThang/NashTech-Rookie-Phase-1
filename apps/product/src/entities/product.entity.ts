import { AbstractEntity } from "@app/database";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, ValidateNested } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { Type } from "class-transformer";
import { AuthorEntity } from "../modules/author";
import { CategoryEntity, SubCategoryEntity } from "../modules/category";
import { PromotionEntity } from "../modules/promotion";
import { ReviewEntity } from "../modules/review";

@Entity({ name: 'product' })
export class ProductEntity extends AbstractEntity {
    @Column({ type: 'varchar', length: 255, nullable: false })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    title: string;

    @Column({ type: 'text', nullable: true })
    @IsOptional()
    @IsString()
    description?: string;

    @Column({ type: 'int', nullable: false })
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @ManyToOne(() => AuthorEntity, (author) => author.products)
    @JoinColumn({ name: 'author_id' })
    @IsOptional()
    @Type(() => AuthorEntity)
    author?: AuthorEntity;

    @Column({ type: 'uuid', nullable: false })
    @IsUUID(4)
    @IsNotEmpty()
    author_id: string;

    // category id
    @ManyToOne(() => CategoryEntity, (category) => category.products)
    @JoinColumn({ name: 'category_id' })
    @IsOptional()
    @Type(() => CategoryEntity)
    category?: CategoryEntity

    @Column({ type: 'uuid', nullable: false })
    @IsUUID(4)
    @IsNotEmpty()
    category_id: string;

    // sub category id
    @ManyToOne(() => SubCategoryEntity, (subCat) => subCat.products)
    @JoinColumn({ name: 'sub_cat_id' })
    @IsOptional()
    @Type(() => SubCategoryEntity)
    sub_cat?: SubCategoryEntity

    @Column({ type: 'uuid', nullable: false })
    @IsUUID(4)
    @IsNotEmpty()
    sub_cat_id: string;

    @ManyToOne(() => PromotionEntity, promotion => promotion.products)
    @JoinColumn({ name: 'promotion_id' })
    @IsOptional()
    @Type(() => PromotionEntity)
    promotion?: PromotionEntity;

    @Column({ type: 'uuid', nullable: false })
    @IsUUID(4)
    @IsNotEmpty()
    promotion_id: string;

    @OneToMany(() => ReviewEntity, review => review.product)
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ReviewEntity)
    reviews: ReviewEntity[]

    @UpdateDateColumn({ type: 'timestamp', default: null })
    @IsNotEmpty()
    deleted_at: Date

    // inventory id
}