import { AbstractEntity } from "@app/database";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, ValidateNested } from "class-validator";
import { Column, Entity, OneToMany } from "typeorm";
import { Type } from "class-transformer";
import { ProductEntity } from "../../../entities/product.entity";

@Entity({ name: 'promotion' })
export class PromotionEntity extends AbstractEntity {
    @Column({ type: 'varchar', length: 255, nullable: false })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @Column({ type: 'text', nullable: true })
    @IsOptional()
    @IsString()
    description?: string;

    @Column({ type: 'decimal', nullable: false })
    @IsNumber()
    @IsNotEmpty()
    discount_percent: number

    @OneToMany(() => ProductEntity, product => product.promotion)
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProductEntity)
    products?: ProductEntity[];
}