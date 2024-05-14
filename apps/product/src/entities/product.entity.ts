import { AbstractEntity } from "@app/database";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Type } from "class-transformer";
import { ProductCategoryEntity } from "./product-category.entity";
import { ProductSubCatEntity } from "./product-sub-category.entity";

@Entity({ name: 'product' })
export class ProductEntity extends AbstractEntity {
    @Column({ type: 'varchar', length: 255, nullable: false })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @Column({ type: 'text', nullable: true })
    @IsOptional()
    @IsString()
    description: string;

    // category id
    @ManyToOne(() => ProductCategoryEntity, (category) => category.products)
    @JoinColumn({ name: 'category_id' })
    @IsOptional()
    @Type(() => ProductCategoryEntity)
    category: ProductCategoryEntity

    @Column({ type: 'uuid', nullable: false })
    @IsUUID()
    @IsNotEmpty()
    category_id: string;

    // sub category id
    @ManyToOne(() => ProductSubCatEntity, (subCat) => subCat.products)
    @JoinColumn({ name: 'sub_cat_id' })
    @IsOptional()
    @Type(() => ProductSubCatEntity)
    sub_cat: ProductSubCatEntity

    @Column({ type: 'uuid', nullable: false })
    @IsUUID()
    @IsNotEmpty()
    sub_cat_id: string;

    @Column({ type: 'int', nullable: false })
    @IsNumber()
    @IsNotEmpty()
    price: number;

    // discount id
    // inventory id
}