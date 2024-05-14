import { AbstractEntity } from "@app/database";
import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from "class-validator";
import { Column, Entity, OneToMany } from "typeorm";
import { ProductSubCatEntity } from "./product-sub-category.entity";
import { Type } from "class-transformer";
import { ProductEntity } from "./product.entity";

@Entity({ name: 'product_category' })
export class ProductCategoryEntity extends AbstractEntity {
    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @OneToMany(() => ProductSubCatEntity, subCat => subCat.category)
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProductSubCatEntity)
    sub_cats?: ProductSubCatEntity[];

    @OneToMany(() => ProductEntity, product => product.category)
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProductEntity)
    products?: ProductEntity[];
}