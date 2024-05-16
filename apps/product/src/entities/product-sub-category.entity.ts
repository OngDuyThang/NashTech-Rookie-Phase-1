import { AbstractEntity } from "@app/database";
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, ValidateNested } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { ProductCategoryEntity } from "./product-category.entity";
import { Type } from "class-transformer";
import { ProductEntity } from "./product.entity";

@Entity({ name: 'product_sub_category' })
export class ProductSubCatEntity extends AbstractEntity {
    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @ManyToOne(() => ProductCategoryEntity, (category) => category.sub_cats)
    @JoinColumn({ name: 'category_id' })
    @IsOptional()
    @Type(() => ProductCategoryEntity)
    category?: ProductCategoryEntity;

    @Column({ type: 'uuid', nullable: false })
    @IsUUID(4)
    @IsNotEmpty()
    category_id: string;

    @OneToMany(() => ProductEntity, (product) => product.sub_cat)
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProductEntity)
    products?: ProductEntity[];

    @UpdateDateColumn({ type: 'timestamp', default: null })
    @IsNotEmpty()
    deleted_at: Date
}