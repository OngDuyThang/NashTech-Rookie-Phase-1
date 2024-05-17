import { AbstractEntity } from "@app/database";
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, ValidateNested } from "class-validator";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, UpdateDateColumn } from "typeorm";
import { Type } from "class-transformer";
import { ProductEntity } from "../../../common/entities/product.entity";
import { Field, ObjectType } from "@nestjs/graphql";

@Entity({ name: 'product_category' })
@ObjectType()
export class CategoryEntity extends AbstractEntity {
    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @Field()
    name: string;

    @OneToOne(() => CategoryEntity, category => category.id)
    @JoinColumn({ name: 'parent_id' })
    @IsOptional()
    @Type(() => CategoryEntity)
    @Field(() => CategoryEntity)
    parent?: CategoryEntity;

    @Column({ type: 'uuid', nullable: true })
    @IsUUID(4)
    @IsOptional()
    @Field()
    parent_id?: string;

    @OneToMany(() => ProductEntity, product => product.category)
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProductEntity)
    @Field(() => [ProductEntity])
    products?: ProductEntity[];

    @UpdateDateColumn({ type: 'timestamp', default: null })
    @IsNotEmpty()
    deleted_at: Date
}