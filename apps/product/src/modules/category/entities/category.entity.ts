import { AbstractEntity } from "@app/database";
import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from "class-validator";
import { Column, Entity, OneToMany, UpdateDateColumn } from "typeorm";
import { SubCategoryEntity } from "./sub-category.entity";
import { Type } from "class-transformer";
import { ProductEntity } from "../../../entities/product.entity";

@Entity({ name: 'product_category' })
export class CategoryEntity extends AbstractEntity {
    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @OneToMany(() => SubCategoryEntity, subCat => subCat.category)
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => SubCategoryEntity)
    sub_cats?: SubCategoryEntity[];

    @OneToMany(() => ProductEntity, product => product.category)
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProductEntity)
    products?: ProductEntity[];

    @UpdateDateColumn({ type: 'timestamp', default: null })
    @IsNotEmpty()
    deleted_at: Date
}