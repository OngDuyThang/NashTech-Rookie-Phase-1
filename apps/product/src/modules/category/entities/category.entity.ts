import { AbstractEntity } from "@app/database";
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, ValidateNested } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Type } from "class-transformer";
import { Field, ObjectType } from "@nestjs/graphql";
import { ProductEntity } from "../../product/entities/product.entity";
import { ProductList } from "../../product/entities/product-list.schema";

@Entity({ name: 'product_category' })
@ObjectType()
export class CategoryEntity extends AbstractEntity {
    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @Field()
    name: string;

    @ManyToOne(() => CategoryEntity, category => category.id, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'parent_id' })
    @IsOptional()
    @Type(() => CategoryEntity)
    @Field(() => CategoryEntity, { nullable: true })
    parent?: CategoryEntity;

    @Column({ type: 'uuid', nullable: true })
    @IsUUID(4)
    @IsOptional()
    @Field({ nullable: true })
    parent_id?: string;

    @OneToMany(() => ProductEntity, product => product.category)
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProductEntity)
    @Field(() => ProductList, { nullable: true })
    products?: ProductEntity[];

    @Column({ type: 'boolean', default: true })
    @IsOptional()
    @IsBoolean()
    active?: boolean
}