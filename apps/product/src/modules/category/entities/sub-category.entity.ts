import { AbstractEntity } from "@app/database";
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, ValidateNested } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { CategoryEntity } from "./category.entity";
import { Type } from "class-transformer";
import { ProductEntity } from "../../../entities/product.entity";

@Entity({ name: 'product_sub_category' })
export class SubCategoryEntity extends AbstractEntity {
    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @ManyToOne(() => CategoryEntity, (category) => category.sub_cats)
    @JoinColumn({ name: 'category_id' })
    @IsOptional()
    @Type(() => CategoryEntity)
    category?: CategoryEntity;

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